import { useMemo } from "react";

import {
  Activity,
  BookOpen,
  Cpu,
  FileText,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import Avatar from "../components/Avatar";
import SidePanel from "../components/SidePanel";
import StatCard from "../components/StatCard";
import StatsGrid from "../components/StatsGrid";
import TableCard from "../components/TableCard";

import type { UserType } from "../types/adminDashboard.types";

interface UsersTabProps {
  users: UserType[];
  search: string;
  totalStudents: number;
  totalClients: number;
  totalAdmins: number;
  updateUserRole: (
    userId: number,
    role: UserType["role"],
  ) => void;
  updatingUserRoleId: number | null;
  openClientDevicesModal: (user: UserType) => void;
}

export default function UsersTab({
  users,
  search,
  totalStudents,
  totalClients,
  totalAdmins,
  updateUserRole,
  updatingUserRoleId,
  openClientDevicesModal,
}: UsersTabProps) {
  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <StatsGrid>
        <StatCard
          title="Total de Usuários"
          value={users.length}
          subtitle="Todos os perfis"
          icon={Users}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Alunos"
          value={totalStudents}
          subtitle="Perfil estudante"
          icon={BookOpen}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Clientes"
          value={totalClients}
          subtitle="Perfil cliente"
          icon={UserPlus}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Admins"
          value={totalAdmins}
          subtitle="Administradores"
          icon={ShieldCheck}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Ativos Hoje"
          value={users.length}
          subtitle="Usuários ativos"
          icon={Activity}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Convites"
          value="0"
          subtitle="Pendentes"
          icon={FileText}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />
      </StatsGrid>

      <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)] gap-5 sm:gap-6">
        <TableCard title="Lista de Usuários">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[1.2fr_1.4fr_1fr_220px] text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 pb-3">
              <span>Usuário</span>
              <span>Email</span>
              <span>Perfil</span>

              <span className="text-right">
                Cliente / Dispositivos
              </span>
            </div>

            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[1.2fr_1.4fr_1fr_220px] gap-4 items-center py-4 border-b border-gray-200 dark:border-white/10 last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={user.name} />

                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#080E2F] dark:text-white truncate">
                      {user.name}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {user.id}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </p>

                <select
                  value={user.role}
                  disabled={updatingUserRoleId === user.id}
                  onChange={(event) =>
                    updateUserRole(
                      user.id,
                      event.target.value as UserType["role"],
                    )
                  }
                  className="
                    w-full
                    max-w-[180px]
                    rounded-xl
                    border
                    border-gray-200
                    dark:border-white/10
                    bg-white
                    dark:bg-[#0d2238]
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    text-[#080E2F]
                    dark:text-white
                    outline-none
                    focus:border-blue-500
                    disabled:opacity-60
                  "
                >
                  <option value="student">Aluno</option>
                  <option value="client">Cliente</option>
                  <option value="admin">
                    Administrador
                  </option>
                </select>

                <div className="flex justify-end">
                  {user.role === "client" ? (
                    <button
                      type="button"
                      onClick={() =>
                        openClientDevicesModal(user)
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-500/10
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-blue-600
                        dark:text-blue-400
                        hover:bg-blue-500/20
                        transition-all
                      "
                    >
                      <Cpu size={18} />
                      Dispositivos
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      -
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TableCard>

        <SidePanel
          title="Distribuição por Perfil"
          items={[
            {
              label: "Alunos",
              value: totalStudents,
              percentage: users.length
                ? Math.round(
                    (totalStudents / users.length) * 100,
                  )
                : 0,
            },
            {
              label: "Clientes",
              value: totalClients,
              percentage: users.length
                ? Math.round(
                    (totalClients / users.length) * 100,
                  )
                : 0,
            },
            {
              label: "Administradores",
              value: totalAdmins,
              percentage: users.length
                ? Math.round(
                    (totalAdmins / users.length) * 100,
                  )
                : 0,
            },
          ]}
        />
      </div>
    </div>
  );
}