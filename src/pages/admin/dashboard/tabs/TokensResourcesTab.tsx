import { useState } from "react";

import {
  Activity,
  BarChart3,
  Bot,
  BookOpen,
  Clock3,
  Coins,
  Database,
  DollarSign,
  KeyRound,
  Mail,
  Music,
  RefreshCw,
  Server,
  Volume2,
} from "lucide-react";

import useAdminResources from "../hooks/useAdminResources";
import { useAiTokenAnalytics } from "../hooks/useAiTokenAnalytics";
import { useAiCostAnalytics } from "../hooks/useAiCostAnalytics";
import { useAiAudioAnalytics } from "../hooks/useAiAudioAnalytics";
import { useAiCourseGenerationAnalytics } from "../hooks/useAiCourseGenerationAnalytics";

import type {
  AdminResourceType,
  ResourceStatus,
} from "../../../../types/adminResource.types";


type ResourceSubTab =
  | "tokens"
  | "costs"
  | "audios"
  | "courses";


const SUB_TABS = [
  {
    id: "tokens" as const,
    label: "Tokens Utilizados",
    description: "Consumo dos modelos de IA",
    icon: Coins,
    iconClasses:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 ",
  },
  {
    id: "costs" as const,
    label: "Custo Estimado",
    description: "Gastos com serviços de IA",
    icon: DollarSign,
    iconClasses:
      "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  {
    id: "audios" as const,
    label: "Áudios Gerados",
    description: "Gerações realizadas por TTS",
    icon: Music,
    iconClasses:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    id: "courses" as const,
    label: "Cursos Gerados",
    description: "Conteúdo criado com IA",
    icon: BookOpen,
    iconClasses:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat(
    "pt-BR"
  ).format(value);
}

function formatUsd(value: number) {
  if (!value) {
    return "US$ 0,00";
  }

  if (value < 0.01) {
    return `US$ ${value.toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits: 6,
        maximumFractionDigits: 8,
      }
    )}`;
  }

  return value.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }
  );
}


function getOperationLabel(
  operation: string
) {
  switch (operation) {
    case "course_generation":
      return "Geração de curso";

    case "quiz_generation":
      return "Quizzes e provas";

    case "technical_agent":
      return "Agente técnico";

    case "tts":
      return "Geração de áudio";

    default:
      return operation;
  }
}

function formatDuration(ms: number) {
  if (!ms) {
    return "0s";
  }

  if (ms < 1000) {
    return `${ms}ms`;
  }

  return `${(ms / 1000).toFixed(1)}s`;
}

