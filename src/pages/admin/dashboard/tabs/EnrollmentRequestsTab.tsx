import {
  CheckCircle2,
  Clock3,
  Cpu,
  Loader2,
  XCircle,
} from "lucide-react";

import {
  useState,
} from "react";

import TableCard from "../components/TableCard";

import type {
  EnrollmentRequestType,
} from "../types/adminDashboard.types";

type EnrollmentFilter =
  | "pendente"
  | "aprovada"
  | "rejeitada";

interface EnrollmentRequestsTabProps {
  requests: EnrollmentRequestType[];
  search: string;
  updatingRequestId: number | null;
  approveRequest: (
    requestId: number,
  ) => void;
  rejectRequest: (
    requestId: number,
  ) => void;
}

export default function EnrollmentRequestsTab({
  requests,
  search,
  updatingRequestId,
  approveRequest,
  rejectRequest,
}: EnrollmentRequestsTabProps) {
  const [
    statusFilter,
    setStatusFilter,
  ] = useState<EnrollmentFilter>(
    "pendente",
  );

  const searchLower =
    search
      .toLowerCase()
      .trim();

  const totalPendentes =
    requests.filter(
      (request) =>
        request.status === "pendente",
    ).length;

  const totalAprovadas =
    requests.filter(
      (request) =>
        request.status === "aprovada",
    ).length;

  const totalRejeitadas =
    requests.filter(
      (request) =>
        request.status === "rejeitada",
    ).length;

  const filteredRequests =
    requests
      .filter(
        (request) =>
          request.status ===
          statusFilter,
      )
      .filter((request) => {
        if (!searchLower) {
          return true;
        }

        return (
          request.aluno_nome
            ?.toLowerCase()
            .includes(searchLower) ||
          request.aluno_email
            ?.toLowerCase()
            .includes(searchLower) ||
          request.curso_titulo
            ?.toLowerCase()
            .includes(searchLower) ||
          request.dispositivo_nome
            ?.toLowerCase()
            .includes(searchLower)
        );
      });

  const filterCards = [
    {
      status:
        "pendente" as const,
      title: "Pendentes",
      total: totalPendentes,
      description:
        "Aguardando análise",
      icon: Clock3,
    },
    {
      status:
        "aprovada" as const,
      title: "Aprovadas",
      total: totalAprovadas,
      description:
        "Matrículas liberadas",
      icon: CheckCircle2,
    },
    {
      status:
        "rejeitada" as const,
      title: "Rejeitadas",
      total: totalRejeitadas,
      description:
        "Solicitações recusadas",
      icon: XCircle,
    },
  ];

  const currentTitle =
    statusFilter === "pendente"
      ? "Solicitações pendentes"
      : statusFilter ===
          "aprovada"
        ? "Solicitações aprovadas"
        : "Solicitações rejeitadas";

  const emptyMessage =
    statusFilter === "pendente"
      ? "Nenhuma solicitação pendente encontrada"
      : statusFilter ===
          "aprovada"
        ? "Nenhuma solicitação aprovada encontrada"
        : "Nenhuma solicitação rejeitada encontrada";

  return (
    <div
      className="
        w-full
        min-w-0

        space-y-6
        sm:space-y-8
      "
    >
      {/* FILTROS */}
      <div
        className="
          grid
          grid-cols-1

          sm:grid-cols-3

          gap-4
          sm:gap-5
        "
      >
        {filterCards.map(
          (card) => {
            const active =
              statusFilter ===
              card.status;

            const Icon =
              card.icon;

            return (
              <button
                key={card.status}
                type="button"
                onClick={() =>
                  setStatusFilter(
                    card.status,
                  )
                }
                className={`
                  min-w-0

                  text-left

                  rounded-2xl
                  sm:rounded-3xl

                  border

                  p-4
                  sm:p-5
                  lg:p-6

                  transition-all

                  shadow-2xl
                  dark:shadow-sm

                  ${
                    active
                      ? `
                          border-[var(--company-primary)]

                          bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

                          ring-2
                          ring-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]
                        `
                      : `
                          border-gray-200
                          dark:border-white/10

                          bg-white
                          dark:bg-[#091a2c]

                          hover:border-[color-mix(in_srgb,var(--company-primary)_45%,transparent)]
                        `
                  }
                `}
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between

                    gap-3
                  "
                >
                  <div
                    className={`
                      w-10
                      h-10

                      rounded-xl

                      flex
                      items-center
                      justify-center

                      shrink-0

                      ${
                        active
                          ? `
                              bg-[var(--company-primary)]
                              text-white
                            `
                          : `
                              bg-gray-100
                              dark:bg-white/5

                              text-[var(--company-primary)]
                            `
                      }
                    `}
                  >
                    <Icon size={20} />
                  </div>

                  {active && (
                    <span
                      className="
                        rounded-full

                        bg-[var(--company-primary)]

                        px-2.5
                        py-1

                        text-[10px]
                        sm:text-xs

                        font-bold
                        text-white

                        whitespace-nowrap
                      "
                    >
                      Filtro ativo
                    </span>
                  )}
                </div>

                <h3
                  className="
                    mt-5

                    text-base
                    sm:text-lg

                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  {card.title}
                </h3>

                <p
                  className="
                    mt-1

                    text-3xl
                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  {card.total}
                </p>

                <p
                  className="
                    mt-1

                    text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {card.description}
                </p>
              </button>
            );
          },
        )}
      </div>

      {/* SOLICITAÇÕES */}
      <TableCard
        title={currentTitle}
        className="
          !shadow-2xl
          dark:!shadow-sm
        "
      >
        {filteredRequests.length ===
        0 ? (
          <EnrollmentEmptyState
            message={emptyMessage}
          />
        ) : (
          <div
            key={statusFilter}
            className="
              space-y-4
              sm:space-y-5

              py-1
            "
          >
            {filteredRequests.map(
              (request) => {
                const isUpdating =
                  updatingRequestId ===
                  request.id;

                const isPending =
                  request.status ===
                  "pendente";

                return (
                  <article
                    key={`${statusFilter}-${request.id}`}
                    className="
                      w-full
                      min-w-0

                      rounded-2xl
                      sm:rounded-3xl

                      border
                      border-gray-200
                      dark:border-white/10

                      bg-white
                      dark:bg-[#0d2238]

                      p-4
                      sm:p-5

                      shadow-2xl
                      dark:shadow-sm
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col

                        xl:flex-row
                        xl:items-start
                        xl:justify-between

                        gap-5
                      "
                    >
                      {/* CONTEÚDO */}
                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <div
                          className="
                            flex
                            items-start

                            gap-3
                            sm:gap-4
                          "
                        >
                          {/* IMAGEM */}
                          <div
                            className="
                              w-12
                              h-12

                              sm:w-16
                              sm:h-16

                              rounded-2xl

                              bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                              flex
                              items-center
                              justify-center

                              shrink-0

                              overflow-hidden
                            "
                          >
                            {request.dispositivo_imagem_url ? (
                              <img
                                src={
                                  request.dispositivo_imagem_url
                                }
                                alt={
                                  request.dispositivo_nome ||
                                  "Dispositivo"
                                }
                                className="
                                  w-full
                                  h-full

                                  object-contain

                                  p-2
                                "
                              />
                            ) : (
                              <Cpu
                                size={28}
                                className="
                                  text-[var(--company-primary)]
                                "
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div
                              className="
                                flex
                                flex-wrap
                                items-center

                                gap-2
                              "
                            >
                              <h3
                                className="
                                  text-base
                                  sm:text-lg

                                  font-bold

                                  text-[#080E2F]
                                  dark:text-white

                                  leading-snug
                                  break-words
                                "
                              >
                                {
                                  request.curso_titulo
                                }
                              </h3>

                              <EnrollmentStatusBadge
                                status={
                                  request.status
                                }
                              />
                            </div>

                            <p
                              className="
                                mt-2

                                text-sm

                                text-gray-500
                                dark:text-gray-400

                                leading-relaxed
                              "
                            >
                              Aluno:{" "}
                              <strong
                                className="
                                  text-[#080E2F]
                                  dark:text-white
                                "
                              >
                                {
                                  request.aluno_nome
                                }
                              </strong>
                            </p>

                            <p
                              className="
                                mt-1

                                text-sm

                                text-gray-500
                                dark:text-gray-400

                                break-all
                              "
                            >
                              {
                                request.aluno_email
                              }
                            </p>
                          </div>
                        </div>

                        {/* INFORMAÇÕES */}
                        <div
                          className="
                            grid
                            grid-cols-1

                            sm:grid-cols-2

                            gap-3

                            mt-4
                          "
                        >
                          <EnrollmentInfo
                            label="Dispositivo"
                            value={
                              request.dispositivo_nome ||
                              "Não informado"
                            }
                          />

                          <EnrollmentInfo
                            label="Solicitado em"
                            value={formatAdminDate(
                              request.criado_em,
                            )}
                          />
                        </div>

                        {request.mensagem && (
                          <div
                            className="
                              mt-3

                              rounded-xl

                              bg-gray-50
                              dark:bg-white/5

                              p-3
                            "
                          >
                            <p
                              className="
                                text-xs
                                font-semibold

                                text-gray-500
                                dark:text-gray-400
                              "
                            >
                              Mensagem do aluno
                            </p>

                            <p
                              className="
                                mt-1

                                text-sm

                                text-gray-600
                                dark:text-gray-300

                                leading-relaxed
                                break-words
                              "
                            >
                              “
                              {
                                request.mensagem
                              }
                              ”
                            </p>
                          </div>
                        )}

                        {request.motivo_resposta && (
                          <div
                            className="
                              mt-3

                              rounded-xl

                              bg-red-500/10

                              border
                              border-red-500/15

                              p-3
                            "
                          >
                            <p
                              className="
                                text-xs
                                font-semibold

                                text-red-500
                              "
                            >
                              Motivo da rejeição
                            </p>

                            <p
                              className="
                                mt-1

                                text-sm

                                text-red-500

                                leading-relaxed
                                break-words
                              "
                            >
                              {
                                request.motivo_resposta
                              }
                            </p>
                          </div>
                        )}

                        {(request.respondido_em ||
                          request.admin_nome) && (
                          <div
                            className="
                              mt-4

                              flex
                              flex-col

                              sm:flex-row
                              sm:flex-wrap

                              gap-1
                              sm:gap-x-4

                              text-xs

                              text-gray-400
                              dark:text-gray-500
                            "
                          >
                            {request.respondido_em && (
                              <span>
                                Respondido em:{" "}
                                {formatAdminDate(
                                  request.respondido_em,
                                )}
                              </span>
                            )}

                            {request.admin_nome && (
                              <span>
                                Respondido por:{" "}
                                {
                                  request.admin_nome
                                }
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* AÇÕES */}
                      {isPending ? (
                        <div
                          className="
                            grid
                            grid-cols-1

                            sm:grid-cols-2
                            xl:grid-cols-1

                            gap-3

                            w-full
                            xl:w-[180px]

                            shrink-0
                          "
                        >
                          <button
                            type="button"
                            onClick={() =>
                              approveRequest(
                                request.id,
                              )
                            }
                            disabled={
                              isUpdating
                            }
                            className="
                              w-full

                              rounded-2xl

                              bg-green-500

                              px-5
                              py-3

                              font-semibold
                              text-white

                              flex
                              items-center
                              justify-center

                              gap-2

                              hover:bg-green-600

                              transition-all

                              active:scale-[0.98]

                              disabled:opacity-50
                              disabled:cursor-not-allowed
                            "
                          >
                            {isUpdating ? (
                              <>
                                <Loader2
                                  size={17}
                                  className="animate-spin"
                                />

                                Processando...
                              </>
                            ) : (
                              <>
                                <CheckCircle2
                                  size={17}
                                />

                                Aprovar
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              rejectRequest(
                                request.id,
                              )
                            }
                            disabled={
                              isUpdating
                            }
                            className="
                              w-full

                              rounded-2xl

                              bg-red-500

                              px-5
                              py-3

                              font-semibold
                              text-white

                              flex
                              items-center
                              justify-center

                              gap-2

                              hover:bg-red-600

                              transition-all

                              active:scale-[0.98]

                              disabled:opacity-50
                              disabled:cursor-not-allowed
                            "
                          >
                            <XCircle
                              size={17}
                            />

                            Rejeitar
                          </button>
                        </div>
                      ) : (
                        <div
                          className="
                            w-full
                            xl:w-[180px]

                            shrink-0
                          "
                        >
                          <div
                            className="
                              rounded-2xl

                              bg-gray-100
                              dark:bg-white/10

                              px-5
                              py-3

                              text-center
                              text-sm
                              font-semibold

                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Solicitação já respondida
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}
      </TableCard>
    </div>
  );
}

function EnrollmentInfo({
  label,
  value,
}: {
  label: string;
  value: string;
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
          text-xs

          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1

          text-sm
          font-semibold

          text-[#080E2F]
          dark:text-white

          break-words
        "
      >
        {value}
      </p>
    </div>
  );
}

function EnrollmentEmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div
      className="
        rounded-2xl

        border
        border-dashed
        border-gray-200
        dark:border-white/10

        px-4
        py-10

        text-center
      "
    >
      <div
        className="
          w-14
          h-14

          mx-auto
          mb-4

          rounded-2xl

          bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

          text-[var(--company-primary)]

          flex
          items-center
          justify-center
        "
      >
        <Clock3 size={25} />
      </div>

      <h3
        className="
          text-lg
          font-bold

          text-[#080E2F]
          dark:text-white
        "
      >
        {message}
      </h3>

      <p
        className="
          mt-2

          text-sm

          text-gray-500
          dark:text-gray-400
        "
      >
        Use os cards acima para alternar entre pendentes, aprovadas e
        rejeitadas.
      </p>
    </div>
  );
}

function EnrollmentStatusBadge({
  status,
}: {
  status: EnrollmentRequestType["status"];
}) {
  const label =
    status === "pendente"
      ? "Pendente"
      : status === "aprovada"
        ? "Aprovada"
        : status === "rejeitada"
          ? "Rejeitada"
          : "Cancelada";

  const style =
    status === "pendente"
      ? "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
      : status === "aprovada"
        ? "bg-green-500/15 text-green-600 dark:text-green-400"
        : status === "rejeitada"
          ? "bg-red-500/15 text-red-600 dark:text-red-400"
          : "bg-gray-500/15 text-gray-600 dark:text-gray-400";

  return (
    <span
      className={`
        inline-flex
        items-center

        rounded-full

        px-3
        py-1

        text-xs
        font-bold

        whitespace-nowrap

        ${style}
      `}
    >
      {label}
    </span>
  );
}

function formatAdminDate(
  date?: string | null,
) {
  if (!date) {
    return "Não informado";
  }

  return new Date(
    date,
  ).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}