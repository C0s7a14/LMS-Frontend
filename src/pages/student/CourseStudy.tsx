import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getCourseQuizzes } from "../../services/quizService";
import type { Quiz } from "../../types/quiz";

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

export default function CourseStudy() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseContentType | null>(null);
  const [selectedAulaId, setSelectedAulaId] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  async function loadCourseContent() {
  try {
    setLoading(true);

    const response = await api.get<CourseContentType>(
      `/courses/${courseId}/content`
    );

    setCourse(response.data);

    const quizzesData = await getCourseQuizzes(Number(courseId));
    setQuizzes(quizzesData);

    const allAulas = response.data.modulos.flatMap(
      (modulo) => modulo.aulas
    );

    const firstIncompleteAula = allAulas.find(
      (aula) => !aula.concluida
    );

    const firstAula = allAulas[0];

    setSelectedAulaId((currentSelectedId) => {
      if (currentSelectedId) {
        return currentSelectedId;
      }

      return firstIncompleteAula?.id || firstAula?.id || null;
    });
  } catch (error) {
    console.log(error);
    toast.error("Erro ao carregar conteúdo do curso");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
  loadCourseContent();
}, [courseId]);

const aulas = useMemo(() => {
  if (!course) {
    return [];
  }

  return course.modulos.flatMap((modulo) => modulo.aulas);
}, [course]);

const selectedAula =
  aulas.find((aula) => aula.id === selectedAulaId) || null;

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
                {course.progresso}% completo
              </span>

              <span className="text-sm text-gray-500 dark:text-gray-400">
                {course.aulas_concluidas}/{course.total_aulas} aulas
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

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_430px] gap-6">
        {/* Conteúdo principal */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden transition-colors">
            {/* Player */}
            <div className="aspect-video bg-[#061229] relative">
              {selectedAula.video_url ? (
                <iframe
                  src={selectedAula.video_url}
                  title={selectedAula.titulo}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white text-center px-6">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl mb-5">
                    <PlayCircle
                      size={56}
                      className="text-blue-500"
                    />
                  </div>

                  <h2 className="text-2xl font-bold">
                    Aula sem vídeo cadastrado
                  </h2>

                  <p className="text-gray-300 mt-2 max-w-xl">
                    Esta aula ainda não possui vídeo. O conteúdo textual está disponível abaixo.
                  </p>
                </div>
              )}
            </div>

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

              {selectedAula.conteudo && (
                <div className="mt-6 bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-2xl ">
                  <h3 className="text-lg font-bold text-[#080E2F] dark:text-white mb-3">
                    Conteúdo da aula
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
        <Trophy
          size={44}
          className="text-green-500"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
          Prova final
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Finalize a prova final para validar o curso e liberar seu certificado.
        </p>

        {!courseCompleted && (
          <div className="mt-3 inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-xl px-3 py-2 text-sm font-semibold">
            <Lock size={16} />
            Conclua todas as aulas para liberar
          </div>
        )}

        {courseCompleted && !finalExam && (
          <div className="mt-3 inline-flex items-center gap-2 bg-gray-100 dark:bg-[#132d46] text-gray-500 dark:text-gray-400 rounded-xl px-3 py-2 text-sm font-semibold">
            <Lock size={16} />
            Prova final ainda não cadastrada
          </div>
        )}

        {courseCompleted && finalExam && (
          <div className="mt-3 inline-flex items-center gap-2 bg-green-500/10 text-green-600 rounded-xl px-3 py-2 text-sm font-semibold">
            <CheckCircle2 size={16} />
            Prova final liberada
          </div>
        )}
      </div>
    </div>

    <button
      type="button"
      disabled={!courseCompleted || !finalExam}
      onClick={() =>
        finalExam &&
        navigate(`/meus-cursos/avaliacao/${finalExam.id}`)
      }
      className={`
        rounded-2xl px-6 py-4 font-semibold transition-all shadow-2xl
        ${
          courseCompleted && finalExam
            ? "bg-blue-500 hover:bg-blue-600 text-white dark:shadow-sm dark:shadow-blue-500"
            : "bg-gray-200 dark:bg-[#132d46] text-gray-400 cursor-not-allowed"
        }
      `}
    >
      Fazer prova final
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
              {courseCompleted && finalExam
                ? "Certificado quase liberado"
                : "Certificado bloqueado"}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {courseCompleted && finalExam
                ? "Faça a prova final e atinja a nota mínima para liberar seu certificado."
                : "O certificado será liberado após concluir as aulas, quizzes e prova final."}
            </p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}