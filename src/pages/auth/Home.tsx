import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AlertTriangle,
  BookOpen,
  Clock3,
  GraduationCap,
  Loader2,
  TrendingUp,
  LibraryBig,
} from "lucide-react";

import StatsCard from "../../components/StatsCard";
import CourseCard from "../../components/CourseCard";

import {
  api,
} from "../../services/api";

import {
  useCompany,
} from "../../contexts/CompanyContext";

interface UserData {
  id?: string | number;
  name?: string;
  email?: string;

  role?:
    | "student"
    | "admin"
    | "client"
    | "aluno"
    | "adm"
    | "cliente";

  conta_verificada?: boolean | number;
  foto_url?: string | null;
  idioma_preferido?: string | null;
}

interface StudentHomeResumo {
  totalCursosDisponiveis: number;
  totalCursosMatriculados: number;
  totalCursosConcluidos: number;
  horasEstudoMes: number;
  progressoGeral: number;
}

interface CursoEmAndamento {
  id: number;
  titulo: string;
  descricao?: string;
  thumbnail?: string | null;

  dispositivo_nome?: string | null;
  dispositivo_imagem_url?: string | null;

  total_aulas: number;
  aulas_concluidas: number;
  progresso: number;

  curso_status?: string;
}

interface ProximaAula {
  curso_id: number;
  curso_titulo: string;

  modulo_id: number;
  modulo_titulo: string;

  aula_id: number;
  aula_titulo: string;

  duracao: number;

  dispositivo_nome?: string;
}

interface RevisaoPendente {
  curso_id: number;
  curso_titulo: string;

  curso_tentativa_id: number;
  numero_tentativa: number;

  nota_final:
    | string
    | number
    | null;

  status: string;
}

interface StudentHomeData {
  resumo: StudentHomeResumo;

  cursosEmAndamento:
    CursoEmAndamento[];

  proximasAulas:
    ProximaAula[];

  revisoesPendentes:
    RevisaoPendente[];
}

function getUserFromStorage(): UserData {
  return JSON.parse(
    localStorage.getItem("user") ||
      "{}",
  );
}

