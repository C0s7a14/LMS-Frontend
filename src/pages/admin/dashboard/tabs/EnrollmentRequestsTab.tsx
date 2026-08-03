import { useState } from "react";
import { Cpu } from "lucide-react";

import TableCard from "../components/TableCard";

import type { EnrollmentRequestType } from "../types/adminDashboard.types";

export default function EnrollmentRequestsTab({
  requests,
  search,
  updatingRequestId,
  approveRequest,
  rejectRequest,
}: {
  requests: EnrollmentRequestType[];
  search: string;
  updatingRequestId: number | null;
  approveRequest: (requestId: number) => void;
  rejectRequest: (requestId: number) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<
    "pendente" | "aprovada" | "rejeitada"
  >("pendente");

  const searchLower = search.toLowerCase();

  const totalPendentes = requests.filter(
    (request) => request.status === "pendente"
  ).length;

  const totalAprovadas = requests.filter(
    (request) => request.status === "aprovada"
  ).length;

  const totalRejeitadas = requests.filter(
    (request) => request.status === "rejeitada"
  ).length;

 const filteredRequests = requests
  .filter((request) => request.status === statusFilter)
  .filter((request) => {
    if (!searchLower.trim()) {
      return true;
    }

    return (
      request.aluno_nome?.toLowerCase().includes(searchLower) ||
      request.aluno_email?.toLowerCase().includes(searchLower) ||
      request.curso_titulo?.toLowerCase().includes(searchLower) ||
      request.dispositivo_nome?.toLowerCase().includes(searchLower)
    );
  });

  const filterCards = [
    {
      status: "pendente" as const,
      title: "Pendentes",
      total: totalPendentes,
      description: "Aguardando análise",
    },
    {
      status: "aprovada" as const,
      title: "Aprovadas",
      total: totalAprovadas,
      description: "Matrículas liberadas",
    },
    {
      status: "rejeitada" as const,
      title: "Rejeitadas",
      total: totalRejeitadas,
      description: "Solicitações recusadas",
    },
  ];

  const currentTitle =
    statusFilter === "pendente"
      ? "Solicitações pendentes"
      : statusFilter === "aprovada"
      ? "Solicitações aprovadas"
      : "Solicitações rejeitadas";

  const emptyMessage =
    statusFilter === "pendente"
      ? "Nenhuma solicitação pendente encontrada"
      : statusFilter === "aprovada"
      ? "Nenhuma solicitação aprovada encontrada"
      : "Nenhuma solicitação rejeitada encontrada";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {filterCards.map((card) => {
          const active = statusFilter === card.status;

          return (
            <button
              key={card.status}
              type="button"
              onClick={() => setStatusFilter(card.status)}
              className={`
                text-left
                rounded-3xl
                border
                p-6
                transition-all
                shadow-xl
                hover:shadow-2xl
                dark:shadow-sm
                dark:shadow-blue-500
                ${
                  active
                    ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30"
                    : "border-gray-200 dark:border-white/10 bg-white dark:bg-[#091a2c] hover:border-blue-500/60"
                }
              `}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-[#080E2F] dark:text-white">
                  {card.title}
                </h3>

                {active && (
                  <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
                    Filtro ativo
                  </span>
                )}
              </div>

              <p className="text-3xl font-bold text-[#080E2F] dark:text-white mt-6">
                {card.total}
              </p>

              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {card.description}
              </p>
            </button>
          );
        })}
      </div>

      <TableCard
        title={currentTitle}
        className="!shadow-xl hover:!shadow-2xl dark:!shadow-sm dark:!shadow-blue-500"
        contentClassName="!overflow-visible"
      >
        {filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-white/10 p-8 text-center">
            <h3 className="text-lg font-bold text-[#080E2F] dark:text-white">
              {emptyMessage}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Use os cards acima para alternar entre pendentes, aprovadas e
              rejeitadas.
            </p>
          </div>
        ) : (
          <div key={statusFilter} className="space-y-6 py-2">
  {filteredRequests.map((request) => {
              const isUpdating = updatingRequestId === request.id;
              const isPending = request.status === "pendente";

              return (
                <div
                   key={`${statusFilter}-${request.id}`}
                  className="
                    relative
                    rounded-3xl
                    border
                    border-gray-200
                    dark:border-white/10
                    bg-white
                    dark:bg-[#0d2238]
                    p-5
                    shadow-2xl
                    dark:shadow-blue-500
                    dark:shadow-sm
                  "
                >
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {request.dispositivo_imagem_url ? (
                          <img
                            src={request.dispositivo_imagem_url}
                            alt={request.dispositivo_nome || "Dispositivo"}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <Cpu className="text-blue-500" size={30} />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-[#080E2F] dark:text-white">
                            {request.curso_titulo}
                          </h3>

                          <EnrollmentStatusBadge status={request.status} />
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          Aluno:{" "}
                          <strong className="text-[#080E2F] dark:text-white">
                            {request.aluno_nome}
                          </strong>{" "}
                          • {request.aluno_email}
                        </p>

                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          Dispositivo:{" "}
                          {request.dispositivo_nome || "Não informado"}
                        </p>

                        {request.mensagem && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                            Mensagem: “{request.mensagem}”
                          </p>
                        )}

                        {request.motivo_resposta && (
                          <p className="text-red-500 text-sm mt-3">
                            Motivo da rejeição: {request.motivo_resposta}
                          </p>
                        )}

                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-3">
                          Solicitado em: {formatAdminDate(request.criado_em)}
                          {request.respondido_em
                            ? ` • Respondido em: ${formatAdminDate(
                                request.respondido_em
                              )}`
                            : ""}
                        </p>

                        {request.admin_nome && (
                          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                            Respondido por: {request.admin_nome}
                          </p>
                        )}
                      </div>
                    </div>

                    {isPending ? (
                      <div className="flex flex-col sm:flex-row xl:flex-col gap-3 xl:min-w-[180px]">
                        <button
                          type="button"
                          onClick={() => approveRequest(request.id)}
                          disabled={isUpdating}
                          className="rounded-2xl bg-green-500 px-5 py-3 font-semibold text-white hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isUpdating ? "Processando..." : "Aprovar"}
                        </button>

                        <button
                          type="button"
                          onClick={() => rejectRequest(request.id)}
                          disabled={isUpdating}
                          className="rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Rejeitar
                        </button>
                      </div>
                    ) : (
                      <div className="xl:min-w-[180px]">
                        <div className="rounded-2xl bg-gray-100 dark:bg-white/10 px-5 py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                          Solicitação já respondida
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </TableCard>
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
        ${style}
      `}
    >
      {label}
    </span>
  );
}

function formatAdminDate(date?: string | null) {
  if (!date) {
    return "Não informado";
  }

  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}