function formatAudioDuration(
  seconds: number
) {
  if (!seconds) {
    return "0s";
  }

  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(
    seconds / 60
  );

  const remainingSeconds =
    Math.round(seconds % 60);

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${remainingSeconds}s`;
}


function formatPercentage(
  value: number
) {
  return `${value.toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }
  )}%`;
}


function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      timeZone: "UTC",
    }
  );
}


function formatDateTime(
  date: string | null
) {
  if (!date) {
    return "Nunca utilizada";
  }

  return new Date(date).toLocaleString(
    "pt-BR",
    {
      dateStyle: "short",
      timeStyle: "short",
    }
  );
}


function getCredentialStatusLabel(
  status: string
) {
  switch (status) {
    case "ativa":
      return "Ativa";

    case "standby":
      return "Standby";

    case "cooldown":
      return "Cooldown";

    case "desativada":
      return "Desativada";

    case "erro":
      return "Erro";

    default:
      return status;
  }
}


function getCredentialStatusClasses(
  status: string
) {
  if (status === "ativa") {
    return `
      bg-green-500/10
      text-green-600
      dark:text-green-400
    `;
  }

  if (status === "standby") {
    return `
      bg-blue-500/10
      text-blue-600
      dark:text-blue-400
    `;
  }

  if (status === "cooldown") {
    return `
      bg-orange-500/10
      text-orange-600
      dark:text-orange-400
    `;
  }

  return `
    bg-red-500/10
    text-red-600
    dark:text-red-400
  `;
}


function getResourceIcon(
  resourceId: string
) {
  switch (resourceId) {
    case "mysql":
      return Database;

    case "resend":
      return Mail;

    case "ai-service":
      return Server;

    case "perplexity":
      return Bot;

    case "gemini":
      return Bot;

    case "gemini-tts":
      return Volume2;

    default:
      return Server;
  }
}


function getStatusLabel(
  status: ResourceStatus
) {
  switch (status) {
    case "online":
      return "Online";

    case "configured":
      return "Configurado";

    case "not_configured":
      return "Não configurado";

    case "offline":
      return "Offline";

    case "error":
      return "Erro";

    default:
      return status;
  }
}


function getStatusClasses(
  status: ResourceStatus
) {
  if (
    status === "online" ||
    status === "configured"
  ) {
    return `
      bg-green-500/10
      text-green-600
      dark:text-green-400
    `;
  }

  if (status === "offline") {
    return `
      bg-orange-500/10
      text-orange-600
      dark:text-orange-400
    `;
  }

  return `
    bg-red-500/10
    text-red-600
    dark:text-red-400
  `;
}


function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: typeof Coins;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-300
        bg-white
        p-5
        dark:border-white/10
        dark:bg-[#11172D]
        shadow-2xl
        dark:shadow-blue-300
        dark:shadow-sm
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-sm
              font-medium
              text-gray-500
              dark:text-gray-400
            "
          >
            {title}
          </p>

          <p
            className="
              mt-2
              truncate
              text-2xl
              font-bold
              text-[#080E2F]
              dark:text-white
            "
          >
            {value}
          </p>

          {subtitle && (
            <p
              className="
                mt-2
                truncate
                text-xs
                text-gray-400
                dark:text-gray-500
              "
            >
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-blue-500/10
            text-blue-600
            dark:text-blue-400
          "
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}


function ResourceCard({
  resource,
}: {
  resource: AdminResourceType;
}) {
  const Icon = getResourceIcon(
    resource.id
  );

  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-300
        bg-white
        p-5
        shadow-2xl
        dark:shadow-blue-300
        dark:shadow-sm
        dark:border-white/10
        dark:bg-[#11172D]
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-blue-500/10
              text-blue-600
              dark:text-blue-400
            "
          >
            <Icon size={21} />
          </div>

          <div className="min-w-0">
            <h3
              className="
                font-bold
                text-[#080E2F]
                dark:text-white
              "
            >
              {resource.name}
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              {resource.description}
            </p>
          </div>
        </div>

        <span
          className={`
            shrink-0
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold
            ${getStatusClasses(
              resource.status
            )}
          `}
        >
          {getStatusLabel(
            resource.status
          )}
        </span>
      </div>

      {resource.details && (
        <div
          className="
            mt-5
            grid
            gap-3
            sm:grid-cols-2
          "
        >
          {resource.details.model && (
            <div
              className="
                rounded-xl
                bg-gray-50
                p-3
                dark:bg-white/5
              "
            >
              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Modelo
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-sm
                  font-semibold
                  text-[#080E2F]
                  dark:text-white
                "
              >
                {resource.details.model}
              </p>
            </div>
          )}

          {resource.details.voice && (
            <div
              className="
                rounded-xl
                bg-gray-50
                p-3
                dark:bg-white/5
              "
            >
              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Voz TTS
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-semibold
                  text-[#080E2F]
                  dark:text-white
                "
              >
                {resource.details.voice}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



export default function TokensResourcesTab() {
  const [activeTab, setActiveTab] =
    useState<ResourceSubTab>("tokens");

  const {
    resources,
    loading: resourcesLoading,
    error: resourcesError,
    loadResources,
  } = useAdminResources();

  const {
    data,
    days,
    setDays,
    loading: analyticsLoading,
    error: analyticsError,
    loadAnalytics,
  } = useAiTokenAnalytics(30);

  const {
    data: costData,
    setDays: setCostDays,
    loading: costLoading,
    error: costError,
    loadAnalytics: loadCostAnalytics,
  } = useAiCostAnalytics(30);


  const {
    data: audioData,
    setDays: setAudioDays,
    loading: audioLoading,
    error: audioError,
    loadAnalytics: loadAudioAnalytics,
  } = useAiAudioAnalytics(30);


  const {
  data: courseData,
  setDays: setCourseDays,
  loading: courseLoading,
  error: courseError,
  loadAnalytics: loadCourseAnalytics,
} = useAiCourseGenerationAnalytics(30);

 const handleRefresh = async () => {
  await Promise.all([
    loadResources(),
    loadAnalytics(),
    loadCostAnalytics(),
    loadAudioAnalytics(),
    loadCourseAnalytics(),
  ]);
};


  const maxTimelineTokens =
    data?.timeline.length
      ? Math.max(
          ...data.timeline.map(
            (item) =>
              item.totalTokens
          ),
          1
        )
      : 1;


  return (
    <section className="space-y-6">

     {/* CARDS DE NAVEGAÇÃO */}
<div
  className="
    grid
    grid-cols-1
    gap-4
    sm:grid-cols-2
    xl:grid-cols-4
    
  "
>
  {SUB_TABS.map((tab) => {
    const Icon = tab.icon;

    const active =
      activeTab === tab.id;

    return (
      <button
        key={tab.id}
        type="button"
        onClick={() =>
          setActiveTab(tab.id)
        }
        className={`
          group
          relative
          flex
          min-h-[170px]
          flex-col
          items-center
          justify-center
          rounded-3xl
          border
          border-gray-300
          bg-white
          px-5
          py-6
          text-center
          shadow-2xl
          dark:shadow-none
          transition-all
          duration-200
          dark:bg-[#11172D]

          ${
            active
              ? `
                border-blue-500
                shadow-md
                ring-1
                ring-blue-500/20
                dark:border-blue-500
              `
              : `
                border-gray-200
                hover:-translate-y-0.5
                hover:border-blue-300
                hover:shadow-md
                dark:border-white/10
                dark:hover:border-blue-500/40
              `
          }
        `}
      >
        <div
          className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            transition-transform
            duration-200
            group-hover:scale-105
            ${tab.iconClasses}
          `}
        >
          <Icon size={23} />
        </div>

        <h3
          className="
            mt-4
            text-base
            font-semibold
            text-[#080E2F]
            dark:text-white
          "
        >
          {tab.label}
        </h3>

        <p
          className="
            mt-2
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          {tab.description}
        </p>

      </button>
    );
  })}
