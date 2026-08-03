import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getCourseQuizzes } from "../../services/quizService";
import type { Quiz } from "../../types/quiz";
import { completeCourseReview, getCourseReviewStatus, } from "../../services/courseReviewService";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  FileText,
  Lock,
  PlayCircle,
  Trophy,
  Brain,
  Loader2,
  AlertTriangle,
  Volume2,
   X,
  Maximize2,
} from "lucide-react";

import { api } from "../../services/api";

interface AulaType {
  id: number;
  modulo_id: number;
  titulo: string;
  descricao: string | null;
  conteudo: string | null;
  video_url: string | null;
  pdf_url: string | null;
  duracao: number | null;
  ordem: number;
  status: "rascunho" | "publicada";
  criado_em: string;
  concluida: boolean;
  segundos_assistidos: number;
}

interface ModuloType {
  id: number;
  curso_id: number;
  titulo: string;
  ordem: number;
  aulas: AulaType[];
}

interface CourseContentType {
  id: number;
  titulo: string;
  descricao: string | null;
  thumbnail: string | null;
  criado_em: string;
  progresso: number;
  total_aulas: number;
  aulas_concluidas: number;
  modulos: ModuloType[];
}

interface LessonTechnicalContentType {
  id?: number;
  aula_id?: number;
  objetivo: string;
  contexto_operacional: string;
  conteudo_tecnico: string;
  componentes_envolvidos: string;
  procedimento: string;
  pontos_atencao: string;
  resumo: string;
}

type LessonImageTechnicalSection =
  | "geral"
  | "contexto_operacional"
  | "conteudo_tecnico"
  | "componentes_envolvidos"
  | "procedimento"
  | "pontos_atencao"
  | "resumo";

interface LessonImageType {
  id: number;
  aula_id: number;
  titulo: string | null;
  descricao: string | null;
  imagem_url: string;
  origem: "manual" | "upload_admin" | "sistema";
  pagina_pdf: number | null;
  ordem: number;
  criado_em?: string;
  secao_tecnica: LessonImageTechnicalSection;
}

interface LessonAudioType {
  id: number;
  aula_id: number;
  idioma: string;
  roteiro: string | null;
  audio_url: string | null;
  duracao_segundos: number | null;
  status: "pendente" | "gerando" | "gerado" | "erro";
  criado_em?: string;
  atualizado_em?: string;
}

interface CourseAttemptType {
  nota_final?: number | null;
}

export default function CourseStudy() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseContentType | null>(null);
  const [selectedAulaId, setSelectedAulaId] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  const [reviewStatus, setReviewStatus] = useState<string>("sem_tentativa");
  const [courseAttempt, setCourseAttempt] =
  useState<CourseAttemptType | null>(null);
  const [completingReview, setCompletingReview] = useState(false);
  const [technicalContent, setTechnicalContent] =
  useState<LessonTechnicalContentType | null>(null);


  const [selectedLessonImage, setSelectedLessonImage] =
  useState<LessonImageType | null>(null);

const [loadingTechnicalContent, setLoadingTechnicalContent] = useState(false);
const [lessonImages, setLessonImages] = useState<LessonImageType[]>([]);
const [, setLoadingLessonImages] = useState(false);
const [lessonAudio, setLessonAudio] = useState<LessonAudioType | null>(null);
const [loadingLessonAudio, setLoadingLessonAudio] = useState(false);

const loadLessonTechnicalContent = useCallback(
  async (lessonId: number) => {
    try {
      setLoadingTechnicalContent(true);

      const response =
        await api.get<LessonTechnicalContentType>(
          `/lessons/${lessonId}/technical-content`,
        );

      setTechnicalContent(response.data);
    } catch (error) {
      console.log(error);
      setTechnicalContent(null);
    } finally {
      setLoadingTechnicalContent(false);
    }
  },
  [],
);

const loadLessonImages = useCallback(
  async (lessonId: number) => {
    try {
      setLoadingLessonImages(true);

      const response =
        await api.get<LessonImageType[]>(
          `/lessons/${lessonId}/images`,
        );

      setLessonImages(response.data);
    } catch (error) {
      console.log(error);
      setLessonImages([]);
    } finally {
      setLoadingLessonImages(false);
    }
  },
  [],
);

