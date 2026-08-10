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
            text-center
            text-gray-500
            dark:text-gray-400
          "
        >
          Carregando usuários ativos...
        </div>
      ) : (
        <>
          {/* DESKTOP */}
          <div className="hidden lg:block w-full">

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
              <span>Última atividade</span>
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

                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        name={
                          user.name
                        }
                      />

                      <div className="min-w-0">
                        <p
                          className="
                            font-semibold
                            text-[#080E2F]
                            dark:text-white
                            truncate
                          "
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


                    <p
                      className="
                        text-sm
                        text-gray-600
                        dark:text-gray-400
                        truncate
                      "
                    >
                      {user.email}
                    </p>


                    <div>
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3
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
              <div
                className="
                  py-12
                  text-center
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Nenhum usuário ativo encontrado.
              </div>
            )}

          </div>


          {/* MOBILE */}
          <div className="lg:hidden space-y-3">

            {filteredUsers.length > 0 ? (
              filteredUsers.map(
                (user) => (
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
                      <Avatar
                        name={
                          user.name
                        }
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            font-bold
                            text-[#080E2F]
                            dark:text-white
                            truncate
                          "
                        >
                          {user.name}
                        </p>

                        <p
                          className="
                            text-sm
                            text-gray-500
                            dark:text-gray-400
                            truncate
                          "
                        >
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

                        <p
                          className="
                            mt-1
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
                ),
              )
            ) : (
              <div
                className="
                  py-10
                  text-center
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Nenhum usuário ativo encontrado.
              </div>
            )}

          </div>
        </>
      )}

    </TableCard>
  );
}