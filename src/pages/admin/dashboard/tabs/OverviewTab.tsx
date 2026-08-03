import {
  Award,
  BarChart3,
  BookOpen,
  Clock3,
  Cpu,
  Monitor,
  UserPlus,
  Users,
} from "lucide-react";

import ActionButton from "../components/ActionButton";
import ActivityItem from "../components/ActivityItem";
import QuickSummary from "../components/QuickSummary";
import StatCard from "../components/StatCard";
import StatsGrid from "../components/StatsGrid";
import TableCard from "../components/TableCard";

import type {
  AdminDashboardData,
  AdminTab,
  CourseType,
  DeviceType,
  UserType,
} from "../types/adminDashboard.types";

interface OverviewTabProps {
  dashboardData: AdminDashboardData | null;
  users: UserType[];
  courses: CourseType[];
  devices: DeviceType[];
  totalStudents: number;
  changeTab: (tab: AdminTab) => void;
  openDeviceModal: () => void;
  createCourse: () => void;
}

export default function OverviewTab({
  dashboardData,
  users,
  courses,
  devices,
  totalStudents,
  changeTab,
  openDeviceModal,
  createCourse,
}: OverviewTabProps) {
  const resumo = dashboardData?.resumo;

  const latestUser = dashboardData?.ultimosUsuarios?.[0];
  const latestCourse = dashboardData?.ultimosCursos?.[0];
  const latestCertificate = dashboardData?.ultimosCertificados?.[0];
  const latestReview = dashboardData?.revisoesPendentes?.[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      <StatsGrid>
        <StatCard
          title="Total de Usuários"
          value={resumo?.totalUsuarios ?? users.length}
          subtitle="Todos os perfis"
          icon={Users}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
          onClick={() => changeTab("users")}
        />

        <StatCard
          title="Dispositivos"
          value={resumo?.totalDispositivos ?? devices.length}
          subtitle="Cadastrados"
          icon={Monitor}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
          onClick={() => changeTab("devices")}
        />

        <StatCard
          title="Cursos Publicados"
          value={resumo?.cursosPublicados ?? courses.length}
          subtitle={`${resumo?.cursosRascunho ?? 0} rascunhos`}
          icon={BookOpen}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
          onClick={() => changeTab("courses")}
        />

        <StatCard
          title="Certificados"
          value={resumo?.certificadosEmitidos ?? 0}
          subtitle="Emitidos"
          icon={Award}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
          onClick={() => changeTab("certificates")}
        />

        <StatCard
          title="Alunos"
          value={resumo?.totalAlunos ?? totalStudents}
          subtitle="Perfil estudante"
          icon={UserPlus}
          color="bg-red-500/15 text-red-600 dark:text-red-400"
          onClick={() => changeTab("users")}
        />

        <StatCard
          title="Revisões"
          value={resumo?.revisoesPendentes ?? 0}
          subtitle="Pendentes"
          icon={Clock3}
          color="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
        />
      </StatsGrid>

      <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.3fr)_minmax(380px,0.9fr)] gap-5 sm:gap-6">
        <TableCard title="Atividades Recentes">
          <div className="space-y-5">
            {latestUser && (
              <ActivityItem
                icon={UserPlus}
                title="Novo usuário cadastrado"
                subtitle={`${latestUser.name} • ${latestUser.role}`}
                time={
                  latestUser.criado_em
                    ? new Date(latestUser.criado_em).toLocaleDateString(
                        "pt-BR",
                      )
                    : "-"
                }
                color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
              />
            )}

            {latestCertificate && (
              <ActivityItem
                icon={Award}
                title="Certificado emitido"
                subtitle={`${latestCertificate.aluno_nome} • ${latestCertificate.curso_titulo}`}
                time={
                  latestCertificate.emitido_em
                    ? new Date(
                        latestCertificate.emitido_em,
                      ).toLocaleDateString("pt-BR")
                    : "-"
                }
                color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
              />
            )}

            {latestCourse && (
              <ActivityItem
                icon={BookOpen}
                title="Curso criado"
                subtitle={`${latestCourse.titulo} • ${latestCourse.status}`}
                time={
                  latestCourse.criado_em
                    ? new Date(latestCourse.criado_em).toLocaleDateString(
                        "pt-BR",
                      )
                    : "-"
                }
                color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
              />
            )}

            {latestReview && (
              <ActivityItem
                icon={Clock3}
                title="Aluno em revisão"
                subtitle={`${latestReview.aluno_nome} • ${latestReview.curso_titulo}`}
                time={`Nota ${latestReview.nota_final ?? "-"}`}
                color="bg-red-500/15 text-red-600 dark:text-red-400"
              />
            )}

            {!latestUser &&
              !latestCertificate &&
              !latestCourse &&
              !latestReview && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Nenhuma atividade recente encontrada.
                </p>
              )}
          </div>
        </TableCard>

        <div className="space-y-5 sm:space-y-6 rounded-3xl">
          <TableCard title="Resumo por Módulo">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickSummary
                icon={Users}
                title="Usuários"
                value={resumo?.totalUsuarios ?? users.length}
                onClick={() => changeTab("users")}
              />

              <QuickSummary
                icon={Cpu}
                title="Dispositivos"
                value={resumo?.totalDispositivos ?? devices.length}
                onClick={() => changeTab("devices")}
              />

              <QuickSummary
                icon={BookOpen}
                title="Cursos"
                value={resumo?.totalCursos ?? courses.length}
                onClick={() => changeTab("courses")}
              />

              <QuickSummary
                icon={Award}
                title="Certificados"
                value={resumo?.certificadosEmitidos ?? 0}
                onClick={() => changeTab("certificates")}
              />
            </div>
          </TableCard>

          <TableCard title="Ações Rápidas">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionButton
                icon={Users}
                title="Gerenciar usuários"
                subtitle="Visualizar e cadastrar usuários"
                onClick={() => changeTab("users")}
              />

              <ActionButton
                icon={Cpu}
                title="Cadastrar dispositivo"
                subtitle="Adicionar novo dispositivo"
                onClick={openDeviceModal}
              />

              <ActionButton
                icon={BookOpen}
                title="Criar curso"
                subtitle="Criar e publicar curso"
                onClick={createCourse}
              />

              <ActionButton
                icon={BarChart3}
                title="Ver relatórios"
                subtitle="Acessar métricas"
                onClick={() => changeTab("reports")}
              />
            </div>
          </TableCard>
        </div>
      </div>
    </div>
  );
}