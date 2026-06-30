import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  async function loadCourseContent() {
    try {
      setLoading(true);

      const response = await api.get<CourseContentType>(
        `/courses/${courseId}/content`
      );

      setCourse(response.data);

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

  const courseCompleted = Number(course?.progresso || 0) >= 100;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-500 dark:text-gray-300">
        Carregando curso...
      </div>
    );
  }

  if (!course || !selectedAula) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-500 dark:text-gray-300">
        Nenhuma aula encontrada para este curso.
      </div>
    );
  }

  return (
    <main className="space-y-6">
      {/* Topo */}
      <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors">
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
                <div className="mt-6 bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
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
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors">
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
                    O quiz será liberado após concluir as aulas do módulo.
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-xl px-3 py-2 text-sm font-semibold">
                    <Lock size={16} />
                    Em breve
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="bg-gray-200 dark:bg-[#132d46] text-gray-400 rounded-2xl px-6 py-4 font-semibold cursor-not-allowed"
              >
                Ir para quiz
              </button>
            </div>
          </section>

          {/* Prova final */}
          {courseCompleted && (
            <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors">
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
                      Curso concluído com sucesso
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Você concluiu todas as aulas. A próxima etapa será a prova final.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className="bg-blue-500 text-white rounded-2xl px-6 py-4 font-semibold opacity-70 cursor-not-allowed"
                >
                  Prova final em breve
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Lateral */}
        <aside className="space-y-6">
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors">
            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
              Conteúdo do curso
            </h2>

            <div className="mt-5 space-y-5">
              {course.modulos.map((modulo) => {
                const moduleProgress = getModuleProgress(modulo);

                return (
                  <div
                    key={modulo.id}
                    className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden"
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

          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors">
            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
              Seu progresso
            </h2>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="bg-gray-50 dark:bg-[#0d2238] rounded-2xl p-4 text-center">
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

              <div className="bg-gray-50 dark:bg-[#0d2238] rounded-2xl p-4 text-center">
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

              <div className="bg-gray-50 dark:bg-[#0d2238] rounded-2xl p-4 text-center">
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

            <div className="mt-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5">
              <h3 className="font-bold text-[#080E2F] dark:text-white">
                Certificado bloqueado
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                O certificado será liberado após concluir as aulas, quizzes e prova final.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}