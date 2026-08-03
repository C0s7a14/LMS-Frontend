import { useState } from "react";

import {
  Award,
  BarChart3,
  BookOpen,
  FileText,
  Star,
  UserPlus,
  Users,
} from "lucide-react";

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


export default function ReportsTab({
  reports,
  devices,
}: {
  reports: AdminReportsData | null;
  devices: DeviceType[];
}) {
  const [selectedMetric, setSelectedMetric] =
    useState<MetricKey>("certificates");

  function formatMonth(month: string) {
    if (!month) {
      return "Sem mês";
    }

    const [year, monthNumber] = month.split("-");

    if (!year || !monthNumber) {
      return month;
    }

    return `${monthNumber}/${year}`;
  }

  function toNumber(value: number | string | null | undefined) {
    return Number(value || 0);
  }

  if (!reports) {
    return (
      <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-8 text-center text-gray-500 dark:text-gray-400">
        Carregando relatórios...
      </div>
    );
  }

  const summary = reports.summary;

  const averageCompletion =
    reports.courses.length > 0
      ? Math.round(
          reports.courses.reduce(
            (total, course) => total + toNumber(course.progresso_medio),
            0
          ) / reports.courses.length
        )
      : 0;

  const averageQuizScore =
    reports.quizzes.length > 0
      ? (
          reports.quizzes.reduce(
            (total, quiz) => total + toNumber(quiz.media_nota),
            0
          ) / reports.quizzes.length
        ).toFixed(1)
      : "0";

  const bestCourse = [...reports.courses].sort(
    (a, b) => toNumber(b.total_matriculas) - toNumber(a.total_matriculas)
  )[0];

  const bestQuiz = [...reports.quizzes].sort(
    (a, b) => toNumber(b.total_tentativas) - toNumber(a.total_tentativas)
  )[0];

  const chartData = {
    users: {
      title: "Alunos e Clientes",
      subtitle: "Distribuição atual de usuários principais da plataforma.",
      suffix: "",
      data: [
        { label: "Alunos", value: summary.total_alunos },
        { label: "Clientes", value: summary.total_clientes },
      ],
    },

        courses: {
          title: "Cursos da Plataforma",
          subtitle: "Total de cursos e cursos publicados.",
          suffix: "",
          data: [
            { label: "Total", value: summary.total_cursos },
            { label: "Publicados", value: summary.cursos_publicados },
          ],
        },

        enrollments: {
          title: "Matrículas por Curso",
          subtitle: "Cursos com maior número de matrículas.",
          suffix: "",
          data:
            reports.courses.length > 0
              ? reports.courses.slice(0, 8).map((course) => ({
                  label: course.titulo,
                  value: toNumber(course.total_matriculas),
                }))
              : [{ label: "Sem dados", value: 0 }],
        },

    devices: {
      title: "Dispositivos Cadastrados",
      subtitle: "Quantidade total de dispositivos registrados.",
      suffix: "",
      data: [{ label: "Dispositivos", value: devices.length }],
    },

    certificates: {
      title: "Certificados Emitidos",
      subtitle: "Certificados gerados por mês.",
      suffix: "",
      data:
        reports.monthlyCertificates.length > 0
          ? reports.monthlyCertificates.map((item) => ({
              label: formatMonth(item.mes),
              value: toNumber(item.total),
            }))
          : [{ label: "Sem certificados", value: 0 }],
    },

    completion: {
      title: "Conclusão Média por Curso",
      subtitle: "Percentual médio de progresso dos alunos por curso.",
      suffix: "%",
      data:
        reports.courses.length > 0
          ? reports.courses.slice(0, 8).map((course) => ({
              label: course.titulo,
              value: toNumber(course.progresso_medio),
            }))
          : [{ label: "Sem dados", value: 0 }],
    },

    satisfaction: {
      title: "Nota Média dos Quizzes",
      subtitle: "Média de desempenho nas avaliações.",
      suffix: "",
      data:
        reports.quizzes.length > 0
          ? reports.quizzes.slice(0, 8).map((quiz) => ({
              label: quiz.titulo,
              value: toNumber(quiz.media_nota),
            }))
          : [{ label: "Sem tentativas", value: 0 }],
    },
  };

  const selectedChart = chartData[selectedMetric];

  return (
    <div className="space-y-6 sm:space-y-8">
      <StatsGrid>
        <StatCard
          title="Alunos"
          value={summary.total_alunos}
          subtitle="Cadastrados"
          icon={Users}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
          active={selectedMetric === "users"}
          onClick={() => setSelectedMetric("users")}
        />

        <StatCard
          title="Cursos"
          value={summary.total_cursos}
          subtitle={`${summary.cursos_publicados} publicados`}
          icon={BookOpen}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
          active={selectedMetric === "courses"}
          onClick={() => setSelectedMetric("courses")}
        />

        <StatCard
          title="Matrículas"
          value={summary.total_matriculas}
          subtitle="Total registradas"
          icon={UserPlus}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
         active={selectedMetric === "enrollments"}
          onClick={() => setSelectedMetric("enrollments")}
        />

        <StatCard
          title="Certificados"
          value={summary.certificados_emitidos}
          subtitle="Emitidos"
          icon={Award}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
          active={selectedMetric === "certificates"}
          onClick={() => setSelectedMetric("certificates")}
        />

        <StatCard
          title="Conclusão"
          value={`${averageCompletion}%`}
          subtitle="Média dos cursos"
          icon={BarChart3}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
          active={selectedMetric === "completion"}
          onClick={() => setSelectedMetric("completion")}
        />

        <StatCard
          title="Média quizzes"
          value={averageQuizScore}
          subtitle="Nota média"
          icon={Star}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
          active={selectedMetric === "satisfaction"}
          onClick={() => setSelectedMetric("satisfaction")}
        />
      </StatsGrid>

      <MetricChart
        title={selectedChart.title}
        subtitle={selectedChart.subtitle}
        data={selectedChart.data}
        suffix={selectedChart.suffix}
      />

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5 sm:gap-6">
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
          <div className="space-y-5">
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

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5 sm:gap-6">
        <TableCard title="Desempenho por Curso">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[2fr_110px_110px_110px_120px] gap-3 px-3 py-2 text-xs font-bold uppercase text-gray-400">
              <span>Curso</span>
              <span>Status</span>
              <span>Matrículas</span>
              <span>Certificados</span>
              <span>Progresso</span>
            </div>

            {reports.courses.length === 0 ? (
              <div className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                Nenhum curso encontrado nos relatórios.
              </div>
            ) : (
              reports.courses.map((course) => (
                <div
                  key={course.curso_id}
                  className="grid grid-cols-[2fr_110px_110px_110px_120px] gap-3 px-3 py-4 border-t border-gray-100 dark:border-white/10 text-sm items-center"
                >
                  <strong className="text-[#080E2F] dark:text-white truncate">
                    {course.titulo}
                  </strong>

                  <span className="text-gray-500 dark:text-gray-400">
                    {course.status}
                  </span>

                  <span className="text-gray-500 dark:text-gray-400">
                    {course.total_matriculas}
                  </span>

                  <span className="text-gray-500 dark:text-gray-400">
                    {course.certificados_emitidos}
                  </span>

                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {toNumber(course.progresso_medio)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </TableCard>

        <TableCard title="Desempenho das Avaliações">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[2fr_110px_110px_110px_110px] gap-3 px-3 py-2 text-xs font-bold uppercase text-gray-400">
              <span>Avaliação</span>
              <span>Tipo</span>
              <span>Tentativas</span>
              <span>Aprovados</span>
              <span>Média</span>
            </div>

            {reports.quizzes.length === 0 ? (
              <div className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                Nenhuma tentativa de quiz encontrada.
              </div>
            ) : (
              reports.quizzes.map((quiz) => (
                <div
                  key={quiz.quiz_id}
                  className="grid grid-cols-[2fr_110px_110px_110px_110px] gap-3 px-3 py-4 border-t border-gray-100 dark:border-white/10 text-sm items-center"
                >
                  <div className="min-w-0">
                    <strong className="text-[#080E2F] dark:text-white truncate block">
                      {quiz.titulo}
                    </strong>

                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">
                      {quiz.curso_titulo}
                    </span>
                  </div>

                  <span className="text-gray-500 dark:text-gray-400">
                    {quiz.tipo}
                  </span>

                  <span className="text-gray-500 dark:text-gray-400">
                    {quiz.total_tentativas}
                  </span>

                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    {quiz.aprovados || 0}
                  </span>

                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {quiz.media_nota || 0}
                  </span>
                </div>
              ))
            )}
          </div>
        </TableCard>
      </div>
    </div>
  );
}