</div>


      {/* CONTROLES */}
      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-end
        "
      >
        <select
          value={days}
         onChange={(event) => {
          const selectedDays =
            Number(event.target.value);

          setDays(selectedDays);
          setCostDays(selectedDays);
          setAudioDays(selectedDays);
          setCourseDays(selectedDays);
        }}
                  className="
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-semibold
          text-[#080E2F]
            shadow-xl
          dark:shadow-blue-300
            dark:shadow-sm
            outline-none
            dark:border-white/10
            dark:bg-[#11172D]
            dark:text-white
            cursor-pointer
          "
        >
          <option value={7}>
            Últimos 7 dias
          </option>

          <option value={30}>
            Últimos 30 dias
          </option>

          <option value={90}>
            Últimos 90 dias
          </option>

          <option value={365}>
            Últimos 365 dias
          </option>
        </select>

        <button
          type="button"
          onClick={() =>
            void handleRefresh()
          }
          disabled={
            resourcesLoading ||
            analyticsLoading ||
            costLoading      ||
            audioLoading     ||
            courseLoading
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-2.5
            text-sm
            shadow-xl
          dark:shadow-blue-300
            dark:shadow-sm
            font-semibold
            text-[#080E2F]
            disabled:opacity-50
            dark:border-white/10
            dark:bg-[#11172D]
            dark:text-white
            cursor-pointer
          "
        >
          <RefreshCw
            size={16}
                    className={
          resourcesLoading ||
          analyticsLoading ||
          costLoading      ||
          audioLoading
            ? "animate-spin"
            : ""
        }
        />

          Atualizar
        </button>
      </div>


      {/* TOKENS */}
      {activeTab === "tokens" && (
        <>
          {analyticsLoading &&
          !data ? (
            <div
              className="
                py-16
                text-center
                text-gray-500
                dark:text-gray-400
              "
            >
              Carregando dados de tokens...
            </div>
          ) : analyticsError &&
            !data ? (
            <div
              className="
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-5
                text-sm
                text-red-600
                dark:border-red-500/20
                dark:bg-red-500/10
                dark:text-red-400
              "
            >
              {analyticsError}
            </div>
          ) : data ? (
            <>
              {/* RESUMO */}
              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  xl:grid-cols-4
                "
              >
                <SummaryCard
                  title="Tokens consumidos"
                  value={formatNumber(
                    data.summary.totalTokens
                  )}
                  subtitle={`${formatNumber(
                    data.summary.inputTokens
                  )} entrada · ${formatNumber(
                    data.summary.outputTokens
                  )} saída`}
                  icon={Coins}
                />

                <SummaryCard
                  title="Média diária"
                  value={formatNumber(
                    data.summary.dailyAverage
                  )}
                  subtitle={`Últimos ${data.periodDays} dias`}
                  icon={BarChart3}
                />

                <SummaryCard
                  title="Total de chamadas"
                  value={formatNumber(
                    data.summary.totalCalls
                  )}
                  subtitle={`Tempo médio ${formatDuration(
                    data.summary
                      .averageDurationMs
                  )}`}
                  icon={Activity}
                />

                <SummaryCard
                  title="Modelo mais utilizado"
                  value={
                    data.summary.topModel ||
                    "Sem dados"
                  }
                  subtitle="Baseado no consumo de tokens"
                  icon={Bot}
                />
              </div>


              {/* TIMELINE */}
              <div
                className="
                  rounded-2xl
                  border
                  border-gray-300
                  bg-white
                  p-5
                  shadow-2xl
                dark:shadow-blue-300
                  dark:shadow-sm
                  dark:border-white/10
                  dark:bg-[#11172D]
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-1
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div>
                    <h3
                      className="
                        font-bold
                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      Uso de tokens ao longo do tempo
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Consumo total registrado por dia.
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    <Clock3 size={14} />

                    {data.timeline.length}
                    {" "}
                    dia(s) com utilização
                  </div>
                </div>


                {data.timeline.length === 0 ? (
                  <div
                    className="
                      py-16
                      text-center
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Nenhum consumo registrado
                    neste período.
                  </div>
                ) : (
                  <div
                    className="
                      mt-8
                      flex
                      h-64
                      items-end
                      gap-3
                      overflow-x-auto
                      border-b
                      border-gray-300
                      px-2
                      dark:border-white/10
                    "
                  >
                    {data.timeline.map(
                      (item) => {
                        const height =
                          Math.max(
                            (
                              item.totalTokens /
                              maxTimelineTokens
                            ) *
                              100,
                            8
                          );

                        return (
                          <div
                            key={item.date}
                           className="
                              flex
                              h-full
                              w-20
                              shrink-0
                              flex-col
                              items-center
                              justify-end
                              gap-2
                            "
                          >
                            <span
                              className="
                                text-xs
                                font-semibold
                                text-[#080E2F]
                                dark:text-white
                              "
                            >
                              {formatNumber(
                                item.totalTokens
                              )}
                            </span>

                            <div
                              className="
                                flex
                                h-[180px]
                                w-full
                                items-end
                              "
                            >
                              <div
                                style={{
                                  height: `${height}%`,
                                }}
                                className="
                                  w-full
                                  rounded-t-lg
                                  bg-blue-500
                                "
                              />
                            </div>

                            <span
                              className="
                                pb-2
                                text-[11px]
                                text-gray-400
                              "
                            >
                              {formatDate(
                                item.date
                              )}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>


              {/* MODELOS */}
              <div
                className="
                  rounded-2xl
                  border
                  border-gray-300
                  bg-white
                  p-5
                  shadow-2xl
                dark:shadow-blue-300
                  dark:shadow-sm
                  dark:border-white/10
                  dark:bg-[#11172D]
                "
              >
                <h3
                  className="
                    font-bold
                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Consumo por modelo
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Distribuição de uso dos modelos
                  de IA no período.
                </p>

                <div className="mt-5 space-y-3">
                  {data.byModel.map(
                    (model) => (
                      <div
                        key={model.model}
                        className="
                          rounded-xl
                          bg-gray-50
                          p-4
                          dark:bg-white/5
                        "
                      >
                        <div
                          className="
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                        >
                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                font-semibold
                                text-[#080E2F]
                                dark:text-white
                              "
                            >
                              {model.model}
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-gray-500
                                dark:text-gray-400
                              "
                            >
                              {formatNumber(
                                model.totalCalls
                              )}
                              {" "}
                              chamada(s)
                            </p>
                          </div>

                          <div
                            className="
                              text-left
                              sm:text-right
                            "
                          >
                            <p
                              className="
                                font-bold
                                text-[#080E2F]
                                dark:text-white
                              "
                            >
                              {formatNumber(
                                model.totalTokens
                              )}
                              {" "}
                              tokens
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-gray-500
                                dark:text-gray-400
                              "
                            >
                              {formatNumber(
                                model.inputTokens
                              )}
                              {" "}
                              entrada ·{" "}
                              {formatNumber(
                                model.outputTokens
                              )}
                              {" "}
                              saída
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>


              {/* CREDENCIAIS */}
              <div
                className="
                  rounded-2xl
                  border
                  border-gray-300
                  bg-white
                  p-5
                  shadow-2xl
                dark:shadow-blue-300
                  dark:shadow-sm
                dark:border-white/10
                dark:bg-[#11172D]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-500/10
                      text-blue-600
                      dark:text-blue-400
                    "
                  >
                    <KeyRound size={19} />
                  </div>

                  <div>
                    <h3
                      className="
                        font-bold
                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      Credenciais de IA
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Providers e credenciais configuradas,
                      sem exposição das chaves.
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-5
                    grid
                    grid-cols-1
                    gap-4
                    lg:grid-cols-3
                  "
                >
                  {data.credentials.map(
                    (credential) => (
                      <div
                        key={credential.id}
                        className="
                          rounded-2xl
                          border
                          border-gray-300
                          p-4
                          shadow-2xl
                        dark:shadow-blue-300
                          dark:shadow-sm
                          dark:border-white/10
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
                          <div>
                            <p
                              className="
                                font-bold
                                text-[#080E2F]
                                dark:text-white
                              "
                            >
                              {credential.name}
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-gray-500
                                dark:text-gray-400
                              "
                            >
                              Prioridade{" "}
                              {credential.priority}
                            </p>
                          </div>

                          <span
                            className={`
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getCredentialStatusClasses(
                                credential.status
                              )}
                            `}
                          >
                            {getCredentialStatusLabel(
                              credential.status
                            )}
                          </span>
                        </div>

                        <div
                          className="
                            mt-5
                            grid
                            grid-cols-2
                            gap-3
                          "
                        >
                          <div
                            className="
                              rounded-xl
                              bg-gray-50
                              p-3
                              dark:bg-white/5
                            "
                          >
                            <p
                              className="
                                text-xs
                                text-gray-500
                                dark:text-gray-400
                              "
                            >
                              Tokens
                            </p>

                            <p
                              className="
                                mt-1
                                font-bold
                                text-[#080E2F]
                                dark:text-white
                              "
                            >
                              {formatNumber(
                                credential.totalTokens
                              )}
                            </p>
                          </div>

                          <div
                            className="
                              rounded-xl
                              bg-gray-50
                              p-3
                              dark:bg-white/5
                            "
                          >
                            <p
                              className="
                                text-xs
                                text-gray-500
                                dark:text-gray-400
                              "
                            >
                              Chamadas
                            </p>

                            <p
                              className="
                                mt-1
                                font-bold
                                text-[#080E2F]
                                dark:text-white
                              "
                            >
                              {formatNumber(
                                credential.totalCalls
                              )}
                            </p>
                          </div>
                        </div>

                        <p
                          className="
                            mt-4
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Último uso:{" "}
                          {formatDateTime(
                            credential.lastUsedAt
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          ) : null}


          {/* RECURSOS */}
          <div
            className="
              rounded-2xl
              border
              border-gray-300
              bg-gray-50/50
              p-5
              shadow-2xl
            dark:shadow-blue-300
              dark:shadow-sm
            dark:border-white/10
            dark:bg-white/[0.02]
            "
          >
            <div className="mb-5">
              <h3
                className="
                  font-bold
                  text-[#080E2F]
                  dark:text-white
                "
              >
                Serviços e recursos
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Estado atual dos serviços
                utilizados pela plataforma.
              </p>
            </div>

            {resourcesLoading &&
            resources.length === 0 ? (
              <div
                className="
                  py-12
                  text-center
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Carregando recursos...
              </div>
            ) : resourcesError &&
              resources.length === 0 ? (
              <div
                className="
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-5
                  text-sm
                  text-red-600
                  dark:border-red-500/20
                  dark:bg-red-500/10
                  dark:text-red-400
                "
              >
                {resourcesError}
              </div>
            ) : (
              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  xl:grid-cols-2
                "
              >
                {resources.map(
                  (resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </>
      )}

     {activeTab === "costs" && (
        <>
          {costLoading && !costData ? (
      <div
        className="
          py-16
          text-center
          text-gray-500
          dark:text-gray-400
        "
      >
        Carregando dados de custo...
      </div>
    ) : costError && !costData ? (
      <div
        className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-5
          text-sm
          text-red-600
          dark:border-red-500/20
          dark:bg-red-500/10
          dark:text-red-400
        "
      >
        {costError}
      </div>
    ) : costData ? (
      <>
        {/* CARDS DE RESUMO */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <SummaryCard
            title="Custo no período"
            value={formatUsd(
              costData.summary.totalCostUsd
            )}
            subtitle={`Últimos ${costData.periodDays} dias`}
            icon={DollarSign}
          />

          <SummaryCard
            title="Média diária"
            value={formatUsd(
              costData.summary.dailyAverageUsd
            )}
            subtitle="Média considerando o período"
            icon={BarChart3}
          />

          <SummaryCard
            title="Projeção para 30 dias"
            value={formatUsd(
              costData.summary.projected30DaysUsd
            )}
            subtitle="Com base no consumo atual"
            icon={Activity}
          />

          <SummaryCard
            title="Maior centro de custo"
            value={
              costData.summary.topCostModel ||
              "Sem dados"
            }
            subtitle="Modelo com maior custo acumulado"
            icon={Bot}
          />
        </div>


        {/* AVISO DE CHAMADAS SEM PREÇO */}
        {costData.summary.unpricedCalls > 0 && (
          <div
            className="
              rounded-2xl
              border
              border-orange-200
              bg-orange-50
              px-5
              py-4
              shadow-2xl
            dark:shadow-red-300
              dark:shadow-sm
              text-sm
            text-orange-700
            dark:border-orange-500/20
            dark:bg-orange-500/10
            dark:text-orange-300
            "
          >
            {formatNumber(
              costData.summary.unpricedCalls
            )}{" "}
            chamada(s) deste período não possuem
            custo calculado porque foram registradas
            antes da configuração de preços.
          </div>
        )}


        {/* CUSTO AO LONGO DO TEMPO */}
        <div
          className="
            rounded-2xl
            border
            border-gray-300
            bg-white
            p-5
            shadow-2xl
          dark:shadow-blue-300
            dark:shadow-sm
          dark:border-white/10
          dark:bg-[#11172D]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-1
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h3
                className="
                  font-bold
                  text-[#080E2F]
                  dark:text-white
                "
              >
                Custo estimado ao longo do tempo
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Custo das chamadas de IA
                registradas por dia.
              </p>
            </div>

            <span
              className="
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              {costData.timeline.length} dia(s)
              com custo registrado
            </span>
          </div>

          {costData.timeline.length === 0 ? (
            <div
              className="
                py-16
                text-center
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Nenhum custo registrado neste
              período.
            </div>
          ) : (
            <div
              className="
                mt-8
                flex
                h-64
                items-end
                gap-5
                overflow-x-auto
                border-b
                border-gray-300
                px-2
                dark:border-white/10
              "
            >
              {costData.timeline.map(
                (item) => {
                  const maxCost = Math.max(
                    ...costData.timeline.map(
                      (timelineItem) =>
                        timelineItem.totalCostUsd
                    ),
                    0.000001
                  );

                  const height =
                    Math.max(
                      (
                        item.totalCostUsd /
                        maxCost
                      ) * 100,
                      8
                    );

                  return (
                    <div
                      key={item.date}
                      className="
                        flex
                        h-full
                        w-20
                        shrink-0
                        flex-col
                        items-center
                        justify-end
                        gap-2
                      "
                    >
                      <span
                        className="
                          whitespace-nowrap
                          text-[11px]
                          font-semibold
                          text-[#080E2F]
                          dark:text-white
                        "
                      >
                        {formatUsd(
                          item.totalCostUsd
                        )}
                      </span>

                      <div
                        className="
                          flex
                          h-[180px]
                          w-full
                          items-end
                        "
                      >
                        <div
                          style={{
                            height: `${height}%`,
                          }}
                          className="
                            w-full
                            rounded-t-lg
                            bg-green-500
                          "
                        />
                      </div>

                      <span
                        className="
                          pb-2
                          text-[11px]
                          text-gray-400
                        "
                      >
                        {formatDate(
                          item.date
                        )}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>


        {/* CUSTO POR MODELO */}
        <div
          className="
            rounded-2xl
            border
            border-gray-300
            bg-white
            p-5
            shadow-2xl
          dark:shadow-blue-300
            dark:shadow-sm
          dark:border-white/10
          dark:bg-[#11172D]
          "
        >
          <h3
            className="
              font-bold
              text-[#080E2F]
              dark:text-white
            "
          >
            Custo por modelo
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Distribuição do custo entre os
            modelos utilizados pela plataforma.
          </p>

          <div className="mt-5 space-y-3">
            {costData.byModel.length === 0 ? (
              <p
                className="
                  py-8
                  text-center
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Nenhum modelo com custo
                registrado.
              </p>
            ) : (
              costData.byModel.map(
                (model) => {
                  const percentage =
                    costData.summary.totalCostUsd > 0
                      ? (
                          model.totalCostUsd /
                          costData.summary
                            .totalCostUsd
                        ) * 100
                      : 0;

                  return (
                    <div
                      key={`${model.provider}-${model.model}`}
                      className="
                        rounded-xl
                        bg-gray-50
                        p-4
                        dark:bg-white/5
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
                        <div className="min-w-0">
                          <p
                            className="
                              truncate
                              font-semibold
                              text-[#080E2F]
                              dark:text-white
                            "
                          >
                            {model.model}
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              capitalize
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            {model.provider}
                          </p>
                        </div>

                        <div
                          className="
                            min-w-[180px]
                            md:text-right
                          "
                        >
                          <p
                            className="
                              font-bold
                              text-[#080E2F]
                              dark:text-white
                            "
                          >
                            {formatUsd(
                              model.totalCostUsd
                            )}
                          </p>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            {percentage.toFixed(1)}%
                            {" · "}
                            {formatNumber(
                              model.totalTokens
                            )}{" "}
                            tokens
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                          mt-4
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
                              percentage,
                              100
                            )}%`,
                          }}
                          className="
                            h-full
                            rounded-full
                            bg-blue-500
                          "
                        />
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>


        {/* CUSTO POR OPERAÇÃO */}
        <div
          className="
            rounded-2xl
            border
            border-gray-300
            bg-white
            p-5
            shadow-2xl
            dark:shadow-blue-300
            dark:shadow-sm
            dark:border-white/10
            dark:bg-[#11172D]
          "
        >
          <h3
            className="
              font-bold
              text-[#080E2F]
              dark:text-white
            "
          >
            Custo por operação
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Veja quais funcionalidades estão
            consumindo mais recursos de IA.
          </p>

          <div
            className="
              mt-5
              grid
              grid-cols-1
              gap-4
              lg:grid-cols-2
            "
          >
            {costData.byOperation.map(
              (operation) => (
                <div
                  key={operation.operation}
                  className="
                    rounded-2xl
                    border
                    border-gray-300
                    p-4
                    shadow-xl
                  dark:shadow-blue-300
                    dark:shadow-sm
                  dark:border-white/10
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >
                    <div>
                      <p
                        className="
                          font-semibold
                          text-[#080E2F]
                          dark:text-white
                        "
                      >
                        {getOperationLabel(
                          operation.operation
                        )}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        {formatNumber(
                          operation.totalCalls
                        )}{" "}
                        chamada(s)
                      </p>
                    </div>

                    <p
                      className="
                        font-bold
                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      {formatUsd(
                        operation.totalCostUsd
                      )}
                    </p>
                  </div>

                  <div
                  className="
                    mt-4
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-3
                  "
                >
                  <div
                   className="
                    rounded-xl
                    border
                    border-gray-300
                    bg-gray-50
                    p-3
                    dark:border-white/10
                    dark:bg-white/5
                  "
                  >
                    <p
                      className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Chamadas
                    </p>

                    <p
                      className="
                        mt-1
                        font-bold
                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      {formatNumber(
                        operation.totalCalls
                      )}
                    </p>
                  </div>

                  <div
                   className="
                    rounded-xl
                    border
                    border-gray-300
                    bg-gray-50
                    p-3
                    dark:border-white/10
                    dark:bg-white/5
                  "
                  >
                    <p
                      className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Tokens
                    </p>

                    <p
                      className="
                        mt-1
                        font-bold
                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      {formatNumber(
                        operation.totalTokens
                      )}
                    </p>
                  </div>

                  <div
                    className="
                    rounded-xl
                    border
                    border-gray-300
                    bg-gray-50
                    p-3
                    dark:border-white/10
                    dark:bg-white/5
                  "
                  >
                    <p
                      className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Média/chamada
                    </p>

                    <p
                      className="
                        mt-1
                        font-bold
                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      {formatUsd(
                        operation.totalCalls > 0
                          ? operation.totalCostUsd /
                              operation.totalCalls
                          : 0
                      )}
                    </p>
                  </div>
                </div>
                </div>
              )
            )}
          </div>
        </div>
      </>
     ) : null}
        </>
      )}

      {activeTab === "audios" && (
  <>
    {audioLoading && !audioData ? (
      <div
        className="
          py-16
          text-center
          text-gray-500
          dark:text-gray-400
        "
      >
        Carregando dados de áudio...
      </div>
    ) : audioError && !audioData ? (
      <div
        className="
          rounded-2xl
          border
          border-red-300
          bg-red-50
          p-5
          text-sm
          text-red-600
          dark:border-red-500/20
          dark:bg-red-500/10
          dark:text-red-400
        "
      >
        {audioError}
      </div>
    ) : audioData ? (
      <>
        {/* RESUMO */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <SummaryCard
            title="Áudios gerados"
            value={formatNumber(
              audioData.summary
                .successfulGenerations
            )}
            subtitle={`${formatNumber(
              audioData.summary.totalAttempts
            )} tentativa(s) no período`}
            icon={Music}
          />

          <SummaryCard
            title="Duração processada"
            value={formatAudioDuration(
              audioData.summary
                .totalAudioSeconds
            )}
            subtitle={`${audioData.summary
              .totalAudioMinutes.toLocaleString(
                "pt-BR",
                {
                  maximumFractionDigits: 2,
                }
              )} minutos`}
            icon={Clock3}
          />

          <SummaryCard
            title="Taxa de sucesso"
            value={formatPercentage(
              audioData.summary.successRate
            )}
            subtitle={`${formatNumber(
              audioData.summary
                .failedGenerations
            )} falha(s)`}
            icon={Activity}
          />

          <SummaryCard
            title="Voz principal"
            value={
              audioData.summary.topVoice ||
              "Sem dados"
            }
            subtitle={
              audioData.summary.topModel ||
              "Modelo não informado"
            }
            icon={Volume2}
          />
        </div>


        {/* TEMPO MÉDIO */}
        <div
          className="
            rounded-2xl
            border
            border-gray-300
            bg-white
            p-5
            shadow-2xl
          dark:shadow-blue-300
            dark:shadow-sm
            dark:border-white/10
            dark:bg-[#11172D]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h3
                className="
                  font-bold
                  text-[#080E2F]
                  dark:text-white
                "
              >
                Processamento de áudio
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Tempo médio necessário para
                gerar os áudios no período.
              </p>
            </div>

            <div
              className="
                text-left
                sm:text-right
              "
            >
              <p
                className="
                  text-2xl
                  font-bold
                  text-[#080E2F]
                  dark:text-white
                "
              >
                {formatDuration(
                  audioData.summary
                    .averageGenerationMs
                )}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                média por geração
              </p>
            </div>
          </div>
        </div>


        {/* TIMELINE */}
        <div
          className="
            rounded-2xl
            border
            border-gray-300
            bg-white
            p-5
            shadow-2xl
            dark:shadow-blue-300
            dark:shadow-sm
            dark:border-white/10
            dark:bg-[#11172D]
          "
        >
          <div>
            <h3
              className="
                font-bold
                text-[#080E2F]
                dark:text-white
              "
            >
              Áudios gerados ao longo do tempo
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Quantidade de gerações concluídas
              por dia.
            </p>
          </div>

          {audioData.timeline.length === 0 ? (
            <div
              className="
                py-16
                text-center
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Nenhum áudio registrado neste
              período.
            </div>
          ) : (
            <div
              className="
                mt-8
                flex
                h-64
                items-end
                gap-5
                overflow-x-auto
                border-b
                border-gray-300
                px-2
                dark:border-white/10
              "
            >
              {audioData.timeline.map(
                (item) => {
                  const maxGenerations =
                    Math.max(
                      ...audioData.timeline.map(
                        (timelineItem) =>
                          timelineItem
                            .successfulGenerations
                      ),
                      1
                    );

                  const height =
                    Math.max(
                      (
                        item
                          .successfulGenerations /
                        maxGenerations
                      ) * 100,
                      8
                    );

                  return (
                    <div
                      key={item.date}
                      className="
                        flex
                        h-full
                        w-20
                        shrink-0
                        flex-col
                        items-center
                        justify-end
                        gap-2
                      "
                    >
                      <span
                        className="
                          text-xs
                          font-semibold
                          text-[#080E2F]
                          dark:text-white
                        "
                      >
                        {formatNumber(
                          item
                            .successfulGenerations
                        )}
                      </span>

                      <div
                        className="
                          flex
                          h-[180px]
                          w-full
                          items-end
                        "
                      >
                        <div
                          style={{
                            height: `${height}%`,
                          }}
                          className="
                            w-full
                            rounded-t-lg
                            bg-purple-500
                          "
                        />
                      </div>

                      <span
                        className="
                          pb-2
                          text-[11px]
                          text-gray-400
                        "
                      >
                        {formatDate(
                          item.date
                        )}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>


        {/* VOZES */}
        <div
          className="
            rounded-2xl
            border
            border-gray-300
            bg-white
            p-5
            shadow-2xl
            dark:shadow-blue-300
            dark:shadow-sm
            dark:border-white/10
            dark:bg-[#11172D]
          "
        >
          <h3
            className="
              font-bold
              text-[#080E2F]
              dark:text-white
            "
          >
            Uso por voz
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Distribuição dos áudios gerados
            por voz utilizada.
          </p>

          <div
            className="
              mt-5
              grid
              grid-cols-1
              gap-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {audioData.byVoice.map(
              (voice) => (
                <div
                  key={voice.voice}
                  className="
                    rounded-2xl
                    border
                    border-gray-300
                    p-4
                    shadow-2xl
                 dark:shadow-blue-300
                   dark:shadow-sm
                    dark:border-white/10
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-purple-500/10
                        text-purple-600
                        dark:text-purple-400
                      "
                    >
                      <Volume2 size={18} />
                    </div>

                    <div>
                      <p
                        className="
                          font-bold
                          text-[#080E2F]
                          dark:text-white
                        "
                      >
                        {voice.voice}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        {formatNumber(
                          voice.totalGenerations
                        )}{" "}
                        geração(ões)
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      mt-4
                      rounded-xl
                      bg-gray-50
                      p-3
                      dark:bg-white/5
                    "
                  >
                    <p
                      className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Áudio processado
                    </p>

                    <p
                      className="
                        mt-1
                        font-bold
                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      {formatAudioDuration(
                        voice.totalAudioSeconds
                      )}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>


        {/* MODELOS */}
        <div
          className="
            rounded-2xl
            border
            border-gray-300
            bg-white
            p-5
            shadow-2xl
            dark:shadow-blue-300
            dark:shadow-sm
            dark:border-white/10
            dark:bg-[#11172D]
          "
        >
          <h3
            className="
              font-bold
              text-[#080E2F]
              dark:text-white
            "
          >
            Modelos de áudio
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Modelos TTS utilizados nas
            gerações.
          </p>

          <div className="mt-5 space-y-3">
            {audioData.byModel.map(
              (model) => (
                <div
                  key={`${model.provider}-${model.model}`}
                  className="
                    rounded-xl
                    bg-gray-50
                    p-4
                    dark:bg-white/5
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          font-semibold
                          text-[#080E2F]
                          dark:text-white
                        "
                      >
                        {model.model}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          capitalize
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        {model.provider}
                      </p>
                    </div>

                    <div
                      className="
                        text-left
                        sm:text-right
                      "
                    >
                      <p
                        className="
                          font-bold
                          text-[#080E2F]
                          dark:text-white
                        "
                      >
                        {formatNumber(
                          model.totalGenerations
                        )}{" "}
                        geração(ões)
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        {formatAudioDuration(
                          model.totalAudioSeconds
                        )}
                        {" · "}
                        média{" "}
                        {formatDuration(
                          model.averageGenerationMs
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </>
    ) : null}
  </>
)}

      {activeTab === "courses" && (
  <>
    {courseLoading && !courseData ? (
      <div
        className="
          py-16
          text-center
          text-gray-500
          dark:text-gray-400
        "
      >
        Carregando dados de cursos...
      </div>
    ) : courseError && !courseData ? (
      <div
        className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-5
          text-sm
          text-red-600
          dark:border-red-500/20
          dark:bg-red-500/10
          dark:text-red-400
        "
      >
        {courseError}
      </div>
    ) : courseData ? (
      <>
        {/* RESUMO */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <SummaryCard
            title="Cursos gerados"
            value={formatNumber(
              courseData.summary.totalGenerations
            )}
            subtitle={`Últimos ${courseData.periodDays} dias`}
            icon={BookOpen}
          />

          <SummaryCard
            title="Tokens consumidos"
            value={formatNumber(
              courseData.summary.totalTokens
            )}
            subtitle={`${formatNumber(
              courseData.summary.inputTokens
            )} entrada · ${formatNumber(
              courseData.summary.outputTokens
            )} saída`}
            icon={Coins}
          />

          <SummaryCard
            title="Custo estimado"
            value={formatUsd(
              courseData.summary.totalCostUsd
            )}
            subtitle={`Média ${formatUsd(
              courseData.summary
                .averageCostPerGeneration
            )} por geração`}
            icon={DollarSign}
          />

          <SummaryCard
            title="Tempo médio"
            value={formatDuration(
              courseData.summary
                .averageGenerationMs
            )}
            subtitle={
              courseData.summary.topModel ||
              "Modelo não informado"
            }
            icon={Clock3}
          />
        </div>


        {/* GERAÇÕES SEM PREÇO */}
        {courseData.summary.unpricedGenerations >
          0 && (
          <div
            className="
              rounded-2xl
              border
              border-orange-200
              bg-orange-50
              px-5
              py-4
              shadow-2xl
            dark:shadow-orange-300
              dark:shadow-sm
              text-sm
              text-orange-700
              dark:border-orange-500/20
              dark:bg-orange-500/10
              dark:text-orange-300
            "
          >
            {formatNumber(
              courseData.summary
                .unpricedGenerations
            )}{" "}
            geração(ões) de curso deste período
            não possuem custo calculado porque
            foram registradas antes da
            configuração de preços.
          </div>
        )}


        {/* MÉDIAS */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-gray-300
              bg-white
              p-5
              shadow-2xl
              dark:shadow-blue-300
              dark:shadow-sm
              dark:border-white/10
              dark:bg-[#11172D]
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-gray-500
                dark:text-gray-400
              "
            >
              Média de tokens por curso
            </p>

            <p
              className="
                mt-2
                text-2xl
                font-bold
                text-[#080E2F]
                dark:text-white
              "
            >
              {formatNumber(
                courseData.summary
                  .averageTokensPerGeneration
              )}
            </p>

            <p
              className="
                mt-2
                text-xs
                text-gray-400
                dark:text-gray-500
              "
            >
              Média considerando todas as
              gerações do período
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-gray-300
              bg-white
              p-5
              shadow-2xl
              dark:shadow-blue-300
              dark:shadow-sm
              dark:border-white/10
              dark:bg-[#11172D]
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-gray-500
                dark:text-gray-400
              "
            >
              Gerações com custo registrado
            </p>

            <p
              className="
                mt-2
                text-2xl
                font-bold
                text-[#080E2F]
                dark:text-white
              "
            >
              {formatNumber(
                courseData.summary
                  .pricedGenerations
              )}
            </p>

            <p
              className="
                mt-2
                text-xs
                text-gray-400
                dark:text-gray-500
              "
            >
              de{" "}
              {formatNumber(
                courseData.summary
                  .totalGenerations
              )}{" "}
              geração(ões)
            </p>
          </div>
        </div>


        {/* TIMELINE */}
        <div
          className="
            rounded-2xl
            border
            border-gray-300
            bg-white
            p-5
            shadow-2xl
          dark:shadow-blue-300
            dark:shadow-sm
            dark:border-white/10
            dark:bg-[#11172D]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-1
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h3
                className="
                  font-bold
                  text-[#080E2F]
                  dark:text-white
                "
              >
                Cursos gerados ao longo do tempo
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Quantidade de gerações concluídas
                por dia.
              </p>
            </div>

            <span
              className="
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              {courseData.timeline.length} dia(s)
              com geração
            </span>
          </div>

          {courseData.timeline.length === 0 ? (
            <div
              className="
                py-16
                text-center
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Nenhum curso gerado neste período.
            </div>
          ) : (
            <div
              className="
                mt-8
                flex
                h-64
                items-end
                gap-5
                overflow-x-auto
                border-b
                border-gray-300
                px-2
                dark:border-white/10
              "
            >
              {courseData.timeline.map(
                (item) => {
                  const maxGenerations =
                    Math.max(
                      ...courseData.timeline.map(
                        (timelineItem) =>
                          timelineItem
                            .totalGenerations
                      ),
                      1
                    );

                  const height = Math.max(
                    (
                      item.totalGenerations /
                      maxGenerations
                    ) * 100,
                    8
                  );

                  return (
                    <div
                      key={item.date}
                      className="
                        flex
                        h-full
                        w-20
                        shrink-0
                        flex-col
                        items-center
                        justify-end
                        gap-2
                      "
                    >
                      <span
                        className="
                          text-xs
                          font-semibold
                          text-[#080E2F]
                          dark:text-white
                        "
                      >
                        {formatNumber(
                          item.totalGenerations
                        )}
                      </span>

                      <div
                        className="
                          flex
                          h-[180px]
                          w-full
                          items-end
                        "
                      >
                        <div
                          style={{
                            height: `${height}%`,
                          }}
                          className="
                            w-full
                            rounded-t-lg
                            bg-orange-500
                          "
                        />
                      </div>

                      <span
                        className="
                          pb-2
                          text-[11px]
                          text-gray-400
                        "
                      >
                        {formatDate(item.date)}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>


        {/* MODELOS */}
        <div
          className="
            rounded-2xl
            border
            border-gray-300
            bg-white
            p-5
            shadow-2xl
          dark:shadow-blue-300
            dark:shadow-sm
            dark:border-white/10
            dark:bg-[#11172D]
          "
        >
          <h3
            className="
              font-bold
              text-[#080E2F]
              dark:text-white
            "
          >
            Modelos utilizados
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Consumo dos modelos utilizados para
            geração de cursos.
          </p>

          <div className="mt-5 space-y-3">
            {courseData.byModel.length === 0 ? (
              <div
                className="
                  py-8
                  text-center
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Nenhum modelo registrado neste
                período.
              </div>
            ) : (
              courseData.byModel.map(
                (model) => (
                  <div
                    key={`${model.provider}-${model.model}`}
                    className="
                      rounded-xl
                      bg-gray-50
                      p-4
                      dark:bg-white/5
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
                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            font-semibold
                            text-[#080E2F]
                            dark:text-white
                          "
                        >
                          {model.model}
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            capitalize
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          {model.provider}
                          {" · "}
                          {formatNumber(
                            model.totalGenerations
                          )}{" "}
                          geração(ões)
                        </p>
                      </div>

                      <div
                        className="
                          text-left
                          md:text-right
                        "
                      >
                        <p
                          className="
                            font-bold
                            text-[#080E2F]
                            dark:text-white
                          "
                        >
                          {formatNumber(
                            model.totalTokens
                          )}{" "}
                          tokens
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          {formatUsd(
                            model.totalCostUsd
                          )}
                          {" · "}
                          média{" "}
                          {formatDuration(
                            model
                              .averageGenerationMs
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>


        {/* GERAÇÕES RECENTES */}
        <div
          className="
            rounded-2xl
            border
            border-gray-300
            bg-white
            p-5
            shadow-2xl
          dark:shadow-blue-300
            dark:shadow-sm
            dark:border-white/10
            dark:bg-[#11172D]
          "
        >
          <h3
            className="
              font-bold
              text-[#080E2F]
              dark:text-white
            "
          >
            Gerações recentes
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Últimas gerações de curso registradas
            pela IA.
          </p>

          {courseData.recentGenerations.length ===
          0 ? (
            <div
              className="
                py-10
                text-center
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Nenhuma geração recente.
            </div>
          ) : (
            <div
              className="
                mt-5
                space-y-3
              "
            >
              {courseData.recentGenerations.map(
                (generation) => (
                  <div
                    key={generation.id}
                    className="
                      rounded-2xl
                      border
                      border-gray-300
                      p-4
                      shadow-2xl
                    dark:shadow-blue-300
                      dark:shadow-sm
                      dark:border-white/10
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                      "
                    >
                      <div className="min-w-0">
                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >
                          <p
                            className="
                              truncate
                              font-semibold
                              text-[#080E2F]
                              dark:text-white
                            "
                          >
                            {generation.courseId
                              ? generation.courseTitle
                              : "Curso não disponível"}
                          </p>

                          {!generation.courseId && (
                            <span
                              className="
                                rounded-full
                                bg-gray-100
                                px-2.5
                                py-1
                                text-[11px]
                                font-semibold
                                text-gray-500
                                dark:bg-white/10
                                dark:text-gray-400
                              "
                            >
                              Removido
                            </span>
                          )}
                        </div>

                        <p
                          className="
                            mt-1
                            truncate
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          {generation.model}
                          {" · "}
                          {formatDateTime(
                            generation.createdAt
                          )}
                        </p>
                      </div>

                      <div
                        className="
                          grid
                          grid-cols-2
                          gap-3
                          sm:grid-cols-4
                          lg:min-w-[500px]
                        "
                      >
                        <div
                          className="
                            rounded-xl
                            bg-gray-50
                            p-3
                            dark:bg-white/5
                          "
                        >
                          <p
                            className="
                              text-[11px]
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Tokens
                          </p>

                          <p
                            className="
                              mt-1
                              text-sm
                              font-bold
                              text-[#080E2F]
                              dark:text-white
                            "
                          >
                            {formatNumber(
                              generation.totalTokens
                            )}
                          </p>
                        </div>

                        <div
                          className="
                            rounded-xl
                            bg-gray-50
                            p-3
                            dark:bg-white/5
                          "
                        >
                          <p
                            className="
                              text-[11px]
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Entrada
                          </p>

                          <p
                            className="
                              mt-1
                              text-sm
                              font-bold
                              text-[#080E2F]
                              dark:text-white
                            "
                          >
                            {formatNumber(
                              generation.inputTokens
                            )}
                          </p>
                        </div>

                        <div
                          className="
                            rounded-xl
                            bg-gray-50
                            p-3
                            dark:bg-white/5
                          "
                        >
                          <p
                            className="
                              text-[11px]
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Tempo
                          </p>

                          <p
                            className="
                              mt-1
                              text-sm
                              font-bold
                              text-[#080E2F]
                              dark:text-white
                            "
                          >
                            {formatDuration(
                              generation.durationMs
                            )}
                          </p>
                        </div>

                        <div
                          className="
                            rounded-xl
                            bg-gray-50
                            p-3
                            dark:bg-white/5
                          "
                        >
                          <p
                            className="
                              text-[11px]
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Custo
                          </p>

                          <p
                            className="
                              mt-1
                              text-sm
                              font-bold
                              text-[#080E2F]
                              dark:text-white
                            "
                          >
                            {generation
                              .estimatedCostUsd !==
                            null
                              ? formatUsd(
                                  generation
                                    .estimatedCostUsd
                                )
                              : "Sem cálculo"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </>
    ) : null}
  </>
)}
    </section>
  );
}