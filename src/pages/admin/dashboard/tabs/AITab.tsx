import type {
  ReactNode,
} from "react"

import {
  BarChart3,
  BotMessageSquare,
  CheckCircle2,
  Clock3,
  Cpu,
  FileText,
} from "lucide-react";

import ActionButton from "../components/ActionButton";
import StatCard from "../components/StatCard";
import StatsGrid from "../components/StatsGrid";
import TableCard from "../components/TableCard";

import type {
  AdminTab,
  AiDeviceType,
  AiKnowledgeSummary,
  AiPromptType,
  DeviceType,
} from "../types/adminDashboard.types";

interface AITabProps {
  devices: AiDeviceType[];
  aiSummary: AiKnowledgeSummary | null;
  aiPrompts: AiPromptType[];
  changeTab: (tab: AdminTab) => void;
  openDocumentsModal: (
    device: DeviceType,
  ) => void;
  openPromptModal: (
    prompt?: AiPromptType | null,
  ) => void;
}

export default function AITab({
  devices,
  aiSummary,
  aiPrompts,
  changeTab,
  openDocumentsModal,
  openPromptModal,
}: AITabProps) {
  const mainPrompt =
    aiPrompts.find(
      (prompt) =>
        Boolean(prompt.ativo) &&
        !prompt.dispositivo_id,
    ) || aiPrompts[0];

  const hasProcessedKnowledge =
    (aiSummary?.totalChunks ?? 0) > 0;

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
          title="Prompts"
          value={
            aiSummary?.totalPrompts ?? 0
          }
          subtitle="Configurados"
          icon={BotMessageSquare}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Documentos"
          value={
            aiSummary?.totalDocumentos ??
            0
          }
          subtitle="PDFs cadastrados"
          icon={FileText}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Dispositivos"
          value={devices.length}
          subtitle="Com base técnica"
          icon={Cpu}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Chunks"
          value={
            aiSummary?.totalChunks ?? 0
          }
          subtitle="Trechos processados"
          icon={BarChart3}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Conversas"
          value={
            aiSummary?.totalConversas ?? 0
          }
          subtitle="Atendimentos IA"
          icon={BotMessageSquare}
          color="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
        />

        <StatCard
          title="Base IA"
          value={
            hasProcessedKnowledge
              ? "Pronta"
              : "Sem base"
          }
          subtitle={
            hasProcessedKnowledge
              ? "Documentos processados"
              : "Nenhum conteúdo processado"
          }
          icon={
            hasProcessedKnowledge
              ? CheckCircle2
              : Clock3
          }
          color={
            hasProcessedKnowledge
              ? "bg-green-500/15 text-green-600 dark:text-green-400"
              : "bg-orange-500/15 text-orange-600 dark:text-orange-400"
          }
        />
      </StatsGrid>

      <div
        className="
          w-full
          min-w-0

          grid
          grid-cols-1

          2xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.9fr)]

          gap-5
          sm:gap-6
        "
      >
        {/* BASE DE CONHECIMENTO */}
        <div className="min-w-0">
          <TableCard title="Base de Conhecimento por Dispositivo">
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
                  grid-cols-[1.4fr_1fr_1fr_1fr_120px]

                  gap-4

                  pb-3

                  text-sm

                  text-gray-500
                  dark:text-gray-400

                  border-b
                  border-gray-200
                  dark:border-white/10
                "
              >
                <span>
                  Dispositivo
                </span>

                <span>
                  Modelo
                </span>

                <span>
                  Categoria
                </span>

                <span>
                  Documentos
                </span>

                <span className="text-right">
                  Ações
                </span>
              </div>

              {devices.length > 0 ? (
                devices.map((device) => (
                  <div
                    key={device.id}
                    className="
                      grid
                      grid-cols-[1.4fr_1fr_1fr_1fr_120px]

                      gap-4

                      items-center

                      py-4

                      border-b
                      border-gray-200
                      dark:border-white/10

                      last:border-b-0
                    "
                  >
                    {/* DISPOSITIVO */}
                    <div
                      className="
                        flex
                        items-center

                        gap-3

                        min-w-0
                      "
                    >
                      <DeviceImage
                        device={device}
                      />

                      <div className="min-w-0">
                        <h3
                          className="
                            font-semibold

                            text-[#080E2F]
                            dark:text-white

                            truncate
                          "
                          title={
                            device.nome
                          }
                        >
                          {device.nome}
                        </h3>

                        <p
                          className="
                            mt-1

                            text-xs

                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          ID: {device.id}
                        </p>
                      </div>
                    </div>

                    {/* MODELO */}
                    <span
                      className="
                        min-w-0

                        text-gray-600
                        dark:text-gray-400

                        truncate
                      "
                      title={
                        device.modelo ||
                        undefined
                      }
                    >
                      {device.modelo ||
                        "—"}
                    </span>

                    {/* CATEGORIA */}
                    <div className="min-w-0">
                      <span
                        className="
                          inline-flex

                          max-w-full

                          rounded-xl

                          bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                          px-3
                          py-1.5

                          text-xs
                          font-semibold

                          text-[var(--company-primary)]

                          truncate
                        "
                      >
                        {device.tipo ||
                          "Sem categoria"}
                      </span>
                    </div>

                    {/* DOCUMENTOS */}
                    <div>
                      <p
                        className="
                          text-sm
                          font-medium

                          text-gray-600
                          dark:text-gray-300
                        "
                      >
                        {device.total_documentos ===
                        1
                          ? "1 PDF"
                          : `${device.total_documentos ?? 0} PDFs`}
                      </p>

                      <p
                        className="
                          mt-1

                          text-xs

                          text-gray-400
                          dark:text-gray-500
                        "
                      >
                        {device.total_chunks ??
                          0}{" "}
                        chunks
                      </p>
                    </div>

                    {/* AÇÕES */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          openDocumentsModal(
                            device,
                          )
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
                        <FileText
                          size={18}
                        />

                        PDFs
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <KnowledgeEmptyState />
              )}
            </div>

            {/* MOBILE / TABLET */}
            <div
              className="
                xl:hidden

                grid
                grid-cols-1

                md:grid-cols-2

                gap-3
                sm:gap-4
              "
            >
              {devices.length > 0 ? (
                devices.map((device) => (
                  <article
                    key={device.id}
                    className="
                      w-full
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
                    {/* HEADER */}
                    <div
                      className="
                        flex
                        items-start

                        gap-3

                        min-w-0
                      "
                    >
                      <DeviceImage
                        device={device}
                      />

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <h3
                          className="
                            font-bold

                            text-[#080E2F]
                            dark:text-white

                            leading-snug
                            break-words
                          "
                        >
                          {device.nome}
                        </h3>

                        <p
                          className="
                            mt-1

                            text-xs

                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          ID: {device.id}
                        </p>
                      </div>
                    </div>

                    {/* DADOS */}
                    <div
                      className="
                        grid
                        grid-cols-2

                        gap-3

                        mt-4
                      "
                    >
                      <KnowledgeInfoBox
                        label="Modelo"
                        value={
                          device.modelo ||
                          "Não informado"
                        }
                      />

                      <KnowledgeInfoBox
                        label="Categoria"
                        value={
                          device.tipo ||
                          "Sem categoria"
                        }
                        highlighted
                      />

                      <KnowledgeInfoBox
                        label="Documentos"
                        value={
                          device.total_documentos ===
                          1
                            ? "1 PDF"
                            : `${device.total_documentos ?? 0} PDFs`
                        }
                      />

                      <KnowledgeInfoBox
                        label="Chunks"
                        value={String(
                          device.total_chunks ??
                            0,
                        )}
                      />
                    </div>

                    {/* BOTÃO */}
                    <button
                      type="button"
                      onClick={() =>
                        openDocumentsModal(
                          device,
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

                        hover:brightness-105

                        transition-all

                        active:scale-[0.98]
                      "
                    >
                      <FileText
                        size={18}
                      />

                      Gerenciar PDFs
                    </button>
                  </article>
                ))
              ) : (
                <div className="md:col-span-2">
                  <KnowledgeEmptyState />
                </div>
              )}
            </div>
          </TableCard>
        </div>

        {/* COLUNA DIREITA */}
        <div
          className="
            min-w-0

            space-y-5
            sm:space-y-6
          "
        >
          {/* PROMPT */}
          <TableCard title="Prompt Principal">
            <div className="space-y-4">
              <div
                className="
                  rounded-2xl

                  border
                  border-gray-200
                  dark:border-white/10

                  p-4

                  bg-gray-50
                  dark:bg-white/5
                "
              >
                <div
                  className="
                    flex
                    flex-col

                    sm:flex-row
                    sm:items-start
                    sm:justify-between

                    gap-3
                    sm:gap-4
                  "
                >
                  <div className="min-w-0">
                    <h3
                      className="
                        font-bold

                        text-[#080E2F]
                        dark:text-white

                        break-words
                      "
                    >
                      {mainPrompt?.nome ||
                        "Nenhum prompt configurado"}
                    </h3>

                    <p
                      className="
                        mt-2

                        text-sm

                        text-gray-500
                        dark:text-gray-400

                        leading-relaxed
                        break-words
                      "
                    >
                      {mainPrompt?.conteudo
                        ? mainPrompt
                            .conteudo
                            .length >
                          260
                          ? `${mainPrompt.conteudo.slice(
                              0,
                              260,
                            )}...`
                          : mainPrompt.conteudo
                        : "Configure um prompt para orientar as respostas do agente IA."}
                    </p>
                  </div>

                  {mainPrompt && (
                    <span
                      className={`
                        w-fit
                        shrink-0

                        px-3
                        py-1

                        rounded-xl

                        text-xs
                        font-semibold

                        ${
                          Boolean(
                            mainPrompt.ativo,
                          )
                            ? `
                                bg-green-500/10
                                text-green-600
                                dark:text-green-400
                              `
                            : `
                                bg-gray-500/10
                                text-gray-500
                                dark:text-gray-400
                              `
                        }
                      `}
                    >
                      {Boolean(
                        mainPrompt.ativo,
                      )
                        ? "Ativo"
                        : "Inativo"}
                    </span>
                  )}
                </div>
              </div>

              <ActionButton
                icon={
                  BotMessageSquare
                }
                title="Configurar prompt"
                subtitle="Editar instruções da IA"
                onClick={() =>
                  openPromptModal(
                    mainPrompt ||
                      null,
                  )
                }
              />

              <ActionButton
                icon={Cpu}
                title="Gerenciar dispositivos"
                subtitle="Cadastrar ou editar dispositivos"
                onClick={() =>
                  changeTab(
                    "devices",
                  )
                }
              />
            </div>
          </TableCard>

          {/* REGRAS */}
          <TableCard title="Regras do Agente">
            <div
              className="
                space-y-3

                text-sm

                text-gray-600
                dark:text-gray-400

                leading-relaxed
              "
            >
              <AgentRule>
                Responder sobre os dispositivos disponibilizados pela empresa.
              </AgentRule>

              <AgentRule>
                Utilizar a base técnica autorizada para o dispositivo consultado.
              </AgentRule>

              <AgentRule>
                Não inventar informações técnicas que não estejam disponíveis no contexto fornecido.
              </AgentRule>

              <AgentRule>
                Informar claramente quando não houver informação suficiente na base de conhecimento.
              </AgentRule>

              <AgentRule>
                O acesso ao agente técnico é direcionado aos usuários autorizados pela empresa.
              </AgentRule>
            </div>
          </TableCard>
        </div>
      </div>
    </div>
  );
}

function DeviceImage({
  device,
}: {
  device: AiDeviceType;
}) {
  return (
    <div
      className="
        w-12 h-12

        sm:w-14
        sm:h-14

        rounded-xl

        bg-gray-100
        dark:bg-[#0d2238]

        overflow-hidden

        flex
        items-center
        justify-center

        shrink-0
      "
    >
      {device.imagem_url ? (
        <img
          src={device.imagem_url}
          alt={device.nome}
          className="
            w-full
            h-full

            object-cover
          "
        />
      ) : (
        <Cpu
          size={24}
          className="
            text-[var(--company-primary)]
          "
        />
      )}
    </div>
  );
}

function KnowledgeInfoBox({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
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
        className={`
          mt-1

          text-sm
          font-semibold

          break-words

          ${
            highlighted
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

function AgentRule({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="
        flex
        items-start

        gap-3

        rounded-xl

        bg-gray-50
        dark:bg-white/5

        p-3
      "
    >
      <div
        className="
          w-5
          h-5

          mt-0.5

          rounded-full

          bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

          text-[var(--company-primary)]

          flex
          items-center
          justify-center

          shrink-0
        "
      >
        <CheckCircle2
          size={13}
        />
      </div>

      <p className="min-w-0">
        {children}
      </p>
    </div>
  );
}

function KnowledgeEmptyState() {
  return (
    <div
      className="
        py-10
        sm:py-12

        px-4

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
        <Cpu size={26} />
      </div>

      <h3
        className="
          font-bold

          text-[#080E2F]
          dark:text-white
        "
      >
        Nenhum dispositivo cadastrado
      </h3>

      <p
        className="
          mt-1

          text-sm

          text-gray-500
          dark:text-gray-400
        "
      >
        Cadastre um dispositivo para adicionar sua base de conhecimento.
      </p>
    </div>
  );
}