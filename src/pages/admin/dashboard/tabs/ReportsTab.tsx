import {
  Award,
  BarChart3,
  BookOpen,
  FileText,
  Star,
  UserPlus,
  Users,
} from "lucide-react";

import {
  useState,
} from "react";

import ActivityItem from "../components/ActivityItem";
import MetricChart from "../components/MetricChart";
import ReportLine from "../components/ReportLine";
import StatCard from "../components/StatCard";
import StatsGrid from "../components/StatsGrid";
import TableCard from "../components/TableCard";

import type {
  AdminReportsData,
  DeviceType,
  MetricKey,
} from "../types/adminDashboard.types";

interface ReportsTabProps {
  reports: AdminReportsData | null;
  devices: DeviceType[];
}

export default function ReportsTab({
  reports,
  devices,
}: ReportsTabProps) {
  const [
    selectedMetric,
    setSelectedMetric,
  ] = useState<MetricKey>(
    "certificates",
  );

  function formatMonth(
    month: string,
  ) {
    if (!month) {
      return "Sem mês";
    }

    const [
      year,
      monthNumber,
    ] = month.split("-");

    if (
      !year ||
      !monthNumber
    ) {
      return month;
    }

    return `${monthNumber}/${year}`;
  }

  function toNumber(
    value:
      | number
      | string
      | null
      | undefined,
  ) {
    return Number(value || 0);
  }

  if (!reports) {
    return (
      <div
        className="
          w-full

          rounded-2xl
          sm:rounded-3xl

          border
          border-gray-200
          dark:border-white/10

          bg-white
          dark:bg-[#091a2c]

          p-8

          text-center

          text-gray-500
          dark:text-gray-400

          shadow-2xl
          dark:shadow-sm
        "
      >
        Carregando relatórios...
      </div>
    );
  }

  const summary =
    reports.summary;

  const averageCompletion =
    reports.courses.length > 0
      ? Math.round(
          reports.courses.reduce(
            (
              total,
              course,
            ) =>
              total +
              toNumber(
                course.progresso_medio,
              ),
            0,
          ) /
            reports.courses.length,
        )
      : 0;

  const averageQuizScore =
    reports.quizzes.length > 0
      ? reports.quizzes
          .reduce(
            (
              total,
              quiz,
            ) =>
              total +
              toNumber(
                quiz.media_nota,
              ),
            0,
          )
          .toFixed(1)
      : "0";

  const bestCourse = [
    ...reports.courses,
  ].sort(
    (a, b) =>
      toNumber(
        b.total_matriculas,
      ) -
      toNumber(
        a.total_matriculas,
      ),
  )[0];

  const bestQuiz = [
    ...reports.quizzes,
  ].sort(
    (a, b) =>
      toNumber(
        b.total_tentativas,
      ) -
      toNumber(
        a.total_tentativas,
      ),
  )[0];

  const chartData = {
    users: {
      title: "Alunos e Clientes",
      subtitle:
        "Distribuição atual de usuários principais da plataforma.",
      suffix: "",
      data: [
        {
          label: "Alunos",
          value:
            summary.total_alunos,
        },
        {
          label: "Clientes",
          value:
            summary.total_clientes,
        },
      ],
    },

    courses: {
      title:
        "Cursos da Plataforma",
      subtitle:
        "Total de cursos e cursos publicados.",
      suffix: "",
      data: [
        {
          label: "Total",
          value:
            summary.total_cursos,
        },
        {
          label: "Publicados",
          value:
            summary.cursos_publicados,
        },
      ],
    },

    enrollments: {
      title:
        "Matrículas por Curso",
      subtitle:
        "Cursos com maior número de matrículas.",
      suffix: "",
      data:
        reports.courses.length >
        0
          ? reports.courses
              .slice(0, 8)
              .map(
                (course) => ({
                  label:
                    course.titulo,
                  value:
                    toNumber(
                      course.total_matriculas,
                    ),
                }),
              )
          : [
              {
                label:
                  "Sem dados",
                value: 0,
              },
            ],
    },

    devices: {
      title:
        "Dispositivos Cadastrados",
      subtitle:
        "Quantidade total de dispositivos registrados.",
      suffix: "",
      data: [
        {
          label:
            "Dispositivos",
          value:
            devices.length,
        },
      ],
    },

    certificates: {
      title:
        "Certificados Emitidos",
      subtitle:
        "Certificados gerados por mês.",
      suffix: "",
      data:
        reports
          .monthlyCertificates
          .length > 0
          ? reports.monthlyCertificates.map(
              (item) => ({
                label:
                  formatMonth(
                    item.mes,
                  ),
                value:
                  toNumber(
                    item.total,
                  ),
              }),
            )
          : [
              {
                label:
                  "Sem certificados",
                value: 0,
              },
            ],
    },

    completion: {
      title:
        "Conclusão Média por Curso",
      subtitle:
        "Percentual médio de progresso dos alunos por curso.",
      suffix: "%",
      data:
        reports.courses.length >
        0
          ? reports.courses
              .slice(0, 8)
              .map(
                (course) => ({
                  label:
                    course.titulo,
                  value:
                    toNumber(
                      course.progresso_medio,
                    ),
                }),
              )
          : [
              {
                label:
                  "Sem dados",
                value: 0,
              },
            ],
    },

    satisfaction: {
      title:
        "Nota Média dos Quizzes",
      subtitle:
        "Média de desempenho nas avaliações.",
      suffix: "",
      data:
        reports.quizzes.length >
        0
          ? reports.quizzes
              .slice(0, 8)
              .map(
                (quiz) => ({
                  label:
                    quiz.titulo,
                  value:
                    toNumber(
                      quiz.media_nota,
                    ),
                }),
              )
          : [
              {
                label:
                  "Sem tentativas",
                value: 0,
              },
            ],
    },
  };

  const selectedChart =
    chartData[selectedMetric];

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
          title="Alunos"
          value={
            summary.total_alunos
          }
          subtitle="Cadastrados"
          icon={Users}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
          active={
            selectedMetric ===
            "users"
          }
          onClick={() =>
            setSelectedMetric(
              "users",
            )
          }
        />

        <StatCard
          title="Cursos"
          value={
            summary.total_cursos
          }
          subtitle={`${summary.cursos_publicados} publicados`}
          icon={BookOpen}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
          active={
            selectedMetric ===
            "courses"
          }
          onClick={() =>
            setSelectedMetric(
              "courses",
            )
          }
        />

        <StatCard
          title="Matrículas"
          value={
            summary.total_matriculas
          }
          subtitle="Total registradas"
          icon={UserPlus}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
          active={
            selectedMetric ===
            "enrollments"
          }
          onClick={() =>
            setSelectedMetric(
              "enrollments",
            )
          }
        />

        <StatCard
          title="Certificados"
          value={
            summary.certificados_emitidos
          }
          subtitle="Emitidos"
          icon={Award}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
          active={
            selectedMetric ===
            "certificates"
          }
          onClick={() =>
            setSelectedMetric(
              "certificates",
            )
          }
        />

        <StatCard
          title="Conclusão"
          value={`${averageCompletion}%`}
          subtitle="Média dos cursos"
          icon={BarChart3}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
          active={
            selectedMetric ===
            "completion"
          }
          onClick={() =>
            setSelectedMetric(
              "completion",
            )
          }
        />

        <StatCard
          title="Média quizzes"
          value={
            averageQuizScore
          }
          subtitle="Nota média"
          icon={Star}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
          active={
            selectedMetric ===
            "satisfaction"
          }
          onClick={() =>
            setSelectedMetric(
              "satisfaction",
            )
          }
        />
      </StatsGrid>

      {/* GRÁFICO */}
      <div className="min-w-0">
        <MetricChart
          title={
            selectedChart.title
          }
          subtitle={
            selectedChart.subtitle
          }
          data={
            selectedChart.data
          }
          suffix={
            selectedChart.suffix
          }
        />
      </div>

      {/* INDICADORES E INSIGHTS */}
      <div
        className="
          grid
          grid-cols-1

          2xl:grid-cols-2

          gap-5
          sm:gap-6
        "
      >
        <TableCard title="Indicadores Gerais">
          <ReportLine
            label="Alunos cadastrados"
            value={`${summary.total_alunos}`}
          />

          <ReportLine
            label="Clientes cadastrados"
            value={`${summary.total_clientes}`}
          />

          <ReportLine
            label="Cursos totais"
            value={`${summary.total_cursos}`}
          />

          <ReportLine
            label="Cursos publicados"
            value={`${summary.cursos_publicados}`}
          />

          <ReportLine
            label="Matrículas"
            value={`${summary.total_matriculas}`}
          />

          <ReportLine
            label="Certificados emitidos"
            value={`${summary.certificados_emitidos}`}
          />
        </TableCard>

        <TableCard title="Insights Rápidos">
          <div
            className="
              space-y-4
              sm:space-y-5
            "
          >
            <ActivityItem
              icon={BookOpen}
              title="Curso com mais matrículas"
              subtitle={
                bestCourse
                  ? `${bestCourse.titulo} — ${bestCourse.total_matriculas} matrícula(s)`
                  : "Ainda não há matrículas registradas."
              }
              time="Destaque"
              color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
            />

            <ActivityItem
              icon={BarChart3}
              title="Média geral de conclusão"
              subtitle={`${averageCompletion}% de progresso médio entre os cursos.`}
              time="Cursos"
              color="bg-green-500/15 text-green-600 dark:text-green-400"
            />

            <ActivityItem
              icon={FileText}
              title="Quiz mais acessado"
              subtitle={
                bestQuiz
                  ? `${bestQuiz.titulo} — ${bestQuiz.total_tentativas} tentativa(s)`
                  : "Ainda não há tentativas registradas."
              }
              time="Avaliações"
              color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
            />
          </div>
        </TableCard>
      </div>

      {/* DESEMPENHO */}
      <div
        className="
          grid
          grid-cols-1

          2xl:grid-cols-2

          gap-5
          sm:gap-6
        "
      >
        {/* CURSOS */}
        <TableCard title="Desempenho por Curso">
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
                grid-cols-[2fr_110px_110px_110px_120px]

                gap-3

                px-3
                py-2

                text-xs
                font-bold
                uppercase

                text-gray-400
              "
            >
              <span>
                Curso
              </span>

              <span>
                Status
              </span>

              <span>
                Matrículas
              </span>

              <span>
                Certificados
              </span>

              <span>
                Progresso
              </span>
            </div>

            {reports.courses.length ===
            0 ? (
              <ReportsEmptyState
                message="Nenhum curso encontrado nos relatórios."
              />
            ) : (
              reports.courses.map(
                (course) => (
                  <div
                    key={
                      course.curso_id
                    }
                    className="
                      grid
                      grid-cols-[2fr_110px_110px_110px_120px]

                      gap-3

                      items-center

                      px-3
                      py-4

                      border-t
                      border-gray-100
                      dark:border-white/10

                      text-sm
                    "
                  >
                    <strong
                      className="
                        min-w-0

                        text-[#080E2F]
                        dark:text-white

                        truncate
                      "
                      title={
                        course.titulo
                      }
                    >
                      {course.titulo}
                    </strong>

                    <CourseStatusBadge
                      status={
                        course.status
                      }
                    />

                    <span
                      className="
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {
                        course.total_matriculas
                      }
                    </span>

                    <span
                      className="
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {
                        course.certificados_emitidos
                      }
                    </span>

                    <span
                      className="
                        font-bold

                        text-[var(--company-primary)]
                      "
                    >
                      {toNumber(
                        course.progresso_medio,
                      )}
                      %
                    </span>
                  </div>
                ),
              )
            )}
          </div>

          {/* MOBILE / TABLET */}
          <div
            className="
              xl:hidden

              grid
              grid-cols-1
              md:grid-cols-2
              2xl:grid-cols-1

              gap-3
              sm:gap-4
            "
          >
            {reports.courses.length ===
            0 ? (
              <div className="md:col-span-2 2xl:col-span-1">
                <ReportsEmptyState
                  message="Nenhum curso encontrado nos relatórios."
                />
              </div>
            ) : (
              reports.courses.map(
                (course) => (
                  <article
                    key={
                      course.curso_id
                    }
                    className="
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
                    <div
                      className="
                        flex
                        items-start
                        justify-between

                        gap-3
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            text-xs
                            font-semibold

                            text-[var(--company-primary)]
                          "
                        >
                          Curso
                        </p>

                        <h3
                          className="
                            mt-1

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
                      </div>

                      <CourseStatusBadge
                        status={
                          course.status
                        }
                      />
                    </div>

                    <div
                      className="
                        grid
                        grid-cols-2

                        gap-3

                        mt-4
                      "
                    >
                      <ReportMetricBox
                        label="Matrículas"
                        value={String(
                          course.total_matriculas ??
                            0,
                        )}
                      />

                      <ReportMetricBox
                        label="Certificados"
                        value={String(
                          course.certificados_emitidos ??
                            0,
                        )}
                      />
                    </div>

                    <div
                      className="
                        mt-3

                        rounded-xl

                        bg-[color-mix(in_srgb,var(--company-primary)_7%,transparent)]

                        p-3
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between

                          gap-3
                        "
                      >
                        <span
                          className="
                            text-xs

                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Progresso médio
                        </span>

                        <strong
                          className="
                            text-sm

                            text-[var(--company-primary)]
                          "
                        >
                          {toNumber(
                            course.progresso_medio,
                          )}
                          %
                        </strong>
                      </div>

                      <div
                        className="
                          mt-2

                          h-2

                          overflow-hidden

                          rounded-full

                          bg-gray-200
                          dark:bg-white/10
                        "
                      >
                        <div
                          style={{
                            width: `${Math.min(
                              Math.max(
                                toNumber(
                                  course.progresso_medio,
                                ),
                                0,
                              ),
                              100,
                            )}%`,
                          }}
                          className="
                            h-full

                            rounded-full

                            bg-[var(--company-primary)]
                          "
                        />
                      </div>
                    </div>
                  </article>
                ),
              )
            )}
          </div>
        </TableCard>

        {/* AVALIAÇÕES */}
        <TableCard title="Desempenho das Avaliações">
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
                grid-cols-[2fr_110px_110px_110px_110px]

                gap-3

                px-3
                py-2

                text-xs
                font-bold
                uppercase

                text-gray-400
              "
            >
              <span>
                Avaliação
              </span>

              <span>
                Tipo
              </span>

              <span>
                Tentativas
              </span>

              <span>
                Aprovados
              </span>

              <span>
                Média
              </span>
            </div>

            {reports.quizzes.length ===
            0 ? (
              <ReportsEmptyState
                message="Nenhuma tentativa de quiz encontrada."
              />
            ) : (
              reports.quizzes.map(
                (quiz) => (
                  <div
                    key={
                      quiz.quiz_id
                    }
                    className="
                      grid
                      grid-cols-[2fr_110px_110px_110px_110px]

                      gap-3

                      items-center

                      px-3
                      py-4

                      border-t
                      border-gray-100
                      dark:border-white/10

                      text-sm
                    "
                  >
                    <div className="min-w-0">
                      <strong
                        className="
                          block

                          text-[#080E2F]
                          dark:text-white

                          truncate
                        "
                        title={
                          quiz.titulo
                        }
                      >
                        {
                          quiz.titulo
                        }
                      </strong>

                      <span
                        className="
                          block

                          mt-1

                          text-xs

                          text-gray-500
                          dark:text-gray-400

                          truncate
                        "
                        title={
                          quiz.curso_titulo
                        }
                      >
                        {
                          quiz.curso_titulo
                        }
                      </span>
                    </div>

                    <span
                      className="
                        text-gray-500
                        dark:text-gray-400

                        capitalize
                      "
                    >
                      {quiz.tipo}
                    </span>

                    <span
                      className="
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {
                        quiz.total_tentativas
                      }
                    </span>

                    <span
                      className="
                        font-semibold

                        text-green-600
                        dark:text-green-400
                      "
                    >
                      {quiz.aprovados ||
                        0}
                    </span>

                    <span
                      className="
                        font-bold

                        text-[var(--company-primary)]
                      "
                    >
                      {quiz.media_nota ||
                        0}
                    </span>
                  </div>
                ),
              )
            )}
          </div>

          {/* MOBILE / TABLET */}
          <div
            className="
              xl:hidden

              grid
              grid-cols-1
              md:grid-cols-2
              2xl:grid-cols-1

              gap-3
              sm:gap-4
            "
          >
            {reports.quizzes.length ===
            0 ? (
              <div className="md:col-span-2 2xl:col-span-1">
                <ReportsEmptyState
                  message="Nenhuma tentativa de quiz encontrada."
                />
              </div>
            ) : (
              reports.quizzes.map(
                (quiz) => (
                  <article
                    key={
                      quiz.quiz_id
                    }
                    className="
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
                    <div
                      className="
                        flex
                        items-start
                        justify-between

                        gap-3
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            text-xs
                            font-semibold

                            text-[var(--company-primary)]
                          "
                        >
                          Avaliação
                        </p>

                        <h3
                          className="
                            mt-1

                            font-bold

                            text-[#080E2F]
                            dark:text-white

                            leading-snug
                            break-words
                          "
                        >
                          {
                            quiz.titulo
                          }
                        </h3>

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
                            quiz.curso_titulo
                          }
                        </p>
                      </div>

                      <span
                        className="
                          w-fit
                          shrink-0

                          rounded-xl

                          bg-gray-100
                          dark:bg-white/10

                          px-2.5
                          py-1

                          text-xs
                          font-semibold

                          text-gray-600
                          dark:text-gray-300

                          capitalize
                        "
                      >
                        {quiz.tipo}
                      </span>
                    </div>

                    <div
                      className="
                        grid
                        grid-cols-3

                        gap-2

                        mt-4
                      "
                    >
                      <ReportMetricBox
                        label="Tentativas"
                        value={String(
                          quiz.total_tentativas ??
                            0,
                        )}
                      />

                      <ReportMetricBox
                        label="Aprovados"
                        value={String(
                          quiz.aprovados ??
                            0,
                        )}
                        success
                      />

                      <ReportMetricBox
                        label="Média"
                        value={String(
                          quiz.media_nota ??
                            0,
                        )}
                        highlighted
                      />
                    </div>
                  </article>
                ),
              )
            )}
          </div>
        </TableCard>
      </div>
    </div>
  );
}

function CourseStatusBadge({
  status,
}: {
  status?: string | null;
}) {
  const normalized =
    status
      ?.toLowerCase()
      .trim() || "";

  const label =
    normalized === "publicado"
      ? "Publicado"
      : normalized === "rascunho"
        ? "Rascunho"
        : normalized === "arquivado"
          ? "Arquivado"
          : status || "Não informado";

  const style =
    normalized === "publicado"
      ? `
          bg-green-500/15
          text-green-600
          dark:text-green-400
        `
      : normalized === "rascunho"
        ? `
            bg-orange-500/15
            text-orange-600
            dark:text-orange-400
          `
        : `
            bg-gray-500/15
            text-gray-600
            dark:text-gray-400
          `;

  return (
    <span
      className={`
        inline-flex

        w-fit

        rounded-xl

        px-2.5
        py-1

        text-xs
        font-semibold

        whitespace-nowrap

        ${style}
      `}
    >
      {label}
    </span>
  );
}

function ReportMetricBox({
  label,
  value,
  highlighted = false,
  success = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
  success?: boolean;
}) {
  return (
    <div
      className="
        min-w-0

        rounded-xl

        bg-gray-50
        dark:bg-white/5

        p-3
      "
    >
      <p
        className="
          text-[11px]
          sm:text-xs

          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-1

          text-sm
          font-bold

          break-words

          ${
            success
              ? "text-green-600 dark:text-green-400"
              : highlighted
                ? "text-[var(--company-primary)]"
                : "text-[#080E2F] dark:text-white"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}

function ReportsEmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div
      className="
        px-3
        py-10

        text-center
      "
    >
      <div
        className="
          w-12
          h-12

          mx-auto
          mb-3

          rounded-2xl

          bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

          text-[var(--company-primary)]

          flex
          items-center
          justify-center
        "
      >
        <BarChart3 size={22} />
      </div>

      <p
        className="
          text-sm

          text-gray-500
          dark:text-gray-400
        "
      >
        {message}
      </p>
    </div>
  );
}