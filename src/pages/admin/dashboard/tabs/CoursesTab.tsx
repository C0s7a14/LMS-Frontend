import {
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Clock3,
  Cpu,
  Download,
  FileText,
  Loader2,
  MoreVertical,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

import ActionButton from "../components/ActionButton";
import StatCard from "../components/StatCard";
import StatsGrid from "../components/StatsGrid";
import TableCard from "../components/TableCard";

import type {
  AdminDashboardData,
  CoursePublicationStatus,
  CourseType,
  DeviceType,
} from "../types/adminDashboard.types";

interface CoursesTabProps {
  courses: CourseType[];
  search: string;
  dashboardData: AdminDashboardData | null;
  devices: DeviceType[];
  createCourse: () => void;
  manageCourseLessons: (courseId: number) => void;
  deleteCourse: (course: CourseType) => void;
  updateCourseStatus: (
    course: CourseType,
    status: CoursePublicationStatus,
  ) => void;
  updatingCourseStatusId: number | null;
  editCourse: (course: CourseType) => void;
}

export default function CoursesTab({
  courses,
  search,
  dashboardData,
  devices,
  createCourse,
  manageCourseLessons,
  deleteCourse,
  updateCourseStatus,
  updatingCourseStatusId,
  editCourse,
}: CoursesTabProps) {
  const resumo =
    dashboardData?.resumo;

  const [
    selectedCourseActions,
    setSelectedCourseActions,
  ] = useState<CourseType | null>(
    null,
  );

  const [
    selectedCourseForDevice,
    setSelectedCourseForDevice,
  ] = useState<CourseType | null>(
    null,
  );

  const [
    selectedCourseDeviceId,
    setSelectedCourseDeviceId,
  ] = useState("");

  const [
    linkingCourseDevice,
    setLinkingCourseDevice,
  ] = useState(false);

  const term =
    search
      .toLowerCase()
      .trim();

  const filteredCourses =
    courses.filter((course) => {
      return (
        course.titulo
          ?.toLowerCase()
          .includes(term) ||
        course.descricao
          ?.toLowerCase()
          .includes(term) ||
        course.status
          ?.toLowerCase()
          .includes(term) ||
        course.curso_publicacao_status
          ?.toLowerCase()
          .includes(term)
      );
    });

  async function handleLinkDeviceToCourse() {
    try {
      if (!selectedCourseForDevice) {
        return;
      }

      if (!selectedCourseDeviceId) {
        toast.error(
          "Selecione um dispositivo.",
        );
        return;
      }

      setLinkingCourseDevice(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        toast.error(
          "Sessão expirada. Faça login novamente.",
        );
        return;
      }

      await axios.post(
        `http://localhost:3333/devices/courses/${selectedCourseForDevice.id}/devices/${selectedCourseDeviceId}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      );

      toast.success(
        "Dispositivo vinculado ao curso.",
      );

      setSelectedCourseForDevice(
        null,
      );

      setSelectedCourseDeviceId("");

      window.location.reload();
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data
              ?.message ||
            "Erro ao vincular dispositivo ao curso.",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao vincular dispositivo ao curso.",
      );
    } finally {
      setLinkingCourseDevice(
        false,
      );
    }
  }

  function getCourseStatus(
    course: CourseType,
  ) {
    return (
      course.status ||
      course.curso_publicacao_status ||
      "publicado"
    );
  }

  function getCourseStatusStyle(
    status: string,
  ) {
    if (status === "publicado") {
      return `
        bg-green-500/15
        text-green-600
        dark:text-green-400
      `;
    }

    if (status === "rascunho") {
      return `
        bg-orange-500/15
        text-orange-600
        dark:text-orange-400
      `;
    }

    return `
      bg-gray-500/15
      text-gray-600
      dark:text-gray-400
    `;
  }

  function getCourseStatusLabel(
    status: string,
  ) {
    if (status === "publicado") {
      return "Publicado";
    }

    if (status === "rascunho") {
      return "Rascunho";
    }

    if (status === "arquivado") {
      return "Arquivado";
    }

    return status;
  }

  function getNextCourseStatus(
    status: string,
  ): CoursePublicationStatus {
    if (status === "rascunho") {
      return "publicado";
    }

    if (status === "publicado") {
      return "arquivado";
    }

    return "rascunho";
  }

  function getStatusActionLabel(
    status: string,
  ) {
    if (status === "rascunho") {
      return "Publicar";
    }

    if (status === "publicado") {
      return "Arquivar";
    }

    return "Restaurar";
  }

  function getStatusActionStyle(
    status: string,
  ) {
    if (status === "rascunho") {
      return `
        bg-green-500/10
        text-green-600
        dark:text-green-400
        hover:bg-green-500/20
      `;
    }

    if (status === "publicado") {
      return `
        bg-orange-500/10
        text-orange-600
        dark:text-orange-400
        hover:bg-orange-500/20
      `;
    }

    return `
      bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
      text-[var(--company-primary)]
      hover:bg-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]
    `;
  }

  return (
    <div
      className="
        w-full
        min-w-0

        space-y-6
        sm:space-y-8
      "
    >
      {/* MÉTRICAS */}
      <StatsGrid>
        <StatCard
          title="Total de Cursos"
          value={
            resumo?.totalCursos ??
            courses.length
          }
          subtitle="Todos os cursos"
          icon={BookOpen}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Publicados"
          value={
            resumo
              ?.cursosPublicados ?? 0
          }
          subtitle="Disponíveis"
          icon={ShieldCheck}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Rascunhos"
          value={
            resumo
              ?.cursosRascunho ?? 0
          }
          subtitle="Não publicados"
          icon={FileText}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Arquivados"
          value={
            resumo
              ?.cursosArquivados ?? 0
          }
          subtitle="Fora da listagem"
          icon={Clock3}
          color="bg-gray-500/15 text-gray-600 dark:text-gray-400"
        />

        <StatCard
          title="Alunos"
          value={
            resumo?.totalAlunos ?? 0
          }
          subtitle="Perfil estudante"
          icon={Users}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Revisões"
          value={
            resumo
              ?.revisoesPendentes ?? 0
          }
          subtitle="Pendentes"
          icon={Activity}
          color="bg-red-500/15 text-red-600 dark:text-red-400"
        />
      </StatsGrid>

      <div
        className="
          min-w-0

          grid
          grid-cols-1

          2xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.8fr)]

          gap-5
          sm:gap-6
        "
      >
        {/* LISTA */}
        <div className="min-w-0">
          <TableCard title="Lista de Cursos">
            {/* DESKTOP */}
            <div
              className="
                hidden
                xl:block

                min-w-[760px]
              "
            >
              <div
                className="
                  grid
                  grid-cols-[minmax(0,1fr)_105px_85px_110px_56px]

                  gap-4

                  pb-3

                  text-sm
                  text-gray-500
                  dark:text-gray-400

                  border-b
                  border-gray-200
                  dark:border-white/10
                "
              >
                <span>Curso</span>
                <span>Status</span>
                <span>Aulas</span>
                <span>Criação</span>

                <span className="text-right">
                  Ações
                </span>
              </div>

              {filteredCourses.length >
              0 ? (
                filteredCourses.map(
                  (course) => {
                    const status =
                      getCourseStatus(
                        course,
                      );

                    return (
                      <div
                        key={course.id}
                        className="
                          grid
                          grid-cols-[minmax(0,1fr)_105px_85px_110px_56px]

                          gap-4

                          items-center

                          py-4

                          border-b
                          border-gray-200
                          dark:border-white/10

                          last:border-b-0
                        "
                      >
                        <div
                          className="
                            flex
                            items-center

                            gap-3

                            min-w-0
                          "
                        >
                          <CourseThumbnail
                            course={
                              course
                            }
                          />

                          <div className="min-w-0">
                            <h3
                              className="
                                font-semibold

                                text-[#080E2F]
                                dark:text-white

                                truncate
                              "
                              title={
                                course.titulo
                              }
                            >
                              {
                                course.titulo
                              }
                            </h3>

                            <p
                              className="
                                mt-1

                                text-sm

                                text-gray-500
                                dark:text-gray-400

                                truncate
                              "
                              title={
                                course.descricao ||
                                undefined
                              }
                            >
                              {course.descricao ||
                                "Sem descrição"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`
                            w-fit

                            px-3
                            py-1

                            rounded-xl

                            font-semibold
                            text-xs

                            whitespace-nowrap

                            ${getCourseStatusStyle(
                              status,
                            )}
                          `}
                        >
                          {getCourseStatusLabel(
                            status,
                          )}
                        </span>

                        <p
                          className="
                            text-sm

                            text-gray-600
                            dark:text-gray-400
                          "
                        >
                          {course.total_aulas ??
                            0}{" "}
                          aulas
                        </p>

                        <p
                          className="
                            text-sm

                            text-gray-600
                            dark:text-gray-400

                            whitespace-nowrap
                          "
                        >
                          {course.criado_em
                            ? new Date(
                                course.criado_em,
                              ).toLocaleDateString(
                                "pt-BR",
                              )
                            : "—"}
                        </p>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedCourseActions(
                                course,
                              )
                            }
                            title="Ações do curso"
                            className="
                              inline-flex

                              h-10
                              w-10

                              items-center
                              justify-center

                              rounded-xl

                              bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                              text-[var(--company-primary)]

                              hover:bg-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]

                              transition-all
                            "
                          >
                            <MoreVertical
                              size={20}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  },
                )
              ) : (
                <CourseEmptyState />
              )}
            </div>

            {/* MOBILE / TABLET / NOTEBOOK MENOR */}
            <div
              className="
                xl:hidden

                grid
                grid-cols-1

                md:grid-cols-2

                gap-3
                sm:gap-4
              "
            >
              {filteredCourses.length >
              0 ? (
                filteredCourses.map(
                  (course) => {
                    const status =
                      getCourseStatus(
                        course,
                      );

                    return (
                      <article
                        key={course.id}
                        className="
                          w-full
                          min-w-0

                          rounded-2xl

                          border
                          border-gray-200
                          dark:border-white/10

                          bg-white
                          dark:bg-[#091a2c]

                          p-4

                          shadow-lg
                          dark:shadow-none
                        "
                      >
                        {/* Cabeçalho */}
                        <div
                          className="
                            flex
                            items-start

                            gap-3

                            min-w-0
                          "
                        >
                          <CourseThumbnail
                            course={
                              course
                            }
                          />

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <h3
                              className="
                                font-bold

                                text-[#080E2F]
                                dark:text-white

                                leading-snug
                                break-words
                              "
                            >
                              {
                                course.titulo
                              }
                            </h3>

                            <span
                              className={`
                                inline-flex

                                mt-2

                                px-3
                                py-1

                                rounded-xl

                                text-xs
                                font-semibold

                                ${getCourseStatusStyle(
                                  status,
                                )}
                              `}
                            >
                              {getCourseStatusLabel(
                                status,
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Descrição */}
                        <p
                          className="
                            mt-4

                            text-sm

                            text-gray-500
                            dark:text-gray-400

                            leading-relaxed
                            break-words
                          "
                        >
                          {course.descricao ||
                            "Sem descrição"}
                        </p>

                        {/* Dados */}
                        <div
                          className="
                            grid
                            grid-cols-2

                            gap-3

                            mt-4
                          "
                        >
                          <div
                            className="
                              rounded-xl

                              bg-gray-50
                              dark:bg-white/5

                              p-3
                            "
                          >
                            <p
                              className="
                                text-xs

                                text-gray-500
                                dark:text-gray-400
                              "
                            >
                              Aulas
                            </p>

                            <p
                              className="
                                mt-1

                                font-bold

                                text-[#080E2F]
                                dark:text-white
                              "
                            >
                              {course.total_aulas ??
                                0}
                            </p>
                          </div>

                          <div
                            className="
                              rounded-xl

                              bg-gray-50
                              dark:bg-white/5

                              p-3
                            "
                          >
                            <p
                              className="
                                text-xs

                                text-gray-500
                                dark:text-gray-400
                              "
                            >
                              Criação
                            </p>

                            <p
                              className="
                                mt-1

                                text-sm
                                font-bold

                                text-[#080E2F]
                                dark:text-white
                              "
                            >
                              {course.criado_em
                                ? new Date(
                                    course.criado_em,
                                  ).toLocaleDateString(
                                    "pt-BR",
                                  )
                                : "—"}
                            </p>
                          </div>
                        </div>

                        {/* Ações */}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCourseActions(
                              course,
                            )
                          }
                          className="
                            w-full

                            mt-4

                            rounded-xl

                            bg-gradient-to-r
                            from-[var(--company-primary)]
                            to-[var(--company-secondary)]

                            px-4
                            py-3

                            flex
                            items-center
                            justify-center
                            gap-2

                            text-sm
                            font-semibold
                            text-white

                            shadow-lg

                            transition-all

                            active:scale-[0.98]
                          "
                        >
                          <MoreVertical
                            size={18}
                          />

                          Ações do curso
                        </button>
                      </article>
                    );
                  },
                )
              ) : (
                <div className="md:col-span-2">
                  <CourseEmptyState />
                </div>
              )}
            </div>
          </TableCard>
        </div>

        {/* AÇÕES RÁPIDAS */}
        <div className="min-w-0">
          <TableCard title="Ações Rápidas">
            <div
              className="
                grid
                grid-cols-1

                sm:grid-cols-2
                2xl:grid-cols-1

                gap-4
              "
            >
              <ActionButton
                icon={BookOpen}
                title="Criar curso"
                subtitle="Iniciar um novo curso"
                onClick={createCourse}
              />

              <ActionButton
                icon={Award}
                title="Ver certificados"
                subtitle="Acompanhar certificados emitidos"
                onClick={() =>
                  alert(
                    "Use a aba Certificados.",
                  )
                }
              />

              <ActionButton
                icon={Download}
                title="Exportar catálogo"
                subtitle="Exportar lista de cursos"
                onClick={() =>
                  alert(
                    "Conectar exportação depois.",
                  )
                }
              />
            </div>
          </TableCard>
        </div>
      </div>

      {/* MODAL DE AÇÕES */}
      {selectedCourseActions && (
        <div
          className="
            fixed
            inset-0
            z-[110]

            flex
            items-center
            justify-center

            bg-black/60
            backdrop-blur-[2px]

            p-3
            sm:p-4
          "
        >
          <div
            role="dialog"
            aria-modal="true"
            className="
              w-full
              max-w-md

              max-h-[calc(100dvh-24px)]

              overflow-y-auto

              rounded-2xl
              sm:rounded-3xl

              bg-white
              dark:bg-[#091a2c]

              border
              border-gray-200
              dark:border-white/10

              p-5
              sm:p-6

              shadow-2xl
            "
          >
            <div
              className="
                flex
                items-start
                justify-between

                gap-4
              "
            >
              <div className="min-w-0">
                <h2
                  className="
                    text-xl
                    sm:text-2xl

                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Ações do curso
                </h2>

                <p
                  className="
                    mt-1

                    text-sm
                    sm:text-base

                    text-gray-500
                    dark:text-gray-400

                    break-words
                  "
                >
                  {
                    selectedCourseActions.titulo
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCourseActions(
                    null,
                  )
                }
                aria-label="Fechar modal"
                className="
                  w-10
                  h-10

                  rounded-xl

                  flex
                  items-center
                  justify-center

                  text-gray-500

                  hover:text-red-500
                  hover:bg-red-500/10

                  transition-all

                  shrink-0
                "
              >
                <X size={23} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {/* Aulas */}
              <button
                type="button"
                onClick={() => {
                  manageCourseLessons(
                    selectedCourseActions.id,
                  );

                  setSelectedCourseActions(
                    null,
                  );
                }}
                className="
                  w-full

                  inline-flex
                  items-center
                  justify-between

                  gap-3

                  rounded-2xl

                  bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                  px-4
                  py-3

                  text-sm
                  font-semibold

                  text-[var(--company-primary)]

                  hover:bg-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]

                  transition-all
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                  "
                >
                  <BookOpen size={18} />

                  Gerenciar aulas
                </span>

                <ArrowRight
                  size={18}
                  className="shrink-0"
                />
              </button>

              {/* Dispositivo */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCourseForDevice(
                    selectedCourseActions,
                  );

                  setSelectedCourseActions(
                    null,
                  );

                  setSelectedCourseDeviceId(
                    "",
                  );
                }}
                className="
                  w-full

                  inline-flex
                  items-center
                  justify-between

                  gap-3

                  rounded-2xl

                  bg-cyan-500/10

                  px-4
                  py-3

                  text-sm
                  font-semibold

                  text-cyan-600
                  dark:text-cyan-400

                  hover:bg-cyan-500/20

                  transition-all
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                  "
                >
                  <Cpu size={18} />

                  Vincular dispositivo
                </span>

                <ArrowRight
                  size={18}
                  className="shrink-0"
                />
              </button>

              {/* Status */}
              <button
                type="button"
                onClick={() => {
                  const currentStatus =
                    getCourseStatus(
                      selectedCourseActions,
                    );

                  updateCourseStatus(
                    selectedCourseActions,
                    getNextCourseStatus(
                      currentStatus,
                    ),
                  );

                  setSelectedCourseActions(
                    null,
                  );
                }}
                disabled={
                  updatingCourseStatusId ===
                  selectedCourseActions.id
                }
                className={`
                  w-full

                  inline-flex
                  items-center
                  justify-between

                  gap-3

                  rounded-2xl

                  px-4
                  py-3

                  text-sm
                  font-semibold

                  transition-all

                  disabled:opacity-60
                  disabled:cursor-not-allowed

                  ${getStatusActionStyle(
                    getCourseStatus(
                      selectedCourseActions,
                    ),
                  )}
                `}
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                  "
                >
                  {updatingCourseStatusId ===
                  selectedCourseActions.id ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <ShieldCheck
                      size={18}
                    />
                  )}

                  {getStatusActionLabel(
                    getCourseStatus(
                      selectedCourseActions,
                    ),
                  )}
                </span>

                <ArrowRight
                  size={18}
                  className="shrink-0"
                />
              </button>

              {/* Editar */}
              <button
                type="button"
                onClick={() => {
                  editCourse(
                    selectedCourseActions,
                  );

                  setSelectedCourseActions(
                    null,
                  );
                }}
                className="
                  w-full

                  inline-flex
                  items-center
                  justify-between

                  gap-3

                  rounded-2xl

                  bg-purple-500/10

                  px-4
                  py-3

                  text-sm
                  font-semibold

                  text-purple-600
                  dark:text-purple-400

                  hover:bg-purple-500/20

                  transition-all
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                  "
                >
                  <FileText size={18} />

                  Editar dados
                </span>

                <ArrowRight
                  size={18}
                  className="shrink-0"
                />
              </button>

              {/* Excluir */}
              <button
                type="button"
                onClick={() => {
                  deleteCourse(
                    selectedCourseActions,
                  );

                  setSelectedCourseActions(
                    null,
                  );
                }}
                className="
                  w-full

                  inline-flex
                  items-center
                  justify-between

                  gap-3

                  rounded-2xl

                  bg-red-500/10

                  px-4
                  py-3

                  text-sm
                  font-semibold
                  text-red-500

                  hover:bg-red-500/20

                  transition-all
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                  "
                >
                  <Trash2 size={18} />

                  Excluir curso
                </span>

                <ArrowRight
                  size={18}
                  className="shrink-0"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VINCULAR DISPOSITIVO */}
      {selectedCourseForDevice && (
        <div
          className="
            fixed
            inset-0
            z-[110]

            flex
            items-center
            justify-center

            bg-black/60
            backdrop-blur-[2px]

            p-3
            sm:p-4
          "
        >
          <div
            role="dialog"
            aria-modal="true"
            className="
              w-full
              max-w-lg

              max-h-[calc(100dvh-24px)]

              overflow-y-auto

              rounded-2xl
              sm:rounded-3xl

              bg-white
              dark:bg-[#091a2c]

              border
              border-gray-200
              dark:border-white/10

              p-5
              sm:p-6

              shadow-2xl
            "
          >
            <div
              className="
                flex
                items-start
                justify-between

                gap-4
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-3

                  min-w-0
                "
              >
                <div
                  className="
                    w-10
                    h-10

                    rounded-2xl

                    bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                    text-[var(--company-primary)]

                    flex
                    items-center
                    justify-center

                    shrink-0
                  "
                >
                  <Cpu size={21} />
                </div>

                <div className="min-w-0">
                  <h2
                    className="
                      text-xl
                      sm:text-2xl

                      font-bold

                      text-[#080E2F]
                      dark:text-white
                    "
                  >
                    Vincular dispositivo
                  </h2>

                  <p
                    className="
                      mt-1

                      text-sm

                      text-gray-500
                      dark:text-gray-400

                      break-words
                    "
                  >
                    Curso:{" "}
                    <strong
                      className="
                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      {
                        selectedCourseForDevice.titulo
                      }
                    </strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCourseForDevice(
                    null,
                  );

                  setSelectedCourseDeviceId(
                    "",
                  );
                }}
                disabled={
                  linkingCourseDevice
                }
                aria-label="Fechar modal"
                className="
                  w-10
                  h-10

                  rounded-xl

                  flex
                  items-center
                  justify-center

                  text-gray-500

                  hover:text-red-500
                  hover:bg-red-500/10

                  transition-all

                  disabled:opacity-60

                  shrink-0
                "
              >
                <X size={23} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="course-device"
                  className="
                    block

                    text-sm
                    font-semibold

                    text-[#080E2F]
                    dark:text-white

                    mb-2
                  "
                >
                  Dispositivo relacionado ao curso
                </label>

                <select
                  id="course-device"
                  value={
                    selectedCourseDeviceId
                  }
                  onChange={(event) =>
                    setSelectedCourseDeviceId(
                      event.target.value,
                    )
                  }
                  disabled={
                    linkingCourseDevice
                  }
                  className="
                    w-full

                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-white
                    dark:bg-[#0d2238]

                    px-4
                    py-3

                    text-[#080E2F]
                    dark:text-white

                    outline-none

                    focus:border-[var(--company-primary)]
                    focus:ring-4
                    focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                    transition-all

                    disabled:opacity-60
                  "
                >
                  <option value="">
                    Selecione um dispositivo
                  </option>

                  {devices.map(
                    (device) => (
                      <option
                        key={device.id}
                        value={device.id}
                      >
                        {device.nome}

                        {device.modelo
                          ? ` - ${device.modelo}`
                          : ""}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {devices.length === 0 && (
                <div
                  className="
                    rounded-2xl

                    border
                    border-orange-500/20

                    bg-orange-500/10

                    p-4

                    text-sm
                    text-orange-700
                    dark:text-orange-300

                    leading-relaxed
                  "
                >
                  Nenhum dispositivo cadastrado.
                  Cadastre um dispositivo antes
                  de vincular ao curso.
                </div>
              )}

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2

                  gap-3

                  pt-2
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourseForDevice(
                      null,
                    );

                    setSelectedCourseDeviceId(
                      "",
                    );
                  }}
                  disabled={
                    linkingCourseDevice
                  }
                  className="
                    w-full

                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    px-5
                    py-3

                    font-semibold

                    text-gray-600
                    dark:text-gray-300

                    hover:bg-gray-50
                    dark:hover:bg-white/5

                    transition-all

                    disabled:opacity-60
                  "
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={
                    handleLinkDeviceToCourse
                  }
                  disabled={
                    linkingCourseDevice ||
                    !selectedCourseDeviceId
                  }
                  className="
                    w-full

                    rounded-2xl

                    bg-gradient-to-r
                    from-[var(--company-primary)]
                    to-[var(--company-secondary)]

                    px-5
                    py-3

                    font-semibold
                    text-white

                    flex
                    items-center
                    justify-center
                    gap-2

                    shadow-lg

                    hover:brightness-105

                    transition-all

                    active:scale-[0.99]

                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    disabled:active:scale-100
                  "
                >
                  {linkingCourseDevice ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Vinculando...
                    </>
                  ) : (
                    <>
                      <Cpu size={18} />

                      Vincular dispositivo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CourseThumbnail({
  course,
}: {
  course: CourseType;
}) {
  return (
    <div
      className="
        w-14
        h-14

        sm:w-16
        sm:h-16

        rounded-xl

        bg-gray-100
        dark:bg-[#0d2238]

        overflow-hidden

        flex
        items-center
        justify-center

        shrink-0
      "
    >
      {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt={course.titulo}
          className="
            w-full
            h-full

            object-cover
          "
        />
      ) : (
        <BookOpen
          size={25}
          className="
            text-[var(--company-primary)]
          "
        />
      )}
    </div>
  );
}

function CourseEmptyState() {
  return (
    <div
      className="
        py-10
        sm:py-12

        text-center
      "
    >
      <div
        className="
          w-14
          h-14

          mx-auto
          mb-4

          rounded-2xl

          bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

          text-[var(--company-primary)]

          flex
          items-center
          justify-center
        "
      >
        <BookOpen size={26} />
      </div>

      <h3
        className="
          font-bold

          text-[#080E2F]
          dark:text-white
        "
      >
        Nenhum curso encontrado
      </h3>

      <p
        className="
          mt-1

          text-sm

          text-gray-500
          dark:text-gray-400
        "
      >
        Nenhum curso corresponde à busca realizada.
      </p>
    </div>
  );
}