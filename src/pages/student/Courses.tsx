import {
  ArrowRight,
  Award,
  BookOpen,
  Clock3,
  Grid3X3,
  List,
  MapPin,
  Play,
  Search,
  Users,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  api,
} from "../../services/api";

interface CourseType {
  id: number;
  titulo: string;
  descricao?: string;
  thumbnail?: string;
  criado_por?: number;
  criado_em?: string;
  criador?: string;

  dispositivo_id?: number;
  dispositivo_nome?: string;
  dispositivo_modelo?: string | null;
  dispositivo_imagem_url?: string | null;

  progresso?: number;
  aulas_concluidas?: number;
  total_aulas?: number;
  duracao?: string;
  categoria?: string;

  curso_status?:
    | "sem_tentativa"
    | "em_andamento"
    | "em_revisao"
    | "aprovado"
    | "bloqueado"
    | "reprovado";
}

export default function MyCourses() {
  const [
    courses,
    setCourses,
  ] = useState<CourseType[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    viewMode,
    setViewMode,
  ] = useState<
    "list" | "grid"
  >("list");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const navigate =
    useNavigate();

  const getCourses =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await api.get<
            CourseType[]
          >(
            "/student/my-courses",
          );

        setCourses(
          response.data,
        );
      } catch (error) {
        console.log(error);

        toast.error(
          "Erro ao buscar cursos",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(
        () => {
          void getCourses();
        },
        0,
      );

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [getCourses]);

  const searchLower =
    search
      .trim()
      .toLowerCase();

  const filteredCourses =
    courses.filter((course) => {
      if (!searchLower) {
        return true;
      }

      return (
        course.titulo
          ?.toLowerCase()
          .includes(
            searchLower,
          ) ||
        course.descricao
          ?.toLowerCase()
          .includes(
            searchLower,
          ) ||
        course.categoria
          ?.toLowerCase()
          .includes(
            searchLower,
          )
      );
    });

  function getCourseProgress(
    course: CourseType,
  ) {
    return Math.min(
      Math.max(
        Number(
          course.progresso,
        ) || 0,
        0,
      ),
      100,
    );
  }

  function getCourseTag(
    course: CourseType,
  ) {
    return (
      course.categoria ||
      "Treinamento"
    );
  }

  function getCourseImage(
    course: CourseType,
  ) {
    return (
      course.thumbnail ||
      course.dispositivo_imagem_url ||
      ""
    );
  }

  function getCourseStatusLabel(
    course: CourseType,
  ) {
    const progress =
      getCourseProgress(
        course,
      );

    if (
      course.curso_status ===
      "em_revisao"
    ) {
      return "Em revisão";
    }

    if (
      course.curso_status ===
      "aprovado"
    ) {
      return "Aprovado";
    }

    if (
      course.curso_status ===
      "bloqueado"
    ) {
      return "Bloqueado";
    }

    if (
      course.curso_status ===
      "reprovado"
    ) {
      return "Reprovado";
    }

    return `${progress}% completo`;
  }

  function getCourseStatusClasses(
    course: CourseType,
  ) {
    if (
      course.curso_status ===
      "aprovado"
    ) {
      return `
        bg-green-500/15
        text-green-600
        dark:text-green-400

        border-green-500/20
      `;
    }

    if (
      course.curso_status ===
      "em_revisao"
    ) {
      return `
        bg-orange-500/15
        text-orange-600
        dark:text-orange-400

        border-orange-500/20
      `;
    }

    if (
      course.curso_status ===
        "bloqueado" ||
      course.curso_status ===
        "reprovado"
    ) {
      return `
        bg-red-500/15
        text-red-600
        dark:text-red-400

        border-red-500/20
      `;
    }

    return `
      bg-white/90
      dark:bg-[#091a2c]/90

      text-[#080E2F]
      dark:text-white

      border-gray-200
      dark:border-white/10
    `;
  }

  function getCourseButtonLabel(
    course: CourseType,
  ) {
    const progress =
      getCourseProgress(
        course,
      );

    if (
      course.curso_status ===
      "em_revisao"
    ) {
      return "Continuar revisão";
    }

    if (
      course.curso_status ===
      "aprovado"
    ) {
      return "Rever curso";
    }

    if (
      course.curso_status ===
      "bloqueado"
    ) {
      return "Curso bloqueado";
    }

    if (progress === 0) {
      return "Iniciar curso";
    }

    return "Continuar curso";
  }

  function openCourse(
    course: CourseType,
  ) {
    if (
      course.curso_status ===
      "bloqueado"
    ) {
      return;
    }

    navigate(
      `/courses/${course.id}`,
    );
  }
return (
  <main
    className="
      w-full
      min-w-0
    "
  >
      <div
        className="
          w-full
          min-w-0

          max-w-[1500px]

          mx-auto
        "
      >
        {/* HEADER */}
        <div
          className="
            mb-7
            sm:mb-8

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
              Meus Cursos
            </h1>

            <p
              className="
                mt-2

                text-sm
                sm:text-base
                lg:text-lg

                text-gray-500
                dark:text-gray-400

                leading-relaxed
              "
            >
              Acompanhe seus cursos,
              revisões e certificados.
            </p>

            <div
              className="
                mt-4
                sm:mt-5

                inline-flex
                items-center

                gap-2

                rounded-2xl

                border
                border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

                bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                px-4
                py-2

                text-sm
                font-semibold

                text-[var(--company-primary)]
              "
            >
              <Users size={18} />

              {filteredCourses.length}{" "}
              curso
              {filteredCourses.length !==
              1
                ? "s"
                : ""}{" "}
              matriculado
              {filteredCourses.length !==
              1
                ? "s"
                : ""}
            </div>
          </div>

          <div
            className="
              w-full

              flex
              flex-col

              sm:flex-row
              sm:items-center

              gap-3
              sm:gap-4

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

            {/* MODO DE VISUALIZAÇÃO */}
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
            Carregando cursos...
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
                encontrado
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
                  ? "Nenhum dos seus cursos corresponde à busca realizada."
                  : "Quando sua matrícula for aprovada, seus cursos aparecerão aqui."}
              </p>
            </div>
          )}

        {/* CURSOS */}
        {!loading &&
          filteredCourses.length >
            0 && (
            <div
              className={
                viewMode ===
                "grid"
                  ? `
                      grid
                      grid-cols-1

                      lg:grid-cols-2

                      gap-5
                      sm:gap-6
                      xl:gap-7
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
                  const progress =
                    getCourseProgress(
                      course,
                    );

                  const courseImage =
                    getCourseImage(
                      course,
                    );

                  const isBlocked =
                    course.curso_status ===
                    "bloqueado";

                  return (
                    <article
                      key={course.id}
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
                                  xl:min-h-[360px]
                                  xl:w-[380px]

                                  2xl:w-[420px]
                                `
                              : `
                                  h-52
                                  sm:h-60
                                  xl:h-64
                                `
                          }
                        `}
                      >
                        {courseImage ? (
                          <img
                            src={
                              courseImage
                            }
                            alt={
                              course.titulo
                            }
                            className="
                              w-full
                              h-full

                              object-contain

                              p-4
                              sm:p-6
                            "
                          />
                        ) : (
                          <div
                            className="
                              relative

                              w-full
                              h-full

                              flex
                              items-center
                              justify-center
                            "
                          >
                            <div
                              className="
                                absolute
                                inset-0

                                bg-gradient-to-br

                                from-[color-mix(in_srgb,var(--company-primary)_15%,transparent)]
                                via-[color-mix(in_srgb,var(--company-secondary)_10%,transparent)]
                                to-transparent
                              "
                            />

                            <div
                              className="
                                relative

                                w-28
                                h-28

                                sm:w-36
                                sm:h-36

                                rounded-full

                                bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                                flex
                                items-center
                                justify-center
                              "
                            >
                              <BookOpen
                                size={58}
                                className="
                                  sm:w-[72px]
                                  sm:h-[72px]

                                  text-[var(--company-primary)]
                                "
                              />
                            </div>
                          </div>
                        )}

                        {/* STATUS */}
                        <div
                          className={`
                            absolute

                            top-3
                            right-3

                            sm:top-5
                            sm:right-5

                            max-w-[70%]

                            rounded-xl
                            sm:rounded-2xl

                            border

                            px-3
                            py-2

                            text-xs
                            sm:text-sm

                            font-semibold

                            backdrop-blur-md

                            shadow-lg

                            ${getCourseStatusClasses(
                              course,
                            )}
                          `}
                        >
                          {getCourseStatusLabel(
                            course,
                          )}
                        </div>

                        {/* PLAY */}
                        <button
                          type="button"
                          disabled={
                            isBlocked
                          }
                          onClick={() =>
                            openCourse(
                              course,
                            )
                          }
                          aria-label={`Abrir curso ${course.titulo}`}
                          className="
                            absolute

                            left-1/2
                            top-1/2

                            -translate-x-1/2
                            -translate-y-1/2

                            w-16
                            h-16

                            sm:w-20
                            sm:h-20

                            rounded-full

                            bg-white
                            dark:bg-[#091a2c]

                            text-[var(--company-primary)]

                            flex
                            items-center
                            justify-center

                            shadow-2xl

                            hover:scale-105

                            transition-all

                            disabled:opacity-60
                            disabled:cursor-not-allowed
                          "
                        >
                          <Play
                            size={30}
                            fill="currentColor"
                            className="
                              sm:w-[34px]
                              sm:h-[34px]
                            "
                          />
                        </button>
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
                        <div
                          className="
                            inline-flex
                            items-center

                            gap-2

                            w-fit

                            max-w-full

                            rounded-xl

                            bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                            px-3
                            py-2

                            text-xs
                            sm:text-sm

                            font-semibold

                            text-[var(--company-primary)]

                            mb-4
                          "
                        >
                          {getCourseTag(
                            course,
                          )
                            .toLowerCase()
                            .includes(
                              "geo",
                            ) ? (
                            <MapPin
                              size={17}
                              className="shrink-0"
                            />
                          ) : (
                            <Users
                              size={17}
                              className="shrink-0"
                            />
                          )}

                          <span className="break-words">
                            {getCourseTag(
                              course,
                            )}
                          </span>
                        </div>

                        <h2
                          className="
                            text-xl
                            sm:text-2xl
                            lg:text-3xl

                            font-bold

                            text-[#080E2F]
                            dark:text-white

                            leading-tight
                            break-words
                          "
                        >
                          {course.titulo}
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
                          {course.descricao ||
                            "Treinamento disponível para sua empresa."}
                        </p>

                        {/* INFORMAÇÕES */}
                        <div
                          className="
                            mt-5

                            flex
                            flex-wrap
                            items-center

                            gap-x-5
                            gap-y-3

                            text-sm
                            sm:text-base

                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          <div
                            className="
                              flex
                              items-center

                              gap-2
                            "
                          >
                            <Clock3
                              size={19}
                              className="shrink-0"
                            />

                            <span>
                              {course.duracao ||
                                "Duração não informada"}
                            </span>
                          </div>

                          <div
                            className="
                              flex
                              items-center

                              gap-2
                            "
                          >
                            <BookOpen
                              size={19}
                              className="shrink-0"
                            />

                            <span>
                              {course.aulas_concluidas ||
                                0}
                              /
                              {course.total_aulas ||
                                0}{" "}
                              aulas
                            </span>
                          </div>
                        </div>

                        {/* PROGRESSO */}
                        <div
                          className="
                            mt-5
                            sm:mt-6
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              justify-between

                              gap-3

                              mb-2
                            "
                          >
                            <span
                              className="
                                text-sm

                                font-medium

                                text-gray-500
                                dark:text-gray-400
                              "
                            >
                              Progresso
                            </span>

                            <span
                              className="
                                text-sm

                                font-bold

                                text-[var(--company-primary)]
                              "
                            >
                              {progress}%
                            </span>
                          </div>

                          <div
                            className="
                              w-full
                              h-2.5

                              overflow-hidden

                              rounded-full

                              bg-gray-200
                              dark:bg-[#132d46]
                            "
                          >
                            <div
                              style={{
                                width: `${progress}%`,
                              }}
                              className="
                                h-full

                                rounded-full

                                bg-gradient-to-r
                                from-[var(--company-primary)]
                                to-[var(--company-secondary)]

                                transition-all
                                duration-500
                              "
                            />
                          </div>
                        </div>

                        {/* AÇÃO */}
                        <button
                          type="button"
                          disabled={
                            isBlocked
                          }
                          onClick={() =>
                            openCourse(
                              course,
                            )
                          }
                          className="
                            mt-6

                            w-full

                            rounded-2xl

                            bg-gradient-to-r
                            from-[var(--company-primary)]
                            to-[var(--company-secondary)]

                            px-4
                            py-3.5
                            sm:py-4

                            text-sm
                            sm:text-base

                            font-semibold

                            text-white

                            flex
                            items-center
                            justify-center

                            gap-3

                            shadow-2xl
                            dark:shadow-sm

                            transition-all

                            hover:opacity-95

                            active:scale-[0.99]

                            disabled:opacity-50
                            disabled:cursor-not-allowed
                          "
                        >
                          {getCourseButtonLabel(
                            course,
                          )}

                          {!isBlocked && (
                            <ArrowRight
                              size={20}
                              className="shrink-0"
                            />
                          )}
                        </button>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          )}

        {/* CERTIFICADOS */}
        <div
          className="
            mt-6
            sm:mt-7

            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            p-4
            sm:p-6

            flex
            flex-col

            gap-5

            md:flex-row
            md:items-center
            md:justify-between

            shadow-2xl
            dark:shadow-sm

            transition-colors
          "
        >
          <div
            className="
              min-w-0

              flex
              items-start
              sm:items-center

              gap-3
              sm:gap-4
            "
          >
            <div
              className="
                w-12
                h-12

                sm:w-14
                sm:h-14

                rounded-2xl

                bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

                text-[var(--company-primary)]

                flex
                items-center
                justify-center

                shrink-0
              "
            >
              <Award size={24} />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-lg
                  sm:text-xl

                  font-bold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Continue aprendendo
              </h2>

              <p
                className="
                  mt-1

                  text-sm
                  sm:text-base

                  text-gray-500
                  dark:text-gray-400

                  leading-relaxed
                "
              >
                Mantenha sua jornada
                de aprendizado e
                conquiste novos
                certificados.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/certificate",
              )
            }
            className="
              w-full
              md:w-auto

              shrink-0

              rounded-2xl

              border
              border-[color-mix(in_srgb,var(--company-primary)_35%,transparent)]

              bg-[color-mix(in_srgb,var(--company-primary)_5%,transparent)]

              px-5
              py-3

              font-semibold

              text-[var(--company-primary)]

              shadow-xl

              hover:bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

              transition-all
            "
          >
            Ver certificados
          </button>
        </div>
      </div>
    </main>
  );
}