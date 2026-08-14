import {
  BookOpen,
  Cpu,
  Grid3X3,
  List,
  Search,
  Send,
  Star,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";

import {
  api,
} from "../../services/api";

import CoursePreviewModal from "../../components/modals/CoursePreviewModal";

interface CourseDevice {
  id: number;
  nome: string;
  modelo?: string | null;
  tipo?: string | null;
  descricao?: string | null;
  imagem_url?: string | null;
  criado_em?: string | null;
}

interface CourseCatalogItem {
  course_id: number;
  course_title: string;
  course_description?: string | null;
  course_thumbnail?: string | null;
  course_status?: string | null;
  course_created_at?: string | null;

  enrollment_request_id?: number | null;

  enrollment_status?:
    | "pendente"
    | "aprovada"
    | "rejeitada"
    | "cancelada"
    | null;

  enrollment_requested_at?: string | null;

  devices: CourseDevice[];
}

interface CourseModule {
  id: number;
  titulo: string;
  ordem: number;
  total_aulas: number;
}

interface CoursePreview {
  id: number;
  titulo: string;
  descricao: string;
  status: string;

  dispositivo_id: number | null;
  dispositivo_nome: string | null;
  dispositivo_modelo?: string | null;
  dispositivo_imagem_url?: string | null;

  total_modulos: number;
  total_aulas: number;
  modulos: CourseModule[];
}

export default function StudentCourseCatalog() {
  const navigate =
    useNavigate();

  const [
    courses,
    setCourses,
  ] = useState<
    CourseCatalogItem[]
  >([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    viewMode,
    setViewMode,
  ] = useState<
    "grid" | "list"
  >("grid");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    previewModalOpen,
    setPreviewModalOpen,
  ] = useState(false);

  const [
    selectedCourse,
    setSelectedCourse,
  ] =
    useState<CoursePreview | null>(
      null,
    );

  const [
    loadingPreview,
    setLoadingPreview,
  ] = useState(false);

  const [
    requestingEnrollment,
    setRequestingEnrollment,
  ] = useState(false);

  const [
    selectedEnrollmentStatus,
    setSelectedEnrollmentStatus,
  ] =
    useState<
      CourseCatalogItem["enrollment_status"]
    >(null);

  async function getCourses() {
    try {
      setLoading(true);

      const response =
        await api.get<
          CourseCatalogItem[]
        >(
          "/student/course-catalog",
        );

      setCourses(
        response.data,
      );
    } catch (error) {
      console.log(error);

      toast.error(
        "Erro ao buscar cursos disponíveis",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenCoursePreview(
    course: CourseCatalogItem,
  ) {
    try {
      setPreviewModalOpen(true);
      setLoadingPreview(true);
      setSelectedCourse(null);

      setSelectedEnrollmentStatus(
        course.enrollment_status ??
          null,
      );

      const response =
        await api.get<CoursePreview>(
          `/student/courses/${course.course_id}/preview`,
        );

      setSelectedCourse(
        response.data,
      );
    } catch (error) {
      if (
        axios.isAxiosError(
          error,
        )
      ) {
        toast.error(
          error.response?.data
            ?.error ||
            "Erro ao carregar prévia do curso.",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao carregar prévia do curso.",
      );
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleRequestEnrollment() {
    if (
      !selectedCourse?.id
    ) {
      toast.error(
        "Curso não selecionado.",
      );

      return;
    }

    try {
      setRequestingEnrollment(
        true,
      );

      const response =
        await api.post(
          `/student/courses/${selectedCourse.id}/enrollment-request`,
          {
            mensagem:
              "Tenho interesse em realizar este treinamento.",
          },
        );

      toast.success(
        response.data?.message ||
          "Solicitação de matrícula enviada com sucesso.",
      );

      setSelectedEnrollmentStatus(
        "pendente",
      );

      setCourses(
        (prevCourses) =>
          prevCourses.map(
            (course) =>
              course.course_id ===
              selectedCourse.id
                ? {
                    ...course,
                    enrollment_status:
                      "pendente",
                  }
                : course,
          ),
      );

      setPreviewModalOpen(
        false,
      );
    } catch (error) {
      if (
        axios.isAxiosError(
          error,
        )
      ) {
        toast.error(
          error.response?.data
            ?.error ||
            "Erro ao solicitar matrícula.",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao solicitar matrícula.",
      );
    } finally {
      setRequestingEnrollment(
        false,
      );
    }
  }

  async function handleRequestEnrollmentByCourseId(
    courseId: number,
  ) {
    try {
      setRequestingEnrollment(
        true,
      );

      const response =
        await api.post(
          `/student/courses/${courseId}/enrollment-request`,
          {
            mensagem:
              "Tenho interesse em realizar este treinamento.",
          },
        );

      toast.success(
        response.data?.message ||
          "Solicitação de matrícula enviada com sucesso.",
      );

      setCourses(
        (prevCourses) =>
          prevCourses.map(
            (course) =>
              course.course_id ===
              courseId
                ? {
                    ...course,
                    enrollment_status:
                      "pendente",
                  }
                : course,
          ),
      );
    } catch (error) {
      if (
        axios.isAxiosError(
          error,
        )
      ) {
        toast.error(
          error.response?.data
            ?.error ||
            "Erro ao solicitar matrícula.",
        );

        return;
      }

      toast.error(
        "Erro inesperado ao solicitar matrícula.",
      );
    } finally {
      setRequestingEnrollment(
        false,
      );
    }
  }

  function getEnrollmentButtonText(
    status?: CourseCatalogItem["enrollment_status"],
  ) {
    if (
      status === "pendente"
    ) {
      return "Solicitação pendente";
    }

    if (
      status === "aprovada"
    ) {
      return "Acessar curso";
    }

    if (
      status === "rejeitada"
    ) {
      return "Solicitação rejeitada";
    }

    return "Matricular-se";
  }

  function getEnrollmentButtonClass(
    status?: CourseCatalogItem["enrollment_status"],
  ) {
    if (
      status === "pendente"
    ) {
      return `
        bg-yellow-500
        hover:bg-yellow-600
        text-white
      `;
    }

    if (
      status === "aprovada"
    ) {
      return `
        bg-green-500
        hover:bg-green-600
        text-white
      `;
    }

    if (
      status === "rejeitada"
    ) {
      return `
        bg-red-500
        hover:bg-red-600
        text-white
      `;
    }

    return `
      bg-gradient-to-r
      from-[var(--company-primary)]
      to-[var(--company-secondary)]

      text-white

      hover:opacity-95
    `;
  }

  function isEnrollmentButtonDisabled(
    status?: CourseCatalogItem["enrollment_status"],
  ) {
    return (
      status === "pendente" ||
      status === "rejeitada"
    );
  }

  function handleEnrollmentButtonClick(
    course: CourseCatalogItem,
  ) {
    if (
      course.enrollment_status ===
      "pendente"
    ) {
      toast(
        "Sua solicitação está aguardando aprovação do administrador.",
      );

      return;
    }

    if (
      course.enrollment_status ===
      "aprovada"
    ) {
      navigate(
        `/courses/${course.course_id}`,
      );

      return;
    }

    if (
      course.enrollment_status ===
      "rejeitada"
    ) {
      toast.error(
        "Sua solicitação para este curso foi rejeitada.",
      );

      return;
    }

    void handleRequestEnrollmentByCourseId(
      course.course_id,
    );
  }

  function getCourseImage(
    course: CourseCatalogItem,
  ) {
    if (
      course.course_thumbnail
    ) {
      return course.course_thumbnail;
    }

    const deviceWithImage =
      course.devices?.find(
        (device) =>
          device.imagem_url,
      );

    return (
      deviceWithImage?.imagem_url ||
      null
    );
  }

  function getCourseDeviceDescription(
    course: CourseCatalogItem,
  ) {
    if (
      !course.devices ||
      course.devices.length === 0
    ) {
      return "Treinamento geral";
    }

    if (
      course.devices.length === 1
    ) {
      return `Dispositivo: ${course.devices[0].nome}`;
    }

    return `Dispositivos: ${course.devices
      .map(
        (device) =>
          device.nome,
      )
      .join(", ")}`;
  }

  useEffect(() => {
    void getCourses();
  }, []);

  const searchLower =
    search
      .trim()
      .toLowerCase();

  const filteredCourses =
    courses.filter((course) => {
      if (!searchLower) {
        return true;
      }

      const deviceText =
        course.devices
          ?.map(
            (device) =>
              `${
                device.nome ||
                ""
              } ${
                device.modelo ||
                ""
              } ${
                device.tipo ||
                ""
              }`,
          )
          .join(" ")
          .toLowerCase();

      return (
        course.course_title
          ?.toLowerCase()
          .includes(
            searchLower,
          ) ||
        course.course_description
          ?.toLowerCase()
          .includes(
            searchLower,
          ) ||
        deviceText?.includes(
          searchLower,
        )
      );
    });

  return (
    <main
      className="
        w-full
        min-w-0

        space-y-6
        sm:space-y-8
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          flex-col

          gap-5
          lg:gap-6

          xl:flex-row
          xl:items-end
          xl:justify-between
        "
      >
        <div className="min-w-0">
          <h1
            className="
              text-2xl
              sm:text-3xl
              lg:text-4xl

              font-bold

              text-[#080E2F]
              dark:text-white

              leading-tight
            "
          >
            Cursos disponíveis
          </h1>

          <p
            className="
              mt-2

              max-w-3xl

              text-sm
              sm:text-base
              lg:text-lg

              text-gray-500
              dark:text-gray-400

              leading-relaxed
            "
          >
            Escolha um curso,
            veja os detalhes e
            solicite sua matrícula.
          </p>

          <div
            className="
              mt-4

              inline-flex
              items-center

              gap-2

              rounded-2xl

              border
              border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

              bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

              px-4
              py-2

              text-sm
              font-semibold

              text-[var(--company-primary)]
            "
          >
            <BookOpen
              size={18}
              className="shrink-0"
            />

            {filteredCourses.length}{" "}
            curso
            {filteredCourses.length !==
            1
              ? "s"
              : ""}{" "}
            disponível
            {filteredCourses.length !==
            1
              ? "is"
              : ""}
          </div>
        </div>

        <div
          className="
            w-full

            flex
            flex-col

            gap-3

            sm:flex-row
            sm:items-center

            xl:w-auto
          "
        >
          {/* BUSCA */}
          <div
            className="
              relative

              w-full

              sm:flex-1
              xl:w-[360px]

              rounded-2xl

              shadow-2xl
              dark:shadow-sm
            "
          >
            <Search
              size={20}
              className="
                absolute

                left-4
                top-1/2

                -translate-y-1/2

                text-gray-400

                pointer-events-none
              "
            />

            <input
              type="search"
              placeholder="Buscar cursos..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              className="
                w-full
                min-w-0

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#091a2c]

                py-3.5
                sm:py-4

                pl-12
                pr-4

                text-sm
                sm:text-base

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400
                dark:placeholder:text-gray-500

                outline-none

                focus:border-[var(--company-primary)]

                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all
              "
            />
          </div>

          {/* VISUALIZAÇÃO */}
          <div
            className="
              hidden

              sm:flex

              shrink-0

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-1

              shadow-2xl
              dark:shadow-sm
            "
          >
            <button
              type="button"
              onClick={() =>
                setViewMode(
                  "grid",
                )
              }
              aria-label="Visualizar cursos em grade"
              className={`
                w-11
                h-11

                lg:w-12
                lg:h-12

                rounded-xl

                flex
                items-center
                justify-center

                transition-all

                ${
                  viewMode ===
                  "grid"
                    ? `
                        bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

                        text-[var(--company-primary)]
                      `
                    : `
                        text-gray-500
                        dark:text-gray-400

                        hover:bg-gray-100
                        dark:hover:bg-white/5
                      `
                }
              `}
            >
              <Grid3X3
                size={21}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setViewMode(
                  "list",
                )
              }
              aria-label="Visualizar cursos em lista"
              className={`
                w-11
                h-11

                lg:w-12
                lg:h-12

                rounded-xl

                flex
                items-center
                justify-center

                transition-all

                ${
                  viewMode ===
                  "list"
                    ? `
                        bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

                        text-[var(--company-primary)]
                      `
                    : `
                        text-gray-500
                        dark:text-gray-400

                        hover:bg-gray-100
                        dark:hover:bg-white/5
                      `
                }
              `}
            >
              <List size={23} />
            </button>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div
          className="
            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            p-10

            text-center

            text-gray-500
            dark:text-gray-400

            shadow-2xl
            dark:shadow-sm

            animate-pulse
          "
        >
          Carregando cursos
          disponíveis...
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        filteredCourses.length ===
          0 && (
          <div
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              px-5
              py-10
              sm:p-12

              text-center

              shadow-2xl
              dark:shadow-sm
            "
          >
            <div
              className="
                w-16
                h-16

                rounded-2xl

                bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

                flex
                items-center
                justify-center

                mx-auto
                mb-4
              "
            >
              <BookOpen
                size={32}
                className="
                  text-[var(--company-primary)]
                "
              />
            </div>

            <h2
              className="
                text-lg
                sm:text-xl

                font-bold

                text-[#080E2F]
                dark:text-white
              "
            >
              Nenhum curso
              disponível
            </h2>

            <p
              className="
                mt-2

                max-w-lg
                mx-auto

                text-sm
                sm:text-base

                text-gray-500
                dark:text-gray-400

                leading-relaxed
              "
            >
              {searchLower
                ? "Nenhum curso corresponde à busca realizada."
                : "Nenhum curso publicado está disponível no momento."}
            </p>
          </div>
        )}

      {/* CURSOS */}
      {!loading &&
        filteredCourses.length >
          0 && (
          <div
            className={
              viewMode === "grid"
                ? `
                    grid
                    grid-cols-1

                    lg:grid-cols-2
                    2xl:grid-cols-3

                    gap-5
                    sm:gap-6
                    2xl:gap-7
                  `
                : `
                    flex
                    flex-col

                    gap-5
                  `
            }
          >
            {filteredCourses.map(
              (course) => {
                const courseImage =
                  getCourseImage(
                    course,
                  );

                const hasDevice =
                  Boolean(
                    course.devices &&
                      course.devices
                        .length > 0,
                  );

                return (
                  <article
                    key={
                      course.course_id
                    }
                    className={`
                      w-full
                      min-w-0

                      overflow-hidden

                      rounded-2xl
                      sm:rounded-3xl

                      border
                      border-gray-200
                      dark:border-white/10

                      bg-white
                      dark:bg-[#091a2c]

                      shadow-2xl
                      dark:shadow-sm

                      transition-all
                      duration-200

                      hover:border-[color-mix(in_srgb,var(--company-primary)_35%,transparent)]

                      ${
                        viewMode ===
                        "list"
                          ? `
                              flex
                              flex-col

                              xl:flex-row
                            `
                          : ""
                      }
                    `}
                  >
                    {/* IMAGEM */}
                    <div
                      className={`
                        relative

                        shrink-0

                        overflow-hidden

                        bg-gray-100
                        dark:bg-[#0d2238]

                        ${
                          viewMode ===
                          "list"
                            ? `
                                h-56
                                sm:h-64

                                xl:h-auto
                                xl:min-h-[280px]
                                xl:w-[320px]

                                2xl:w-[360px]
                              `
                            : `
                                h-52
                                sm:h-60
                                xl:h-64
                              `
                        }
                      `}
                    >
                      <div
                        className="
                          absolute

                          top-3
                          left-3

                          sm:top-5
                          sm:left-5

                          z-10

                          inline-flex
                          items-center

                          gap-2

                          rounded-xl

                          border
                          border-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]

                          bg-[color-mix(in_srgb,var(--company-primary)_12%,white)]

                          dark:bg-[color-mix(in_srgb,var(--company-primary)_15%,#091a2c)]

                          px-3
                          py-2

                          text-xs
                          sm:text-sm

                          font-semibold

                          text-[var(--company-primary)]

                          shadow-lg
                        "
                      >
                        <Star
                          size={15}
                          fill="currentColor"
                        />

                        Curso disponível
                      </div>

                      <div
                        className="
                          absolute
                          inset-0

                          flex
                          items-center
                          justify-center
                        "
                      >
                        <div
                          className="
                            w-40
                            h-40

                            sm:w-44
                            sm:h-44

                            rounded-full

                            bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                            blur-sm
                          "
                        />
                      </div>

                      <div
                        className="
                          relative

                          z-10

                          h-full

                          flex
                          items-center
                          justify-center

                          p-5
                          sm:p-6
                        "
                      >
                        {courseImage ? (
                          <img
                            src={
                              courseImage
                            }
                            alt={
                              course.course_title
                            }
                            className="
                              max-h-44
                              max-w-[90%]

                              object-contain

                              drop-shadow-xl
                            "
                          />
                        ) : (
                          <div
                            className="
                              w-28
                              h-28

                              sm:w-36
                              sm:h-36

                              rounded-3xl

                              bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

                              flex
                              items-center
                              justify-center
                            "
                          >
                            {hasDevice ? (
                              <Cpu
                                size={60}
                                className="
                                  sm:w-[70px]
                                  sm:h-[70px]

                                  text-[var(--company-primary)]
                                "
                              />
                            ) : (
                              <BookOpen
                                size={60}
                                className="
                                  sm:w-[70px]
                                  sm:h-[70px]

                                  text-[var(--company-primary)]
                                "
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CONTEÚDO */}
                    <div
                      className="
                        min-w-0
                        flex-1

                        p-4
                        sm:p-5
                        lg:p-6

                        flex
                        flex-col
                      "
                    >
                      <h2
                        className="
                          text-xl
                          sm:text-2xl

                          font-bold

                          text-[#080E2F]
                          dark:text-white

                          leading-tight
                          break-words
                        "
                      >
                        {
                          course.course_title
                        }
                      </h2>

                      <p
                        className="
                          mt-3

                          text-sm
                          sm:text-base

                          text-gray-500
                          dark:text-gray-400

                          leading-relaxed
                          break-words
                        "
                      >
                        {course.course_description ||
                          "Treinamento disponível para sua empresa. Veja a prévia e solicite matrícula para iniciar seus estudos."}
                      </p>

                      <div
                        className="
                          mt-4

                          inline-flex
                          items-start

                          gap-2

                          w-fit
                          max-w-full

                          rounded-xl

                          bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

                          px-3
                          py-2

                          text-sm
                          font-medium

                          text-[var(--company-primary)]
                        "
                      >
                        <Cpu
                          size={17}
                          className="
                            mt-0.5
                            shrink-0
                          "
                        />

                        <span className="break-words">
                          {getCourseDeviceDescription(
                            course,
                          )}
                        </span>
                      </div>

                      {/* AÇÕES */}
                      <div
                        className="
                          mt-auto
                          pt-5
                        "
                      >
                        <div
                          className="
                            border-t
                            border-gray-200
                            dark:border-white/10

                            pt-4
                          "
                        >
                          <div
                            className="
                              flex
                              flex-col

                              gap-3

                              sm:flex-row
                            "
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleEnrollmentButtonClick(
                                  course,
                                )
                              }
                              disabled={
                                requestingEnrollment ||
                                isEnrollmentButtonDisabled(
                                  course.enrollment_status,
                                )
                              }
                              className={`
                                flex-1

                                min-h-[48px]

                                rounded-xl

                                px-4
                                py-3

                                font-bold

                                flex
                                items-center
                                justify-center

                                gap-2

                                shadow-xl

                                transition-all

                                disabled:opacity-70
                                disabled:cursor-not-allowed

                                ${getEnrollmentButtonClass(
                                  course.enrollment_status,
                                )}
                              `}
                            >
                              <Send
                                size={18}
                                className="shrink-0"
                              />

                              <span>
                                {getEnrollmentButtonText(
                                  course.enrollment_status,
                                )}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleOpenCoursePreview(
                                  course,
                                )
                              }
                              className="
                                flex-1

                                min-h-[48px]

                                rounded-xl

                                border
                                border-[color-mix(in_srgb,var(--company-primary)_25%,transparent)]

                                bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

                                px-4
                                py-3

                                font-bold

                                text-[var(--company-primary)]

                                flex
                                items-center
                                justify-center

                                gap-2

                                transition-all

                                hover:bg-[color-mix(in_srgb,var(--company-primary)_14%,transparent)]
                              "
                            >
                              <BookOpen
                                size={18}
                                className="shrink-0"
                              />

                              Ver prévia
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}

      <CoursePreviewModal
        isOpen={
          previewModalOpen
        }
        course={
          selectedCourse
        }
        loading={
          loadingPreview
        }
        requesting={
          requestingEnrollment
        }
        enrollmentStatus={
          selectedEnrollmentStatus
        }
        onClose={() =>
          setPreviewModalOpen(
            false,
          )
        }
        onRequestEnrollment={
          handleRequestEnrollment
        }
      />
    </main>
  );
}