export default function Home() {
  const navigate =
    useNavigate();

  const {
    company,
  } = useCompany();

  const [
    user,
    setUser,
  ] = useState<UserData>(
    getUserFromStorage(),
  );

  const [
    homeData,
    setHomeData,
  ] =
    useState<StudentHomeData | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    myCourses,
    setMyCourses,
  ] = useState<
    CursoEmAndamento[]
  >([]);

  const environmentName =
    company?.configuracao
      ?.nomeAmbiente ||
    "Plataforma de Treinamento";

  async function loadStudentHome() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get<StudentHomeData>(
          "/student/home",
        );

      setHomeData(
        response.data,
      );
    } catch (err) {
      console.error(err);

      setError(
        "Não foi possível carregar os dados da Home.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadMyCourses() {
    try {
      const response =
        await api.get<
          CursoEmAndamento[]
        >(
          "/student/my-courses",
        );

      setMyCourses(
        response.data,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function loadUserProfile() {
    try {
      const token =
        localStorage.getItem(
          "token",
        );

      if (!token) {
        return;
      }

      const response =
        await api.get(
          "/users/me/profile",
        );

      const profile =
        response.data;

      const updatedUser = {
        ...getUserFromStorage(),

        name: profile.name,
        email: profile.email,
        role: profile.role,

        foto_url:
          profile.foto_url,

        conta_verificada:
          Boolean(
            profile.conta_verificada,
          ),

        idioma_preferido:
          profile.idioma_preferido,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(
          updatedUser,
        ),
      );

      setUser(updatedUser);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    function syncUser() {
      setUser(
        getUserFromStorage(),
      );
    }

    void loadUserProfile();
    void loadStudentHome();
    void loadMyCourses();

    window.addEventListener(
      "user-profile-updated",
      syncUser,
    );

    window.addEventListener(
      "storage",
      syncUser,
    );

    return () => {
      window.removeEventListener(
        "user-profile-updated",
        syncUser,
      );

      window.removeEventListener(
        "storage",
        syncUser,
      );
    };
  }, []);

  if (loading) {
    return (
      <div
        className="
          min-h-[60vh]

          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            flex-col
            items-center

            gap-3

            text-gray-500
            dark:text-gray-300
          "
        >
          <Loader2
            className="
              w-8
              h-8

              animate-spin

              text-[var(--company-primary)]
            "
          />

          <span>
            Carregando sua Home...
          </span>
        </div>
      </div>
    );
  }

  if (error || !homeData) {
    return (
      <div
        className="
          min-h-[60vh]

          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            w-full
            max-w-md

            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            p-6

            text-center

            shadow-2xl
            dark:shadow-sm
          "
        >
          <h2
            className="
              text-xl
              font-bold

              text-[#080E2F]
              dark:text-white
            "
          >
            Erro ao carregar
          </h2>

          <p
            className="
              mt-2

              text-sm
              sm:text-base

              text-gray-500
              dark:text-gray-300
            "
          >
            {error ||
              "Não foi possível carregar os dados da Home."}
          </p>

          <button
            type="button"
            onClick={() =>
              void loadStudentHome()
            }
            className="
              mt-5

              rounded-xl

              bg-gradient-to-r
              from-[var(--company-primary)]
              to-[var(--company-secondary)]

              px-5
              py-3

              font-bold

              text-white

              shadow-xl

              transition-all

              hover:opacity-95
            "
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const {
    resumo,
    proximasAulas,
    revisoesPendentes,
  } = homeData;

  const isVerified =
    Boolean(
      user?.conta_verificada,
    );

  const cursosMatriculados =
    myCourses;

  const hasCoursesInProgress =
    cursosMatriculados.length >
    0;

  const visibleProximasAulas =
    isVerified &&
    hasCoursesInProgress
      ? proximasAulas
      : [];

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
      <section
        className="
          min-w-0
        "
      >
        <h1
          className="
            text-2xl
            sm:text-3xl
            lg:text-4xl

            font-bold

            text-[#080E2F]
            dark:text-white

            leading-tight
            break-words
          "
        >
          Bem-vindo,{" "}
          <span
            className="
              text-[var(--company-primary)]
            "
          >
            {user?.name ||
              "usuário"}
          </span>
        </h1>

        <p
          className="
            mt-2

            text-sm
            sm:text-base

            text-gray-500
            dark:text-gray-400

            leading-relaxed
          "
        >
          Continue aprendendo e
          acompanhe sua evolução
          no{" "}
          <span className="font-medium">
            {environmentName}
          </span>
          .
        </p>
      </section>

      {/* CONTA NÃO VERIFICADA */}
      {!isVerified && (
        <section
          className="
            rounded-2xl
            sm:rounded-3xl

            border
            border-yellow-200
            dark:border-yellow-500/20

            bg-yellow-50
            dark:bg-yellow-500/10

            p-4
            sm:p-5
            md:p-6

            shadow-2xl
            dark:shadow-sm
          "
        >
          <div
            className="
              flex
              flex-col

              gap-4

              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div
              className="
                min-w-0

                flex
                items-start

                gap-3
                sm:gap-4
              "
            >
              <div
                className="
                  w-11
                  h-11

                  sm:w-12
                  sm:h-12

                  rounded-2xl

                  bg-yellow-500

                  flex
                  items-center
                  justify-center

                  shrink-0
                "
              >
                <AlertTriangle
                  className="
                    w-5
                    h-5

                    sm:w-6
                    sm:h-6

                    text-white
                  "
                />
              </div>

              <div className="min-w-0">
                <h2
                  className="
                    text-lg
                    md:text-xl

                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Verifique sua conta
                  para continuar
                </h2>

                <p
                  className="
                    mt-1

                    max-w-3xl

                    text-sm

                    text-gray-600
                    dark:text-gray-300

                    leading-relaxed
                  "
                >
                  Complete seus dados de
                  perfil em Configurações
                  para liberar o acesso
                  aos cursos, matrículas e
                  certificados.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/settings",
                )
              }
              className="
                w-full
                md:w-auto

                shrink-0

                rounded-xl

                bg-yellow-500

                px-5
                py-3

                font-bold

                text-white

                shadow-xl

                transition-all

                hover:bg-yellow-600
              "
            >
              Verificar conta
            </button>
          </div>
        </section>
      )}

      {/* MÉTRICAS */}
      {isVerified && (
        <div
          className="
            grid
            grid-cols-1

            sm:grid-cols-2

            xl:grid-cols-4

            gap-4
            xl:gap-5
          "
        >
          <StatsCard
            title="Cursos Disponíveis"
            value={String(
              resumo.totalCursosDisponiveis,
            )}
            subtitle="Disponíveis"
            icon={BookOpen}
            iconColor="text-white"
            iconBg="bg-[var(--company-primary)]"
          />

          <StatsCard
            title="Cursos Concluídos"
            value={String(
              resumo.totalCursosConcluidos,
            )}
            subtitle="Certificados"
            icon={GraduationCap}
            iconColor="text-white"
            iconBg="bg-green-500"
          />

          <StatsCard
            title="Horas de Estudo"
            value={`${resumo.horasEstudoMes}h`}
            subtitle="Este mês"
            icon={Clock3}
            iconColor="text-white"
            iconBg="bg-purple-500"
          />

          <StatsCard
            title="Progresso Geral"
            value={`${resumo.progressoGeral}%`}
            subtitle="Aulas concluídas"
            icon={TrendingUp}
            iconColor="text-white"
            iconBg="bg-orange-500"
          />
        </div>
      )}

      {/* SEM CURSOS */}
      {isVerified &&
        !hasCoursesInProgress && (
          <section
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

              bg-[color-mix(in_srgb,var(--company-primary)_6%,transparent)]

              p-4
              sm:p-5
              md:p-6

              shadow-2xl
              dark:shadow-sm
            "
          >
            <div
              className="
                flex
                flex-col

                gap-4

                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              <div
                className="
                  min-w-0

                  flex
                  items-start

                  gap-3
                  sm:gap-4
                "
              >
                <div
                  className="
                    w-11
                    h-11

                    sm:w-12
                    sm:h-12

                    rounded-2xl

                    bg-[var(--company-primary)]

                    flex
                    items-center
                    justify-center

                    shrink-0
                  "
                >
                  <BookOpen
                    className="
                      w-5
                      h-5

                      sm:w-6
                      sm:h-6

                      text-white
                    "
                  />
                </div>

                <div className="min-w-0">
                  <h2
                    className="
                      text-lg
                      md:text-xl

                      font-bold

                      text-[#080E2F]
                      dark:text-white
                    "
                  >
                    Sua conta está
                    verificada
                  </h2>

                  <p
                    className="
                      mt-1

                      max-w-3xl

                      text-sm

                      text-gray-600
                      dark:text-gray-300

                      leading-relaxed
                    "
                  >
                    Agora você já pode
                    visualizar os cursos
                    disponíveis e solicitar
                    matrícula. Suas aulas
                    aparecerão aqui quando
                    uma matrícula for
                    aprovada.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/catalog",
                  )
                }
                className="
                  w-full
                  md:w-auto

                  shrink-0

                  rounded-xl

                  bg-gradient-to-r
                  from-[var(--company-primary)]
                  to-[var(--company-secondary)]

                  px-5
                  py-3

                  font-bold

                  text-white

                  shadow-xl

                  transition-all

                  hover:opacity-95
                "
              >
                Ver cursos disponíveis
              </button>
            </div>
          </section>
        )}

      {/* REVISÕES PENDENTES */}
      {isVerified &&
        revisoesPendentes.length >
          0 && (
          <section
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-yellow-200
              dark:border-yellow-500/20

              bg-yellow-50
              dark:bg-yellow-500/10

              p-4
              sm:p-5

              shadow-2xl
              dark:shadow-sm
            "
          >
            <div
              className="
                flex
                items-start

                gap-3
              "
            >
              <div
                className="
                  w-11
                  h-11

                  rounded-2xl

                  bg-yellow-500

                  flex
                  items-center
                  justify-center

                  shrink-0
                "
              >
                <AlertTriangle
                  className="
                    w-6
                    h-6

                    text-white
                  "
                />
              </div>

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <h2
                  className="
                    text-lg
                    md:text-xl

                    font-semibold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Revisões pendentes
                </h2>

                <p
                  className="
                    mt-1

                    text-sm

                    text-gray-600
                    dark:text-gray-300

                    leading-relaxed
                  "
                >
                  Você possui curso em
                  revisão. Revise o
                  conteúdo para liberar
                  uma nova tentativa da
                  prova final.
                </p>

                <div
                  className="
                    mt-4

                    space-y-3
                  "
                >
                  {revisoesPendentes.map(
                    (review) => (
                      <div
                        key={
                          review.curso_tentativa_id
                        }
                        className="
                          rounded-2xl

                          border
                          border-yellow-200
                          dark:border-yellow-500/20

                          bg-white
                          dark:bg-[#0d2238]

                          p-4

                          flex
                          flex-col

                          gap-3

                          md:flex-row
                          md:items-center
                          md:justify-between

                          shadow-xl
                          dark:shadow-sm
                        "
                      >
                        <div className="min-w-0">
                          <h3
                            className="
                              font-semibold

                              text-[#080E2F]
                              dark:text-white

                              break-words
                            "
                          >
                            {
                              review.curso_titulo
                            }
                          </h3>

                          <p
                            className="
                              mt-1

                              text-sm

                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Tentativa{" "}
                            {
                              review.numero_tentativa
                            }{" "}
                            • Nota final:{" "}
                            {review.nota_final ??
                              "Não informada"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/courses/${review.curso_id}`,
                            )
                          }
                          className="
                            w-full
                            md:w-auto

                            shrink-0

                            rounded-xl

                            bg-yellow-500

                            px-4
                            py-2.5

                            font-bold

                            text-white

                            transition-all

                            hover:bg-yellow-600
                          "
                        >
                          Continuar revisão
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

      {/* CONTEÚDO PRINCIPAL */}
      {isVerified && (
        <div
          className="
            grid
            grid-cols-1

            xl:grid-cols-3

            gap-5
            xl:gap-6
          "
        >
          {/* CURSOS */}
          <section
            className="
              min-w-0

              xl:col-span-2

              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-4
              sm:p-5
              lg:p-6

              shadow-2xl
              dark:shadow-sm
            "
          >
            <div
              className="
                mb-5

                flex
                items-center
                justify-between

                gap-4
              "
            >
              <h2
                className="
                  text-lg
                  md:text-xl

                  font-semibold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Cursos em Andamento
              </h2>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/courses",
                  )
                }
                className="
                  shrink-0

                  text-sm
                  font-bold

                  text-[var(--company-primary)]

                  transition-opacity

                  hover:opacity-75
                "
              >
                Ver todos
              </button>
            </div>

            <div className="space-y-4">
              {cursosMatriculados.length >
              0 ? (
                cursosMatriculados.map(
                  (course) => (
                    <div
                      key={
                        course.id
                      }
                      onClick={() =>
                        navigate(
                          `/courses/${course.id}`,
                        )
                      }
                      className="
                        cursor-pointer
                      "
                    >
                      <CourseCard
                        title={
                          course.titulo
                        }
                        progress={
                          course.progresso
                        }
                        subtitle={`${
                          course.dispositivo_nome ||
                          "Treinamento"
                        } • ${
                          course.aulas_concluidas
                        }/${
                          course.total_aulas
                        } aulas`}
                        progressColor="bg-[var(--company-primary)]"
                      />
                    </div>
                  ),
                )
              ) : (
                <div
                  className="
                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/5

                    bg-gray-50
                    dark:bg-[#0d2238]

                    p-6

                    text-center
                  "
                >
                  <h3
                    className="
                      font-semibold

                      text-[#080E2F]
                      dark:text-white
                    "
                  >
                    Nenhum curso em
                    andamento
                  </h3>

                  <p
                    className="
                      mt-2

                      text-sm

                      text-gray-500
                      dark:text-gray-400

                      leading-relaxed
                    "
                  >
                    Quando sua matrícula
                    for aprovada, você
                    poderá acompanhar o
                    progresso do curso
                    aqui.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/catalog",
                      )
                    }
                    className="
                      mt-4

                      rounded-xl

                      bg-gradient-to-r
                      from-[var(--company-primary)]
                      to-[var(--company-secondary)]

                      px-5
                      py-2.5

                      font-bold

                      text-white

                      shadow-xl

                      transition-all

                      hover:opacity-95
                    "
                  >
                    Ver cursos disponíveis
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* PRÓXIMAS AULAS */}
          <section
            className="
              min-w-0

              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-4
              sm:p-5
              lg:p-6

              shadow-2xl
              dark:shadow-sm
            "
          >
            <h2
              className="
                mb-5

                text-lg
                md:text-xl

                font-semibold

                text-[#080E2F]
                dark:text-white
              "
            >
              Próximas Aulas
            </h2>

            <div className="space-y-4">
              {visibleProximasAulas.length >
              0 ? (
                visibleProximasAulas.map(
                  (lesson) => (
                    <button
                      key={
                        lesson.aula_id
                      }
                      type="button"
                      onClick={() =>
                        navigate(
                          `/courses/${lesson.curso_id}`,
                        )
                      }
                      className="
                        w-full
                        min-w-0

                        rounded-2xl

                        border
                        border-gray-200
                        dark:border-white/5

                        bg-white
                        dark:bg-[#0d2238]

                        p-4

                        text-left

                        shadow-xl
                        dark:shadow-sm

                        transition-all
                        duration-200

                        hover:-translate-y-0.5

                        hover:border-[color-mix(in_srgb,var(--company-primary)_35%,transparent)]
                      "
                    >
                      <h3
                        className="
                          font-medium

                          text-[#080E2F]
                          dark:text-white

                          break-words
                        "
                      >
                        {
                          lesson.aula_titulo
                        }
                      </h3>

                      <p
                        className="
                          mt-1

                          text-sm

                          text-gray-500
                          dark:text-gray-400

                          break-words
                        "
                      >
                        {
                          lesson.modulo_titulo
                        }
                      </p>

                      <p
                        className="
                          mt-1

                          text-xs

                          text-gray-500
                          dark:text-gray-400

                          break-words
                        "
                      >
                        {
                          lesson.curso_titulo
                        }
                      </p>

                      <span
                        className="
                          mt-3

                          block

                          text-sm
                          font-semibold

                          text-[var(--company-primary)]
                        "
                      >
                        {lesson.duracao ||
                          0}
                        min
                      </span>
                    </button>
                  ),
                )
              ) : (
                <div
                  className="
                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/5

                    bg-gray-50
                    dark:bg-[#0d2238]

                    p-6

                    text-center
                  "
                >
                  <h3
                    className="
                      font-semibold

                      text-[#080E2F]
                      dark:text-white
                    "
                  >
                    {hasCoursesInProgress
                      ? "Nenhuma aula pendente"
                      : "Nenhuma aula disponível"}
                  </h3>

                  <p
                    className="
                      mt-2

                      text-sm

                      text-gray-500
                      dark:text-gray-400

                      leading-relaxed
                    "
                  >
                    {hasCoursesInProgress
                      ? "Você não possui próximas aulas pendentes no momento."
                      : "As próximas aulas aparecerão aqui quando sua matrícula for aprovada e você iniciar um curso."}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}