const loadLessonAudio = useCallback(
  async (lessonId: number) => {
    try {
      setLoadingLessonAudio(true);

      const response =
        await api.get<LessonAudioType | null>(
          `/lessons/${lessonId}/audio`,
        );

      setLessonAudio(response.data);
    } catch (error) {
      console.log(error);
      setLessonAudio(null);
    } finally {
      setLoadingLessonAudio(false);
    }
  },
  [],
);

  const loadCourseContent = useCallback(async () => {
  if (!courseId) {
    toast.error("Curso inválido");
    setLoading(false);
    return;
  }

  try {
    setLoading(true);

    const response =
      await api.get<CourseContentType>(
        `/courses/${courseId}/content`,
      );

    setCourse(response.data);

    const quizzesData =
      await getCourseQuizzes(Number(courseId));

    setQuizzes(quizzesData);

    const reviewData =
      await getCourseReviewStatus(
        Number(courseId),
      );

    setReviewStatus(reviewData.status);
    setCourseAttempt(
      reviewData.curso_tentativa,
    );

    const allAulas =
      response.data.modulos.flatMap(
        (modulo) => modulo.aulas,
      );

    const firstIncompleteAula =
      allAulas.find(
        (aula) => !aula.concluida,
      );

    const firstAula = allAulas[0];

    setSelectedAulaId(
      (currentSelectedId) => {
        if (currentSelectedId) {
          return currentSelectedId;
        }

        return (
          firstIncompleteAula?.id ||
          firstAula?.id ||
          null
        );
      },
    );
  } catch (error) {
    console.log(error);

    toast.error(
      "Erro ao carregar conteúdo do curso",
    );
  } finally {
    setLoading(false);
  }
}, [courseId]);

 useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    void loadCourseContent();
  }, 0);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, [loadCourseContent]);

const aulas = useMemo(() => {
  if (!course) {
    return [];
  }

  return course.modulos.flatMap((modulo) => modulo.aulas);
}, [course]);

const selectedAula =
  aulas.find((aula) => aula.id === selectedAulaId) || null;

useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    if (!selectedAulaId) {
      setTechnicalContent(null);
      setLessonImages([]);
      setLessonAudio(null);
      return;
    }

    void loadLessonTechnicalContent(
      selectedAulaId,
    );

    void loadLessonImages(selectedAulaId);

    void loadLessonAudio(selectedAulaId);
  }, 0);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, [
  selectedAulaId,
  loadLessonTechnicalContent,
  loadLessonImages,
  loadLessonAudio,
]);

  const hasTechnicalContent = technicalContent
  ? Boolean(
      technicalContent.objetivo?.trim() ||
        technicalContent.contexto_operacional?.trim() ||
        technicalContent.conteudo_tecnico?.trim() ||
        technicalContent.componentes_envolvidos?.trim() ||
        technicalContent.procedimento?.trim() ||
        technicalContent.pontos_atencao?.trim() ||
        technicalContent.resumo?.trim()
    )
  : false;

const selectedAulaIndex = selectedAula
  ? aulas.findIndex((aula) => aula.id === selectedAula.id)
  : -1;

const previousAula =
  selectedAulaIndex > 0 ? aulas[selectedAulaIndex - 1] : null;

const nextAula =
  selectedAulaIndex >= 0 && selectedAulaIndex < aulas.length - 1
    ? aulas[selectedAulaIndex + 1]
    : null;

function formatDuration(minutes: number | null) {
  if (!minutes) {
    return "Sem duração";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

function getImagesByTechnicalSection(section: LessonImageTechnicalSection) {
  return lessonImages
    .filter((image) => (image.secao_tecnica || "geral") === section)
    .sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0));
}

