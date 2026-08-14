import {
  useMemo,
} from "react";

import Avatar from "../components/Avatar";
import TableCard from "../components/TableCard";

import type {
  ActiveUserTodayType,
} from "../../../../types/userActivity.types";

interface ActiveUsersTodayViewProps {
  users: ActiveUserTodayType[];
  loading: boolean;
  search: string;
}

function getRoleLabel(
  role: ActiveUserTodayType["role"],
) {
  if (role === "student") {
    return "Aluno";
  }

  if (role === "client") {
    return "Cliente";
  }

  return "Administrador";
}

function getRoleClasses(
  role: ActiveUserTodayType["role"],
) {
  if (role === "student") {
    return `
      bg-green-500/10
      text-green-600
      dark:text-green-400
    `;
  }

  if (role === "client") {
    return `
      bg-orange-500/10
      text-orange-600
      dark:text-orange-400
    `;
  }

  return `
    bg-blue-500/10
    text-blue-600
    dark:text-blue-400
  `;
}

function formatActivity(
  value: string,
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return date.toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

export default function ActiveUsersTodayView({
  users,
  loading,
  search,
}: ActiveUsersTodayViewProps) {
  const filteredUsers =
    useMemo(() => {
      const term =
        search
          .toLowerCase()
          .trim();

      if (!term) {
        return users;
      }

      return users.filter(
        (user) => {
          return (
            user.name
              ?.toLowerCase()
              .includes(term) ||
            user.email
              ?.toLowerCase()
              .includes(term) ||
            getRoleLabel(
              user.role,
            )
              .toLowerCase()
              .includes(term)
          );
        },
      );
    }, [users, search]);

  return (
    <TableCard title="Usuários Ativos Hoje">
      {loading ? (
        <div
          className="
            py-12

            flex
            flex-col
            items-center
            justify-center

            text-center

            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          <div
            className="
              w-8
              h-8

              mb-3

              rounded-full

              border-2
              border-gray-200
              dark:border-white/10

              border-t-[var(--company-primary)]

              animate-spin
            "
          />

          Carregando usuários ativos...
        </div>
      ) : (
        <>
          {/* DESKTOP */}
          <div
            className="
              hidden
              xl:block

              w-full
              min-w-[760px]
            "
          >
            <div
              className="
                grid
                grid-cols-[1.4fr_1.5fr_0.8fr_0.8fr]

                gap-4

                pb-3

                border-b
                border-gray-200
                dark:border-white/10

                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              <span>Usuário</span>
              <span>Email</span>
              <span>Perfil</span>
              <span>
                Última atividade
              </span>
            </div>

            {filteredUsers.length > 0 ? (
              filteredUsers.map(
                (user) => (
                  <div
                    key={user.id}
                    className="
                      grid
                      grid-cols-[1.4fr_1.5fr_0.8fr_0.8fr]

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
                        <p
                          className="
                            font-semibold

                            text-[#080E2F]
                            dark:text-white

                            truncate
                          "
                          title={user.name}
                        >
                          {user.name}
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          ID: {user.id}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <p
                      className="
                        min-w-0

                        text-sm
                        text-gray-600
                        dark:text-gray-400

                        truncate
                      "
                      title={user.email}
                    >
                      {user.email}
                    </p>

                    {/* Perfil */}
                    <div>
                      <span
                        className={`
                          inline-flex

                          rounded-full

                          px-3
                          py-1

                          text-xs
                          font-semibold

                          whitespace-nowrap

                          ${getRoleClasses(
                            user.role,
                          )}
                        `}
                      >
                        {getRoleLabel(
                          user.role,
                        )}
                      </span>
                    </div>

                    {/* Última atividade */}
                    <div>
                      <p
                        className="
                          font-semibold

                          text-[#080E2F]
                          dark:text-white
                        "
                      >
                        {formatActivity(
                          user.last_activity_at,
                        )}
                      </p>

                      <p
                        className="
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Hoje
                      </p>
                    </div>
                  </div>
                ),
              )
            ) : (
              <EmptyState />
            )}
          </div>

          {/* MOBILE / TABLET */}
          <div
            className="
              xl:hidden

              space-y-3
            "
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map(
                (user) => (
                  <div
                    key={user.id}
                    className="
                      w-full
                      min-w-0

                      rounded-2xl

                      border
                      border-gray-200
                      dark:border-white/10

                      p-4

                      shadow-lg
                      dark:shadow-none
                    "
                  >
                    {/* Identificação */}
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

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <p
                          className="
                            font-bold

                            text-[#080E2F]
                            dark:text-white

                            leading-snug
                            break-words
                          "
                        >
                          {user.name}
                        </p>

                        <p
                          className="
                            mt-0.5

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

                    {/* Informações */}
                    <div
                      className="
                        grid
                        grid-cols-1

                        xs:grid-cols-2
                        sm:grid-cols-2

                        gap-3

                        mt-4
                      "
                    >
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
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Perfil
                        </p>

                        <span
                          className={`
                            inline-flex

                            mt-2

                            rounded-full

                            px-2.5
                            py-1

                            text-xs
                            font-semibold

                            ${getRoleClasses(
                              user.role,
                            )}
                          `}
                        >
                          {getRoleLabel(
                            user.role,
                          )}
                        </span>
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
                          Última atividade
                        </p>

                        <div
                          className="
                            mt-2

                            flex
                            items-center
                            gap-2
                          "
                        >
                          <span
                            className="
                              w-2
                              h-2

                              rounded-full

                              bg-green-500

                              shrink-0
                            "
                          />

                          <p
                            className="
                              font-bold

                              text-[#080E2F]
                              dark:text-white
                            "
                          >
                            {formatActivity(
                              user.last_activity_at,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )
            ) : (
              <EmptyState />
            )}
          </div>
        </>
      )}
    </TableCard>
  );
}

function EmptyState() {
  return (
    <div
      className="
        py-10
        sm:py-12

        text-center

        text-sm
        text-gray-500
        dark:text-gray-400
      "
    >
      Nenhum usuário ativo encontrado.
    </div>
  );
}