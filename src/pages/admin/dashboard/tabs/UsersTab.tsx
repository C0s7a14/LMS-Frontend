import { useMemo, useState } from "react";

import {
  Activity,
  BookOpen,
  Cpu,
  ShieldCheck,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";

import Avatar from "../components/Avatar";
import SidePanel from "../components/SidePanel";
import StatCard from "../components/StatCard";
import StatsGrid from "../components/StatsGrid";
import TableCard from "../components/TableCard";

import ActiveUsersTodayView from "./ActiveUsersTodayView";
import useActiveUsersToday from "../hooks/useActiveUsersToday";

import type {
  AdminStudentOverviewType,
  UserType,
} from "../types/adminDashboard.types";

interface UsersTabProps {
  users: UserType[];
  students: AdminStudentOverviewType[];
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

  disconnectUser: (
  user: UserType
) => void;

disconnectingUserId:
  | number
  | null;

}

export default function UsersTab({
  users,
  students,
  search,
  totalStudents,
  totalClients,
  totalAdmins,
  updateUserRole,
  updatingUserRoleId,
  openClientDevicesModal,
  disconnectUser,
  disconnectingUserId,
}: UsersTabProps) {

const [activeView, setActiveView] =
  useState<
    "all" | "clients" | "students" | "admins"  | "active"
  >("all");

  const {
  activeUsers,
  activeUsersTotal,
  loadingActiveUsers,
} = useActiveUsersToday();

const activeCompanyUsers =
  useMemo(
    () =>
      users.filter(
        (user) =>
          user.vinculo_status ===
          "ativo"
      ),
    [users]
  );

const filteredUsers = useMemo(() => {
  const term = search.toLowerCase().trim();

  return users.filter((user) => {
    const matchesSearch =
      user.name
        ?.toLowerCase()
        .includes(term) ||
      user.email
        ?.toLowerCase()
        .includes(term) ||
      user.role
        ?.toLowerCase()
        .includes(term);

  const matchesView =
  activeView === "all" ||
  (
    activeView === "clients" &&
    user.role === "client" &&
    user.vinculo_status ===
      "ativo"
  ) ||
  (
    activeView === "admins" &&
    user.role === "admin" &&
    user.vinculo_status ===
      "ativo" &&
    user.is_admin_empresa
  );

    return matchesSearch && matchesView;
  });
}, [users, search, activeView]);

const filteredStudents = useMemo(() => {
  const term = search.toLowerCase().trim();

  return students.filter((student) => {
    return (
      student.name
        ?.toLowerCase()
        .includes(term) ||
      student.email
        ?.toLowerCase()
        .includes(term)
    );
  });
}, [students, search]);
  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-8">
      <StatsGrid columns={5}>
      
      <StatCard
      title="Total de Usuários"
      value={activeCompanyUsers.length}
      subtitle="Todos os perfis"
      icon={Users}
      color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
      onClick={() => setActiveView("all")}
      active={activeView === "all"}
    />

      <StatCard
      title="Alunos"
      value={totalStudents}
      subtitle="Gerenciar alunos"
      icon={BookOpen}
      color="bg-green-500/15 text-green-600 dark:text-green-400"
      onClick={() => setActiveView("students")}
      active={activeView === "students"}
    />

        <StatCard
          title="Clientes"
          value={totalClients}
          subtitle="Gerenciar clientes"
          icon={UserPlus}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
          onClick={() => setActiveView("clients")}
          active={activeView === "clients"}
        />

        <StatCard
          title="Admins"
          value={totalAdmins}
          subtitle="Gerenciar administradores"
          icon={ShieldCheck}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
          onClick={() => setActiveView("admins")}
          active={activeView === "admins"}
        />

       <StatCard
        title="Ativos Hoje"
        value={activeUsersTotal}
        subtitle="Usuários ativos"
        icon={Activity}
        color="bg-green-500/15 text-green-600 dark:text-green-400"
        onClick={() =>
          setActiveView("active")
        }
        active={
          activeView === "active"
        }
      />

      

        </StatsGrid>


      { activeView === "active" ? (
            <ActiveUsersTodayView
              users={activeUsers}
              loading={
                loadingActiveUsers
              }
              search={search}
            />
          ) : activeView === "students" ? (
                <TableCard title="Gestão de Alunos">

    {/* DESKTOP / TABLET */}
    <div className="hidden xl:block min-w-[900px]">
      <div
        className="
          grid
          grid-cols-[1.5fr_0.6fr_1.2fr_0.8fr_0.8fr_1fr]
          gap-3
          text-sm
          text-gray-500
          dark:text-gray-400
          border-b
          border-gray-200
          dark:border-white/10
          pb-3
        "
      >
        <span>Aluno</span>
        <span>Cursos</span>
        <span>Progresso</span>
        <span>Nota média</span>
        <span>Certificados</span>
        <span>Última atividade</span>
      </div>

      {filteredStudents.length > 0 ? (
        filteredStudents.map((student) => {
          const progress = Number(
            student.progresso_medio || 0,
          );

          const score =
            student.media_nota === null
              ? null
              : Number(student.media_nota);

          const lastActivity =
            student.ultima_atividade &&
            !student.ultima_atividade.startsWith(
              "1970-01-01",
            )
              ? new Date(
                  student.ultima_atividade,
                ).toLocaleDateString("pt-BR")
              : "Sem atividade";

          return (
            <div
              key={student.id}
              className="
                grid
                grid-cols-[1.5fr_0.6fr_1.2fr_0.8fr_0.8fr_1fr]
                gap-3
                items-center
                py-3
                border-b
                border-gray-200
                dark:border-white/10
                last:border-b-0
              "
            >
              {/* Aluno */}
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={student.name} />

                <div className="min-w-0">
                  <h3 className="font-semibold text-[#080E2F] dark:text-white truncate">
                    {student.name}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {student.email}
                  </p>
                </div>
              </div>

              {/* Cursos */}
              <span className="font-semibold text-[#080E2F] dark:text-white">
                {Number(student.total_cursos)}
              </span>

              {/* Progresso */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#080E2F] dark:text-white">
                    {progress}%
                  </span>

                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                     className="
                          h-full
                          bg-[var(--company-primary)]
                          rounded-full
                          transition-all
                        "
                      style={{
                        width: `${Math.min(
                          progress,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Nota */}
              <span className="font-semibold text-[#080E2F] dark:text-white">
                {score === null
                  ? "—"
                  : `${score.toFixed(1)}%`}
              </span>

              {/* Certificados */}
              <span
                className="
                  inline-flex
                  items-center
                  justify-center
                  w-8
                  h-8
                  rounded-full
                  bg-green-500/10
                  text-sm
                  font-semibold
                  text-green-600
                  dark:text-green-400
                "
              >
                {Number(
                  student.total_certificados,
                )}
              </span>

              {/* Atividade */}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {lastActivity}
              </span>
            </div>
          );
        })
      ) : (
        <div className="py-10 text-center text-gray-500 dark:text-gray-400">
          Nenhum aluno encontrado.
        </div>
      )}
    </div>


    {/* MOBILE */}
    <div className="xl:hidden space-y-3">
      {filteredStudents.length > 0 ? (
        filteredStudents.map((student) => {
          const progress = Number(
            student.progresso_medio || 0,
          );

          const score =
            student.media_nota === null
              ? null
              : Number(student.media_nota);

          const lastActivity =
            student.ultima_atividade &&
            !student.ultima_atividade.startsWith(
              "1970-01-01",
            )
              ? new Date(
                  student.ultima_atividade,
                ).toLocaleDateString("pt-BR")
              : "Sem atividade";

          return (
            <div
              key={student.id}
              className="
                rounded-2xl
                border
                border-gray-200
                dark:border-white/10
                p-4
              "
            >
              {/* Cabeçalho do aluno */}
              <div className="flex items-center gap-3">
                <Avatar name={student.name} />

                <div className="min-w-0">
                  <h3 className="font-bold text-[#080E2F] dark:text-white truncate">
                    {student.name}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {student.email}
                  </p>
                </div>
              </div>

              {/* Progresso */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Progresso
                  </span>

                  <span className="font-bold text-[#080E2F] dark:text-white">
                    {progress}%
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div
                   className="
                    h-full
                    bg-[var(--company-primary)]
                    rounded-full
                    transition-all
                  "
                    style={{
                      width: `${Math.min(
                        progress,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Dados */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cursos
                  </p>

                  <p className="font-bold text-[#080E2F] dark:text-white mt-1">
                    {Number(student.total_cursos)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nota
                  </p>

                  <p className="font-bold text-[#080E2F] dark:text-white mt-1">
                    {score === null
                      ? "—"
                      : `${score.toFixed(1)}%`}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Certificados
                  </p>

                  <p className="font-bold text-green-600 dark:text-green-400 mt-1">
                    {Number(
                      student.total_certificados,
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-white/10">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Última atividade
                </span>

                <span className="text-xs font-semibold text-[#080E2F] dark:text-white">
                  {lastActivity}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="py-10 text-center text-gray-500 dark:text-gray-400">
          Nenhum aluno encontrado.
        </div>
      )}
    </div>

  </TableCard>
) : activeView === "admins" ? (
  <TableCard title="Administradores">

    {/* DESKTOP */}
    <div className="hidden xl:block min-w-[760px]">
      <div
        className="
          grid
          grid-cols-[1.4fr_1.6fr_1fr_1.2fr]
          gap-4
          text-sm
          text-gray-500
          dark:text-gray-400
          border-b
          border-gray-200
          dark:border-white/10
          pb-3
        "
      >
        <span>Administrador</span>
        <span>Email</span>
        <span>Cadastro</span>
        <span>Permissão</span>
      </div>

      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => {
          const createdAt = user.criado_em
            ? new Date(
                user.criado_em,
              ).toLocaleDateString("pt-BR")
            : "—";

          return (
            <div
              key={user.id}
              className="
                grid
                grid-cols-[1.4fr_1.6fr_1fr_1.2fr]
                gap-4
                items-center
                py-4
                border-b
                border-gray-200
                dark:border-white/10
                last:border-b-0
              "
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

              <span className="text-sm text-gray-500 dark:text-gray-400">
                {createdAt}
              </span>

              <select
                value={user.role}
               disabled={
                  updatingUserRoleId ===
                    user.id ||
                  user.vinculo_status ===
                    "desligado"
                }
                onChange={(event) =>
                  updateUserRole(
                    user.id,
                    event.target
                      .value as UserType["role"],
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
                 focus:border-[var(--company-primary)]
                  disabled:opacity-60
                "
              >
                <option value="student">
                  Aluno
                </option>

                <option value="client">
                  Cliente
                </option>

                <option value="admin">
                  Administrador
                </option>
              </select>
            </div>
          );
        })
      ) : (
        <div className="py-10 text-center text-gray-500 dark:text-gray-400">
          Nenhum administrador encontrado.
        </div>
      )}
    </div>


    {/* MOBILE */}
   <div className="xl:hidden space-y-3">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => {
          const createdAt = user.criado_em
            ? new Date(
                user.criado_em,
              ).toLocaleDateString("pt-BR")
            : "—";

          return (
            <div
              key={user.id}
              className="
                rounded-2xl
                border
                border-gray-200
                dark:border-white/10
                p-4
              "
            >
              <div className="flex items-center gap-3">
                <Avatar name={user.name} />

                <div className="min-w-0">
                  <h3 className="font-bold text-[#080E2F] dark:text-white truncate">
                    {user.name}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div
                  className="
                    rounded-xl
                    bg-gray-50
                    dark:bg-white/5
                    p-3
                  "
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cadastro
                  </p>

                  <p className="font-semibold text-[#080E2F] dark:text-white mt-1">
                    {createdAt}
                  </p>
                </div>

               <div
                className="
                  rounded-xl
                  bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                  p-3
                "
              >
                <p className="text-xs text-[var(--company-primary)]">
                  Perfil
                </p>

                <p className="font-semibold text-[var(--company-primary)] mt-1">
                  Administrador
                </p>
              </div>
              </div>

              <select
                value={user.role}
                disabled={
                  updatingUserRoleId ===
                    user.id ||
                  user.vinculo_status ===
                    "desligado"
                }
                onChange={(event) =>
                  updateUserRole(
                    user.id,
                    event.target
                      .value as UserType["role"],
                  )
                }
               className="
                w-full
                mt-4
                rounded-xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#0d2238]

                px-3
                py-3

                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-white

                outline-none
                focus:border-[var(--company-primary)]

                disabled:opacity-60
              "
              >
                <option value="student">
                  Aluno
                </option>

                <option value="client">
                  Cliente
                </option>

                <option value="admin">
                  Administrador
                </option>
              </select>
            </div>
          );
        })
      ) : (
        <div className="py-10 text-center text-gray-500 dark:text-gray-400">
          Nenhum administrador encontrado.
        </div>
      )}
    </div>

  </TableCard>

) : activeView === "clients" ? (
     <TableCard title="Clientes">

  {/* DESKTOP */}
  <div className="hidden xl:block min-w-[760px]">
    <div
      className="
        grid
        grid-cols-[1.2fr_1.4fr_1.4fr_220px]
        gap-4

        text-sm
        text-gray-500
        dark:text-gray-400

        border-b
        border-gray-200
        dark:border-white/10

        pb-3
      "
    >
      <span>Cliente</span>

      <span>Email</span>

      <span>
        Dispositivos vinculados
      </span>

      <span className="text-right">
        Ações
      </span>
    </div>

    {filteredUsers.length > 0 ? (
      filteredUsers.map((user) => (
        <div
          key={user.id}
          className="
            grid
            grid-cols-[1.2fr_1.4fr_1.4fr_220px]
            gap-4

            items-center

            py-4

            border-b
            border-gray-200
            dark:border-white/10

            last:border-b-0
          "
        >
          {/* Cliente */}
          <div
            className="
              flex
              items-center
              gap-3
              min-w-0
            "
          >
            <Avatar
              name={user.name}
            />

            <div className="min-w-0">
              <h3
                className="
                  font-semibold
                  text-[#080E2F]
                  dark:text-white
                  truncate
                "
              >
                {user.name}
              </h3>

              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                  mt-1
                "
              >
                ID: {user.id}
              </p>
            </div>
          </div>

          {/* Email */}
          <p
            className="
              text-gray-600
              dark:text-gray-400
              truncate
            "
            title={user.email}
          >
            {user.email}
          </p>

          {/* Dispositivos */}
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            {user.devices &&
            user.devices.length > 0 ? (
              <>
                {user.devices
                  .slice(0, 2)
                  .map((device) => (
                    <span
                      key={device.id}
                      className="
                        inline-flex
                        items-center
                        gap-1.5

                        rounded-xl

                        bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                        px-3
                        py-1.5

                        text-xs
                        font-semibold

                        text-[var(--company-primary)]
                      "
                    >
                      <Cpu size={14} />

                      {device.nome}
                    </span>
                  ))}

                {user.devices.length >
                  2 && (
                  <span
                    className="
                      rounded-xl
                      bg-gray-100
                      dark:bg-white/10

                      px-3
                      py-1.5

                      text-xs
                      font-semibold

                      text-gray-600
                      dark:text-gray-300
                    "
                  >
                    +
                    {user.devices.length -
                      2}
                  </span>
                )}
              </>
            ) : (
              <span
                className="
                  text-sm
                  text-gray-400
                  dark:text-gray-500
                "
              >
                Nenhum dispositivo
              </span>
            )}
          </div>

          {/* Ações */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                openClientDevicesModal(
                  user
                )
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2

                rounded-xl

                bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                px-4
                py-2.5

                text-sm
                font-semibold

                text-[var(--company-primary)]

                hover:bg-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]

                transition-all
              "
            >
              <Cpu size={18} />

              Gerenciar dispositivos
            </button>
          </div>
        </div>
      ))
    ) : (
      <ClientEmptyState />
    )}
  </div>

  {/* MOBILE / TABLET */}
  <div className="xl:hidden space-y-3">
    {filteredUsers.length > 0 ? (
      filteredUsers.map((user) => (
        <div
          key={user.id}
          className="
            min-w-0

            rounded-2xl

            border
            border-gray-200
            dark:border-white/10

            p-4

            shadow-md
            dark:shadow-none
          "
        >
          {/* Usuário */}
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <Avatar
              name={user.name}
            />

            <div className="min-w-0">
              <h3
                className="
                  font-bold
                  text-[#080E2F]
                  dark:text-white

                  break-words
                "
              >
                {user.name}
              </h3>

              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400

                  break-all
                "
              >
                {user.email}
              </p>
            </div>
          </div>

          {/* Dispositivos */}
          <div className="mt-4">
            <p
              className="
                text-xs
                font-semibold

                text-gray-500
                dark:text-gray-400

                mb-2
              "
            >
              Dispositivos vinculados
            </p>

            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >
              {user.devices &&
              user.devices.length > 0 ? (
                user.devices.map(
                  (device) => (
                    <span
                      key={device.id}
                      className="
                        inline-flex
                        items-center
                        gap-1.5

                        rounded-xl

                        bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                        px-3
                        py-2

                        text-xs
                        font-semibold

                        text-[var(--company-primary)]
                      "
                    >
                      <Cpu size={14} />

                      {device.nome}
                    </span>
                  )
                )
              ) : (
                <span
                  className="
                    text-sm
                    text-gray-400
                    dark:text-gray-500
                  "
                >
                  Nenhum dispositivo
                  vinculado.
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              openClientDevicesModal(
                user
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
            <Cpu size={18} />

            Gerenciar dispositivos
          </button>
        </div>
      ))
    ) : (
      <ClientEmptyState />
    )}
  </div>

</TableCard>
) : (
  <div
    className="
      grid
      grid-cols-1
      2xl:grid-cols-[minmax(0,1fr)_360px]
      gap-5
      sm:gap-6
    "
  >
    <TableCard title="Lista de Usuários">

      {/* DESKTOP */}
      <div className="hidden xl:block min-w-[850px]">
        <div
          className="
            grid
            grid-cols-[1.35fr_1.4fr_0.9fr_0.8fr_0.9fr_220px]
            gap-4
            text-sm
            text-gray-500
            dark:text-gray-400
            border-b
            border-gray-200
            dark:border-white/10
            pb-3
          "
        >
        <span>Usuário</span>
        <span>Email</span>
        <span>Perfil</span>
        <span>Status</span>
        <span>Cadastro</span>

        <span className="text-right">
          Ações
        </span>
        </div>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const createdAt = user.criado_em
              ? new Date(
                  user.criado_em,
                ).toLocaleDateString("pt-BR")
              : "—";

            return (
              <div
                key={user.id}
                className="
                  grid
                  grid-cols-[1.35fr_1.4fr_0.9fr_0.8fr_0.9fr_220px]
                  gap-4
                  items-center
                  py-4
                  border-b
                  border-gray-200
                  dark:border-white/10
                  last:border-b-0
                "
              >
                {/* Usuário */}
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

                {/* Email */}
                <p className="text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </p>

                {/* Perfil */}
                <select
                  value={user.role}
                 disabled={
                    updatingUserRoleId ===
                      user.id ||
                    user.vinculo_status ===
                      "desligado"
                  }
                  onChange={(event) =>
                    updateUserRole(
                      user.id,
                      event.target
                        .value as UserType["role"],
                    )
                  }
                  className="
                    w-full
                    max-w-[170px]
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
                   focus:border-[var(--company-primary)]
                    disabled:opacity-60
                  "
                >
                  <option value="student">
                    Aluno
                  </option>

                  <option value="client">
                    Cliente
                  </option>

                  <option value="admin">
                    Administrador
                  </option>
                </select>

                  {/* Status */}
                  <span
                    className={`
                      inline-flex
                      w-fit

                      rounded-full

                      px-3
                      py-1.5

                      text-xs
                      font-bold

                      ${
                        user.vinculo_status ===
                        "ativo"
                          ? `
                              bg-green-500/15
                              text-green-600
                              dark:text-green-400
                            `
                          : `
                              bg-gray-200
                              dark:bg-white/10

                              text-gray-600
                              dark:text-gray-400
                            `
                      }
                    `}
                  >
                    {user.vinculo_status ===
                    "ativo"
                      ? "Ativo"
                      : "Desligado"}
                  </span>

                {/* Cadastro */}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {createdAt}
                </span>

           {/* Ações */}
              <div
                className="
                  flex
                  items-center
                  justify-end
                  gap-2
                "
              >
                {user.role === "client" &&
                  user.vinculo_status === "ativo" && (
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

                        bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                        px-3
                        py-2

                        text-sm
                        font-semibold

                        text-[var(--company-primary)]

                        hover:bg-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]

                        transition-all
                      "
                    >
                      <Cpu size={17} />

                      Dispositivos
                    </button>
                  )}

                {user.vinculo_status === "ativo" ? (
                  <button
                    type="button"
                    disabled={
                      disconnectingUserId ===
                      user.id
                    }
                    onClick={() =>
                      disconnectUser(user)
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2

                      rounded-xl

                      border
                      border-red-200
                      dark:border-red-500/20

                      bg-red-50
                      dark:bg-red-500/10

                      px-3
                      py-2

                      text-sm
                      font-semibold

                      text-red-600
                      dark:text-red-400

                      hover:bg-red-100
                      dark:hover:bg-red-500/20

                      transition-all

                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    <UserMinus size={17} />

                    {disconnectingUserId ===
                    user.id
                      ? "Desligando..."
                      : "Desligar"}
                  </button>
                ) : (
                  <span
                    className="
                      text-sm
                      font-medium
                      text-gray-400
                      dark:text-gray-500
                    "
                  >
                    —
                  </span>
                )}
              </div>

              </div>
              );
              })
              ) : (
                <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                  Nenhum usuário encontrado.
                </div>
              )}
              </div>
      {/* MOBILE / TABLET */}
      <div className="xl:hidden space-y-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const createdAt = user.criado_em
              ? new Date(
                  user.criado_em,
                ).toLocaleDateString("pt-BR")
              : "—";

            return (
              <div
                key={user.id}
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  dark:border-white/10
                  p-4
                "
              >
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} />

                  <div className="min-w-0">
                    <h3 className="font-bold text-[#080E2F] dark:text-white truncate">
                      {user.name}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Perfil
                    </p>

                    <select
                      value={user.role}
                     disabled={
                        updatingUserRoleId ===
                          user.id ||
                        user.vinculo_status ===
                          "desligado"
                      }
                      onChange={(event) =>
                        updateUserRole(
                          user.id,
                          event.target
                            .value as UserType["role"],
                        )
                      }
                      className="
                        w-full
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
                      "
                    >
                      <option value="student">
                        Aluno
                      </option>

                      <option value="client">
                        Cliente
                      </option>

                      <option value="admin">
                        Administrador
                      </option>
                    </select>
                  </div>


                 <div>
                  <p
                    className="
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Status
                  </p>

                  <span
                    className={`
                      inline-flex

                      mt-2

                      rounded-full

                      px-3
                      py-1

                      text-xs
                      font-bold

                      ${
                        user.vinculo_status ===
                        "ativo"
                          ? `
                              bg-green-500/15
                              text-green-600
                              dark:text-green-400
                            `
                          : `
                              bg-gray-200
                              dark:bg-white/10

                              text-gray-600
                              dark:text-gray-400
                            `
                      }
                    `}
                  >
                    {user.vinculo_status ===
                    "ativo"
                      ? "Ativo"
                      : "Desligado"}
                  </span>
                </div>


                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Cadastro
                    </p>

                    <p className="font-semibold text-[#080E2F] dark:text-white mt-2">
                      {createdAt}
                    </p>
                  </div>
                </div>

              {user.role ===
              "client" &&
              user.vinculo_status ===
                "ativo" && (
              <button
                type="button"
                onClick={() =>
                  openClientDevicesModal(
                    user
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
                <Cpu size={18} />

                Gerenciar dispositivos
              </button>
            )}

            {user.vinculo_status ===
              "ativo" && (
              <button
                type="button"
                disabled={
                  disconnectingUserId ===
                  user.id
                }
                onClick={() =>
                  disconnectUser(user)
                }
                className="
                  w-full

                  mt-3

                  rounded-xl

                  border
                  border-red-200
                  dark:border-red-500/20

                  bg-red-50
                  dark:bg-red-500/10

                  px-4
                  py-3

                  flex
                  items-center
                  justify-center
                  gap-2

                  text-sm
                  font-semibold

                  text-red-600
                  dark:text-red-400

                  transition-all

                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <UserMinus
                  size={18}
                />

                {disconnectingUserId ===
                user.id
                  ? "Desligando..."
                  : "Desligar usuário"}
              </button>
            )}
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">
            Nenhum usuário encontrado.
          </div>
        )}
      </div>

    </TableCard>

    {/* Resumo lateral */}
    <div className="hidden 2xl:block">
      <SidePanel
        title="Distribuição por Perfil"
        items={[
          {
            label: "Alunos",
            value: totalStudents,
            percentage: activeCompanyUsers.length
              ? Math.round(
                  (
                    totalStudents /
                    activeCompanyUsers.length
                  ) *
                    100,
                )
              : 0,
          },
          {
            label: "Clientes",
            value: totalClients,
            percentage: activeCompanyUsers.length
              ? Math.round(
                  (totalClients /
                    activeCompanyUsers.length) *
                    100,
                )
              : 0,
          },
          {
            label: "Administradores",
            value: totalAdmins,
            percentage: activeCompanyUsers.length
              ? Math.round(
                  (totalAdmins /
                    activeCompanyUsers.length) *
                    100,
                )
              : 0,
          },
        ]}
      />
    </div>
  </div>
)}

    </div>
  );
}

function ClientEmptyState() {
  return (
    <div className="py-10 sm:py-12 text-center">
      <div
        className="
          w-14
          h-14

          mx-auto

          rounded-2xl

          bg-orange-500/10
          text-orange-600
          dark:text-orange-400

          flex
          items-center
          justify-center

          mb-4
        "
      >
        <UserPlus size={26} />
      </div>

      <h3
        className="
          font-bold
          text-[#080E2F]
          dark:text-white
        "
      >
        Nenhum cliente encontrado
      </h3>

      <p
        className="
          text-sm
          text-gray-500
          dark:text-gray-400

          mt-1
        "
      >
        Nenhum cliente corresponde à
        busca realizada.
      </p>
    </div>
  );
}