function renderTechnicalSectionImages(section: LessonImageTechnicalSection) {
  const images = getImagesByTechnicalSection(section);

  if (images.length === 0) {
    return null;
  }

 return (
  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    {images.map((image) => (
      <button
        key={image.id}
        type="button"
        onClick={() => setSelectedLessonImage(image)}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] text-left transition-all hover:border-blue-500 hover:shadow-lg group"
      >
        <div className="relative bg-gray-50 dark:bg-[#0d2238] flex items-center justify-center">
          <img
            src={image.imagem_url}
            alt={image.titulo || "Imagem da aula"}
            className="w-full max-h-72 object-contain p-3"
          />

          <div className="absolute right-3 top-3 hidden items-center gap-2 rounded-xl bg-black/60 px-3 py-2 text-xs font-semibold text-white backdrop-blur group-hover:flex">
            <Maximize2 size={14} />
            Ampliar
          </div>
        </div>

        <div className="p-4">
          <h4 className="font-bold text-[#080E2F] dark:text-white">
            {image.titulo || "Imagem do manual"}
          </h4>

          {image.descricao && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {image.descricao}
            </p>
          )}

          {image.pagina_pdf && (
            <span className="mt-3 inline-flex rounded-xl bg-gray-100 dark:bg-white/10 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
              Página {image.pagina_pdf}
            </span>
          )}
        </div>
      </button>
    ))}
  </div>
);
}
  function getModuleProgress(modulo: ModuloType) {
    const total = modulo.aulas.length;

    if (total === 0) {
      return {
        total: 0,
        completed: 0,
      };
    }

    const completed = modulo.aulas.filter((aula) => aula.concluida).length;

    return {
      total,
      completed,
    };
  }

  function isAulaLocked(aula: AulaType) {
    const aulaIndex = aulas.findIndex((item) => item.id === aula.id);

    if (aulaIndex <= 0) {
      return false;
    }

    const previous = aulas[aulaIndex - 1];

    return !previous.concluida;
  }

  function handleSelectAula(aula: AulaType) {
    if (isAulaLocked(aula)) {
      toast.error("Conclua a aula anterior para liberar esta aula");
      return;
    }

    setSelectedAulaId(aula.id);
  }

  async function handleCompleteAula() {
    if (!selectedAula) {
      return;
    }

    try {
      setCompleting(true);

      await api.post(`/aulas/${selectedAula.id}/complete`, {
        segundos_assistidos: selectedAula.duracao
          ? selectedAula.duracao * 60
          : 0,
      });

      toast.success("Aula marcada como concluída");

      await loadCourseContent();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao concluir aula");
    } finally {
      setCompleting(false);
    }
  }


  const selectedModule =
  course?.modulos.find((modulo) =>
    modulo.aulas.some((aula) => aula.id === selectedAula?.id)
  ) || null;

const selectedModuleProgress = selectedModule
  ? getModuleProgress(selectedModule)
  : null;

const selectedModuleCompleted =
  selectedModuleProgress &&
  selectedModuleProgress.total > 0 &&
  selectedModuleProgress.completed === selectedModuleProgress.total;

const lessonQuiz = selectedAula
  ? quizzes.find(
      (quiz) =>
        quiz.tipo === "aula" &&
        quiz.aula_id === selectedAula.id &&
        quiz.status === "publicado"
    )
  : null;

const moduleQuiz = selectedModule
  ? quizzes.find(
      (quiz) =>
        quiz.tipo === "modulo" &&
        quiz.modulo_id === selectedModule.id &&
        quiz.status === "publicado"
    )
  : null;

const finalExam = quizzes.find(
  (quiz) =>
    quiz.tipo === "prova_final" &&
    quiz.status === "publicado"
);
  
  const courseCompleted = Number(course?.progresso || 0) >= 100;

  const isInReview = reviewStatus === "em_revisao";
  const isCourseApproved = reviewStatus === "aprovado";
  const isCourseBlocked = reviewStatus === "bloqueado";

  const canAccessFinalExam =
    courseCompleted &&
    Boolean(finalExam) &&
    !isInReview &&
    !isCourseApproved &&
    !isCourseBlocked;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-500 dark:text-gray-300">
        Carregando curso...
      </div>
    );
  }

  if (!course) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-gray-500 dark:text-gray-300">
      Curso não encontrado.
    </div>
  );
}

async function handleCompleteReview() {
  if (!courseId) {
    toast.error("Curso inválido");
    return;
  }

  try {
    setCompletingReview(true);

    await completeCourseReview(Number(courseId));

    toast.success("Revisão concluída. Nova tentativa da prova final liberada.");

    await loadCourseContent();
  } catch (error) {
    console.log(error);

    const err = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
          detail?: string;
        };
      };
    };

    toast.error(
      err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Erro ao concluir revisão"
    );
  } finally {
    setCompletingReview(false);
  }
}

