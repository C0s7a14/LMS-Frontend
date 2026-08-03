import {
  BarChart3,
  BotMessageSquare,
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


 export default function AITab({
    devices,
    aiSummary,
    aiPrompts,
    changeTab,
    openDocumentsModal,
    openPromptModal,
  }: {
    devices: AiDeviceType[];
    aiSummary: AiKnowledgeSummary | null;
    aiPrompts: AiPromptType[];
    changeTab: (tab: AdminTab) => void;
    openDocumentsModal: (device: DeviceType) => void;
    openPromptModal: (prompt?: AiPromptType | null) => void;
  }) {
    const mainPrompt =
      aiPrompts.find((prompt) => Boolean(prompt.ativo) && !prompt.dispositivo_id) ||
      aiPrompts[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      <StatsGrid>
       <StatCard
        title="Prompts"
        value={aiSummary?.totalPrompts ?? 0}
        subtitle="Configurados"
        icon={BotMessageSquare}
        color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
      />

      <StatCard
        title="Documentos"
        value={aiSummary?.totalDocumentos ?? 0}
        subtitle="PDFs cadastrados"
        icon={FileText}
        color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
      />

      <StatCard
        title="Dispositivos"
        value={devices.length}
        subtitle="Podem receber base IA"
        icon={Cpu}
        color="bg-green-500/15 text-green-600 dark:text-green-400"
      />

      <StatCard
        title="Chunks"
        value={aiSummary?.totalChunks ?? 0}
        subtitle="Trechos processados"
        icon={BarChart3}
        color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
      />

      <StatCard
        title="Conversas"
        value={aiSummary?.totalConversas ?? 0}
        subtitle="Atendimentos IA"
        icon={BotMessageSquare}
        color="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
      />

      <StatCard
        title="Status"
        value={(aiSummary?.totalChunks ?? 0) > 0 ? "Online" : "Offline"}
        subtitle={
          (aiSummary?.totalChunks ?? 0) > 0
            ? "Base IA processada"
            : "Sem documentos processados"
        }
        icon={Clock3}
        color={
          (aiSummary?.totalChunks ?? 0) > 0
            ? "bg-green-500/15 text-green-600 dark:text-green-400"
            : "bg-red-500/15 text-red-600 dark:text-red-400"
        }
      />
      </StatsGrid>

      <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.3fr)_minmax(380px,0.9fr)] gap-5 sm:gap-6">
        <TableCard title="Base de Conhecimento por Dispositivo">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_120px] text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 pb-3">
              <span>Dispositivo</span>
              <span>Modelo</span>
              <span>Categoria</span>
              <span>Documentos</span>
              <span className="text-right">Ações</span>
            </div>

            {devices.length > 0 ? (
              devices.map((device) => (
                <div
                  key={device.id}
                  className="grid grid-cols-[1.4fr_1fr_1fr_1fr_120px] gap-4 items-center py-4 border-b border-gray-200 dark:border-white/10 last:border-b-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#0d2238] overflow-hidden flex items-center justify-center shrink-0">
                      {device.imagem_url ? (
                        <img
                          src={device.imagem_url}
                          alt={device.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Cpu className="text-blue-600 dark:text-blue-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#080E2F] dark:text-white truncate">
                        {device.nome}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        ID: {device.id}
                      </p>
                    </div>
                  </div>

                  <span className="text-gray-600 dark:text-gray-400 truncate">
                    {device.modelo || "-"}
                  </span>

                  <span className="text-blue-600 dark:text-blue-400 font-semibold truncate">
                    {device.tipo || "Sem categoria"}
                  </span>

                  <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {device.total_documentos === 1
                      ? "1 PDF"
                      : `${device.total_documentos ?? 0} PDFs`}
                  </p>

                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {device.total_chunks ?? 0} chunks
                  </p>
                </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                     onClick={() => openDocumentsModal(device)}
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
                      <FileText size={18} />
                      PDFs
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                Nenhum dispositivo cadastrado.
              </div>
            )}
          </div>
        </TableCard>

        <div className="space-y-5 sm:space-y-6">
          <TableCard title="Prompt Principal">
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 bg-gray-50 dark:bg-white/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-[#080E2F] dark:text-white">
                {mainPrompt?.nome || "Nenhum prompt configurado"}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                {mainPrompt?.conteudo
                  ? mainPrompt.conteudo.length > 260
                    ? `${mainPrompt.conteudo.slice(0, 260)}...`
                    : mainPrompt.conteudo
                  : "Configure um prompt para orientar as respostas do agente IA."}
              </p>
            </div>

            {mainPrompt && (
              <span
                className={`
                  px-3 py-1 rounded-xl text-xs font-semibold
                  ${
                    Boolean(mainPrompt.ativo)
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-gray-500/10 text-gray-500"
                  }
                `}
              >
                {Boolean(mainPrompt.ativo) ? "Ativo" : "Inativo"}
              </span>
            )}
          </div>
        </div>

        <ActionButton
          icon={BotMessageSquare}
          title="Configurar prompt"
          subtitle="Editar instruções da IA"
          onClick={() => openPromptModal(mainPrompt || null)}
        />

        <ActionButton
          icon={Cpu}
          title="Gerenciar dispositivos"
          subtitle="Cadastrar ou editar dispositivos"
          onClick={() => changeTab("devices")}
        />
      </div>
    </TableCard>

          <TableCard title="Regras do Agente">
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>• Responder apenas sobre dispositivos Sirros.</p>
              <p>• Usar somente documentos cadastrados pelo admin.</p>
              <p>• Não inventar dados técnicos.</p>
              <p>• Informar quando não encontrar resposta na base.</p>
              <p>• Atender principalmente usuários do tipo cliente.</p>
            </div>
          </TableCard>
        </div>
      </div>
    </div>
  );
}