if (course.total_aulas === 0 || aulas.length === 0) {
  return (
    <main className="space-y-6">
      <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors shadow-2xl dark:shadow-sm dark:shadow-blue-500">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-500 dark:text-blue-400">
              <button
                type="button"
                onClick={() => navigate("/courses")}
                className="hover:underline"
              >
                Meus Cursos
              </button>

              <ChevronRight size={16} />

              <span className="text-gray-500 dark:text-gray-400">
                Curso
              </span>
            </div>

            <h1 className="mt-4 text-3xl lg:text-4xl font-bold text-[#080E2F] dark:text-white">
              {course.titulo}
            </h1>

            {course.descricao && (
              <p className="mt-3 max-w-4xl text-gray-500 dark:text-gray-400 leading-relaxed">
                {course.descricao}
              </p>
            )}
          </div>

          <div className="w-full xl:w-[420px]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#080E2F] dark:text-white">
                0% completo
              </span>

              <span className="text-sm text-gray-500 dark:text-gray-400">
                0/0 aulas
              </span>
            </div>

            <div className="h-3 bg-gray-200 dark:bg-[#132d46] rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all w-0" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-10 text-center transition-colors shadow-2xl dark:shadow-sm dark:shadow-blue-500">
        <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center mx-auto">
          <BookOpen
            size={44}
            className="text-blue-500 dark:text-blue-400"
          />
        </div>

        <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white mt-5">
          Este curso ainda não possui aulas cadastradas
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
          O curso já foi criado, mas o conteúdo das aulas ainda não foi publicado. Assim que o administrador cadastrar as aulas, elas aparecerão aqui.
        </p>

        {course.modulos.length > 0 && (
          <div className="mt-8 max-w-2xl mx-auto text-left">
            <h3 className="font-bold text-[#080E2F] dark:text-white mb-3">
              Módulos cadastrados
            </h3>

            <div className="space-y-3">
              {course.modulos.map((modulo) => (
                <div
                  key={modulo.id}
                  className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-4"
                >
                  <p className="font-semibold text-[#080E2F] dark:text-white">
                    {modulo.titulo}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Nenhuma aula cadastrada neste módulo.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate("/courses")}
          className="mt-8 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-6 py-4 font-semibold transition-all shadow-2xl dark:shadow-sm dark:shadow-blue-500"
        >
          Voltar para meus cursos
        </button>
      </section>
    </main>
  );
}

if (!selectedAula) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-gray-500 dark:text-gray-300">
      Nenhuma aula selecionada.
    </div>
  );
}

  return (
    <main className="space-y-6">
      {/* Topo */}
      <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors shadow-2xl dark:shadow-sm
                    dark:shadow-blue-500">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-500 dark:text-blue-400">
              <button
                type="button"
                onClick={() => navigate("/courses")}
                className="hover:underline"
              >
                Meus Cursos
              </button>

              <ChevronRight size={16} />

              <span className="text-gray-500 dark:text-gray-400">
                Curso
              </span>
            </div>

            <h1 className="mt-4 text-3xl lg:text-4xl font-bold text-[#080E2F] dark:text-white">
              {course.titulo}
            </h1>

            {course.descricao && (
              <p className="mt-3 max-w-4xl text-gray-500 dark:text-gray-400 leading-relaxed">
                {course.descricao}
              </p>
            )}
          </div>

          <div className="w-full xl:w-[420px]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#080E2F] dark:text-white">
                {isInReview ? "Em revisão" : `${course.progresso}% completo`}
              </span>

              <span className="text-sm text-gray-500 dark:text-gray-400">
              {course.aulas_concluidas}/{course.total_aulas} aulas concluídas
            </span>
            </div>

            <div className="h-3 bg-gray-200 dark:bg-[#132d46] rounded-full overflow-hidden">
              <div
                style={{
                  width: `${course.progresso}%`,
                }}
                className="h-full bg-blue-500 rounded-full transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {isInReview && (
  <section className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-3xl p-6 shadow-2xl dark:shadow-sm">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center shrink-0">
          <Clock3 size={30} className="text-yellow-600 dark:text-yellow-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
            Você está em revisão
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            Você não atingiu a nota mínima na prova final. Revise o conteúdo do curso antes de liberar uma nova tentativa.
          </p>

          {courseAttempt?.nota_final && (
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 font-semibold">
              Nota da última prova: {courseAttempt.nota_final}%
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleCompleteReview}
        disabled={completingReview}
        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl px-6 py-4 font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {completingReview
          ? "Liberando nova tentativa..."
          : "Concluir revisão e liberar prova"}
      </button>
    </div>
  </section>
)}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_430px] gap-6">
        {/* Conteúdo principal */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden transition-colors">

            {/* Informações da aula */}
            <div className="p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#080E2F] dark:text-white">
                    Aula {selectedAula.ordem} - {selectedAula.titulo}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <Clock3 size={20} />
                      {formatDuration(selectedAula.duracao)}
                    </span>

                    <span className="flex items-center gap-2">
                      <BookOpen size={20} />
                      Aula {selectedAulaIndex + 1} de {aulas.length}
                    </span>

                    {selectedAula.concluida && (
                      <span className="flex items-center gap-2 text-green-500 font-semibold">
                        <CheckCircle2 size={20} />
                        Concluída
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCompleteAula}
                  disabled={selectedAula.concluida || completing}
                  className="
                    bg-blue-500
                    hover:bg-blue-600
                    text-white
                    rounded-2xl
                    px-6
                    py-4
                    font-semibold
                    transition-all
                    shadow-2xl
                    dark:shadow-sm
                    dark:shadow-blue-500
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    flex
                    items-center
                    justify-center
                    gap-2
                    
                  "
                >
                  <CheckCircle2 size={22} />

                  {selectedAula.concluida
                    ? "Aula concluída"
                    : completing
                    ? "Salvando..."
                    : "Marcar como concluída"}
                </button>
              </div>

              {selectedAula.descricao && (
                <p className="mt-5 text-gray-500 dark:text-gray-400 leading-relaxed">
                  {selectedAula.descricao}
                </p>
              )}

               {loadingLessonAudio && (
                <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex items-center gap-3 text-blue-600 dark:text-blue-400 font-semibold">
                  <Loader2 size={22} className="animate-spin" />
                  Carregando áudio da aula...
                </div>
              )}

              {lessonAudio?.audio_url && lessonAudio.status === "gerado" && (
                <div className="mt-6 bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Volume2 size={30} className="text-blue-500 dark:text-blue-400" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                        Áudio da aula
                      </h3>

                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Ouça a explicação técnica complementar desta aula.
                      </p>

                      {lessonAudio.duracao_segundos && (
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Duração aproximada: {Math.ceil(lessonAudio.duracao_segundos / 60)} min
                        </p>
                      )}
                    </div>
                  </div>

                  <audio
                    controls
                    src={lessonAudio.audio_url}
                    className="w-full"
                  >
                    Seu navegador não suporta reprodução de áudio.
                  </audio>

                  {lessonAudio.roteiro && (
                    <details className="mt-5 rounded-2xl bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 p-4">
                      <summary className="cursor-pointer font-bold text-[#080E2F] dark:text-white">
                        Ver roteiro do áudio
                      </summary>

                      <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed whitespace-pre-line">
                        {lessonAudio.roteiro}
                      </p>
                    </details>
                  )}
                </div>
              )}

          

              {loadingTechnicalContent && (
              <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex items-center gap-3 text-blue-600 dark:text-blue-400 font-semibold">
                <Loader2 size={22} className="animate-spin" />
                Carregando conteúdo técnico da aula...
              </div>
            )}

            {hasTechnicalContent && technicalContent && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500/30">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Brain size={30} className="text-blue-500 dark:text-blue-400" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                      Conteúdo técnico da aula
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Material técnico complementar para aprofundar o entendimento da aula.
                    </p>
                  </div>
                </div>

                 {renderTechnicalSectionImages("geral")}

                <div className="space-y-5">
                  {technicalContent.objetivo && (
                    <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
                      <h4 className="font-bold text-[#080E2F] dark:text-white mb-2">
                        Objetivo técnico
                      </h4>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {technicalContent.objetivo}
                      </p>
                    </div>
                  )}

                  {technicalContent.contexto_operacional && (
                    <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
                      <h4 className="font-bold text-[#080E2F] dark:text-white mb-2">
                        Contexto operacional
                      </h4>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {technicalContent.contexto_operacional}
                      </p>
                      {renderTechnicalSectionImages("contexto_operacional")}
                    </div>
                  )}

                  {technicalContent.conteudo_tecnico && (
                    <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
                      <h4 className="font-bold text-[#080E2F] dark:text-white mb-2">
                        Explicação técnica
                      </h4>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {technicalContent.conteudo_tecnico}
                      </p>
                      {renderTechnicalSectionImages("conteudo_tecnico")}
                    </div>
                  )}

                  {technicalContent.componentes_envolvidos && (
                    <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
                      <h4 className="font-bold text-[#080E2F] dark:text-white mb-2">
                        Componentes envolvidos
                      </h4>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {technicalContent.componentes_envolvidos}
                      </p>
                      {renderTechnicalSectionImages("componentes_envolvidos")}
                    </div>
                  )}

                  {technicalContent.procedimento && (
                    <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
                      <h4 className="font-bold text-[#080E2F] dark:text-white mb-2">
                        Procedimento
                      </h4>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {technicalContent.procedimento}
                      </p>
                      {renderTechnicalSectionImages("procedimento")}
                    </div>
                  )}

                  {technicalContent.pontos_atencao && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5">
                      <h4 className="font-bold text-[#080E2F] dark:text-white mb-2 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-400" />
                        Pontos de atenção
                      </h4>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {technicalContent.pontos_atencao}
                      </p>
                      {renderTechnicalSectionImages("pontos_atencao")}
                    </div>
                  )}

                  {technicalContent.resumo && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-2xl p-5">
                  <h4 className="font-bold text-[#080E2F] dark:text-white mb-2">
                    Resumo técnico
                  </h4>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {technicalContent.resumo}
                  </p>

                  {renderTechnicalSectionImages("resumo")}
                </div>
              )}
                </div>
              </div>
            )}

            {selectedAula.conteudo && (
                    <div className="mt-6 bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-2xl ">
                      <h3 className="text-lg font-bold text-[#080E2F] dark:text-white mb-3">
                        Resumo textual da aula
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {selectedAula.conteudo}
                      </p>

                    </div>
                  )}      

              {selectedAula.pdf_url && (
                <a
                  href={selectedAula.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    border
                    border-blue-500/40
                    text-blue-500
                    dark:text-blue-400
                    rounded-2xl
                    px-5
                    py-3
                    font-semibold
                    hover:bg-blue-500/10
                    transition-all
                  "
                >
                  <FileText size={20} />
                  Abrir material da aula
                </a>
              )}


              {lessonQuiz && selectedAula.concluida && (
  <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h3 className="font-bold text-[#080E2F] dark:text-white">
        Quiz da aula
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Responda o quiz desta aula para validar seu aprendizado.
      </p>
    </div>

    <button
      type="button"
      onClick={() =>
        navigate(`/meus-cursos/avaliacao/${lessonQuiz.id}`)
      }
      className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-6 py-3 font-semibold transition-all shadow-2xl dark:shadow-sm dark:shadow-blue-500"
    >
      Fazer quiz
    </button>
  </div>
)}

              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button
                  type="button"
                  disabled={!previousAula}
                  onClick={() =>
                    previousAula && setSelectedAulaId(previousAula.id)
                  }
                  className="
                    flex-1
                    border
                    border-gray-200
                    dark:border-white/10
                    bg-white
                    dark:bg-[#091a2c]
                    text-[#080E2F]
                    dark:text-white
                    rounded-2xl
                    py-4
                    font-semibold
                    flex
                    items-center
                    justify-center
                    shadow-2xl
                    dark:shadow-sm
                    dark:shadow-blue-500
                    gap-2
                    hover:bg-gray-50
                    dark:hover:bg-white/5
                    transition-all
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  <ChevronLeft size={22} />
                  Aula anterior
                </button>

                <button
                  type="button"
                  disabled={!nextAula || isAulaLocked(nextAula)}
                  onClick={() => nextAula && handleSelectAula(nextAula)}
                  className="
                    flex-1
                    bg-blue-500
                    hover:bg-blue-600
                    text-white
                    rounded-2xl
                    py-4
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-2xl
                    dark:shadow-sm
                    dark:shadow-blue-500
                    transition-all
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  Próxima aula
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </section>

          {/* Quiz do módulo */}
<section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors shadow-2xl dark:shadow-sm dark:shadow-blue-500">
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex items-center gap-5">
      <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center">
        <FileText
          size={42}
          className="text-blue-500 dark:text-blue-400"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
          Quiz do módulo
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {selectedModule
            ? `Valide seus conhecimentos sobre o módulo "${selectedModule.titulo}".`
            : "Selecione uma aula para visualizar o quiz do módulo."}
        </p>

        {!moduleQuiz && (
          <div className="mt-3 inline-flex items-center gap-2 bg-gray-100 dark:bg-[#132d46] text-gray-500 dark:text-gray-400 rounded-xl px-3 py-2 text-sm font-semibold">
            <Lock size={16} />
            Nenhum quiz cadastrado para este módulo
          </div>
        )}

        {moduleQuiz && !selectedModuleCompleted && (
          <div className="mt-3 inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-xl px-3 py-2 text-sm font-semibold">
            <Lock size={16} />
            Conclua as aulas do módulo para liberar
          </div>
        )}

        {moduleQuiz && selectedModuleCompleted && (
          <div className="mt-3 inline-flex items-center gap-2 bg-green-500/10 text-green-600 rounded-xl px-3 py-2 text-sm font-semibold">
            <CheckCircle2 size={16} />
            Quiz liberado
          </div>
        )}
      </div>
    </div>

    <button
      type="button"
      disabled={!moduleQuiz || !selectedModuleCompleted}
      onClick={() =>
        moduleQuiz &&
        navigate(`/meus-cursos/avaliacao/${moduleQuiz.id}`)
      }
      className={`
        rounded-2xl px-6 py-4 font-semibold transition-all shadow-2xl
        ${
          moduleQuiz && selectedModuleCompleted
            ? "bg-blue-500 hover:bg-blue-600 text-white dark:shadow-sm dark:shadow-blue-500"
            : "bg-gray-200 dark:bg-[#132d46] text-gray-400 cursor-not-allowed"
        }
      `}
    >
      Ir para quiz
    </button>
  </div>
</section>

          {/* Prova final */}
<section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors shadow-2xl dark:shadow-sm dark:shadow-blue-500">
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex items-center gap-5">
      <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center">
        <Trophy size={44} className="text-green-500" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
          Prova final
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Finalize a prova final para validar o curso e liberar seu certificado.
        </p>

        {isInReview && (
          <div className="mt-3 inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-xl px-3 py-2 text-sm font-semibold">
            <Lock size={16} />
            Prova bloqueada até concluir a revisão
          </div>
        )}

        {isCourseApproved && (
          <div className="mt-3 inline-flex items-center gap-2 bg-green-500/10 text-green-600 rounded-xl px-3 py-2 text-sm font-semibold">
            <CheckCircle2 size={16} />
            Curso aprovado
          </div>
        )}

        {isCourseBlocked && (
          <div className="mt-3 inline-flex items-center gap-2 bg-red-500/10 text-red-600 rounded-xl px-3 py-2 text-sm font-semibold">
            <Lock size={16} />
            Limite de tentativas atingido
          </div>
        )}

        {!isInReview && !isCourseApproved && !isCourseBlocked && !courseCompleted && (
          <div className="mt-3 inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-xl px-3 py-2 text-sm font-semibold">
            <Lock size={16} />
            Conclua todas as aulas para liberar
          </div>
        )}

        {!isInReview && !isCourseApproved && !isCourseBlocked && courseCompleted && !finalExam && (
          <div className="mt-3 inline-flex items-center gap-2 bg-gray-100 dark:bg-[#132d46] text-gray-500 dark:text-gray-400 rounded-xl px-3 py-2 text-sm font-semibold">
            <Lock size={16} />
            Prova final ainda não cadastrada
          </div>
        )}

        {canAccessFinalExam && (
          <div className="mt-3 inline-flex items-center gap-2 bg-green-500/10 text-green-600 rounded-xl px-3 py-2 text-sm font-semibold">
            <CheckCircle2 size={16} />
            Prova final liberada
          </div>
        )}
      </div>
    </div>

    <button
      type="button"
      disabled={!canAccessFinalExam}
      onClick={() =>
        finalExam &&
        canAccessFinalExam &&
        navigate(`/meus-cursos/avaliacao/${finalExam.id}`)
      }
      className={`
        rounded-2xl px-6 py-4 font-semibold transition-all shadow-2xl
        ${
          canAccessFinalExam
            ? "bg-blue-500 hover:bg-blue-600 text-white dark:shadow-sm dark:shadow-blue-500"
            : "bg-gray-200 dark:bg-[#132d46] text-gray-400 cursor-not-allowed"
        }
      `}
    >
      {isInReview
        ? "Prova bloqueada"
        : isCourseApproved
        ? "Curso aprovado"
        : isCourseBlocked
        ? "Bloqueado"
        : "Fazer prova final"}
    </button>
  </div>
</section>
</div>

        {/* Lateral */}
        <aside className="space-y-6">
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors shadow-2xl dark:shadow-sm
                    dark:shadow-blue-500">
            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
              Conteúdo do curso
            </h2>

            <div className="mt-5 space-y-5">
              {course.modulos.map((modulo) => {
                const moduleProgress = getModuleProgress(modulo);

                return (
                  <div
                    key={modulo.id}
                    className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl dark:shadow-sm
                    dark:shadow-blue-500"
                  >
                    <div className="p-4 bg-gray-50 dark:bg-[#0d2238] flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-[#080E2F] dark:text-white">
                          {modulo.titulo}
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {moduleProgress.completed}/{moduleProgress.total} aulas
                        </p>
                      </div>

                      {moduleProgress.total > 0 &&
                        moduleProgress.completed === moduleProgress.total && (
                          <CheckCircle2
                            size={24}
                            className="text-green-500"
                          />
                        )}
                    </div>

                    <div className="p-3 space-y-2">
                      {modulo.aulas.map((aula) => {
                        const active = aula.id === selectedAula.id;
                        const locked = isAulaLocked(aula);

                        return (
                          <button
                            key={aula.id}
                            type="button"
                            onClick={() => handleSelectAula(aula)}
                            className={`
                              w-full
                              text-left
                              rounded-2xl
                              p-4
                              border
                              transition-all
                              ${
                                active
                                  ? "bg-blue-500/10 border-blue-500 text-blue-500 dark:text-blue-400"
                                  : "bg-white dark:bg-[#091a2c] border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                              }
                              ${locked ? "opacity-60" : ""}
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                {locked ? (
                                  <Lock
                                    size={20}
                                    className="text-gray-400"
                                  />
                                ) : aula.concluida ? (
                                  <CheckCircle2
                                    size={20}
                                    className="text-green-500"
                                  />
                                ) : active ? (
                                  <PlayCircle size={20} />
                                ) : (
                                  <Circle
                                    size={20}
                                    className="text-gray-400"
                                  />
                                )}
                              </div>

                              <div className="flex-1">
                                <p className="font-semibold">
                                  {aula.ordem}. {aula.titulo}
                                </p>

                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {formatDuration(aula.duracao)}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors shadow-2xl dark:shadow-sm
                    dark:shadow-blue-500">
            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
              Seu progresso
            </h2>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="bg-gray-50 dark:bg-[#0d2238] rounded-2xl p-4 text-center shadow-2xl dark:shadow-sm
                    dark:shadow-blue-500">
                <BookOpen
                  size={28}
                  className="mx-auto text-blue-500 dark:text-blue-400"
                />

                <p className="text-2xl font-bold text-[#080E2F] dark:text-white mt-2">
                  {course.total_aulas}
                </p>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Aulas
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-[#0d2238] rounded-2xl p-4 text-center shadow-2xl dark:shadow-sm
                    dark:shadow-blue-500">
                <CheckCircle2
                  size={28}
                  className="mx-auto text-green-500"
                />

                <p className="text-2xl font-bold text-[#080E2F] dark:text-white mt-2">
                  {course.aulas_concluidas}
                </p>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Concluídas
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-[#0d2238] rounded-2xl p-4 text-center shadow-2xl dark:shadow-sm
                    dark:shadow-blue-500">
                <Award
                  size={28}
                  className="mx-auto text-blue-500 dark:text-blue-400"
                />

                <p className="text-2xl font-bold text-[#080E2F] dark:text-white mt-2">
                  {course.progresso}%
                </p>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Progresso
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5 shadow-2xl dark:shadow-sm
                    dark:shadow-blue-500">
              <h3 className="font-bold text-[#080E2F] dark:text-white">
                {isCourseApproved
                  ? "Certificado liberado"
                  : isInReview
                  ? "Curso em revisão"
                  : courseCompleted && finalExam
                  ? "Certificado quase liberado"
                  : "Certificado bloqueado"}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {isCourseApproved
                  ? "Você foi aprovado na prova final. O certificado já está disponível."
                  : isInReview
                  ? "Revise o conteúdo do curso e conclua a revisão para liberar uma nova tentativa da prova final."
                  : courseCompleted && finalExam
                  ? "Faça a prova final e atinja a nota mínima para liberar seu certificado."
                  : "O certificado será liberado após concluir as aulas, quizzes e prova final."}
              </p>
            </div>
          </section>
         </aside>
      </div>

      {selectedLessonImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 px-4 py-6"
          onClick={() => setSelectedLessonImage(null)}
        >
          <div
            className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-3xl bg-white dark:bg-[#091a2c] border border-white/10 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 dark:border-white/10 p-5">
              <div>
                <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                  {selectedLessonImage.titulo || "Imagem do manual"}
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedLessonImage.descricao ||
                    "Imagem técnica vinculada à aula."}
                  {selectedLessonImage.pagina_pdf
                    ? ` Página ${selectedLessonImage.pagina_pdf} do manual.`
                    : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLessonImage(null)}
                className="rounded-2xl bg-gray-100 dark:bg-white/10 p-3 text-gray-600 dark:text-gray-300 hover:bg-red-500/10 hover:text-red-500 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto bg-gray-50 dark:bg-[#071827] p-4">
              <img
                src={selectedLessonImage.imagem_url}
                alt={selectedLessonImage.titulo || "Imagem ampliada da aula"}
                className="mx-auto max-h-[72vh] w-auto max-w-full object-contain rounded-2xl bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}