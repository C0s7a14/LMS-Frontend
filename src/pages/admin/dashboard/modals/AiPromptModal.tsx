import { X } from "lucide-react";

import type {
  AiPromptFormState,
  AiPromptType,
  DeviceType,
} from "../types/adminDashboard.types";

type TextPromptField =
  | "nome"
  | "conteudo"
  | "dispositivo_id";

interface AiPromptModalProps {
  open: boolean;
  editingPrompt: AiPromptType | null;
  form: AiPromptFormState;
  devices: DeviceType[];
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  onTextChange: (
    field: TextPromptField,
    value: string,
  ) => void;
  onActiveChange: (active: boolean) => void;
}

export default function AiPromptModal({
  open,
  editingPrompt,
  form,
  devices,
  saving,
  onClose,
  onSave,
  onTextChange,
  onActiveChange,
}: AiPromptModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
              {editingPrompt
                ? "Editar Prompt"
                : "Novo Prompt"}
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Configure as instruções usadas pelo agente técnico da
              Sirros.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-gray-500 hover:text-red-500 transition-all disabled:opacity-60"
            aria-label="Fechar modal"
          >
            <X size={26} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
              Nome do prompt
            </label>

            <input
              value={form.nome}
              onChange={(event) =>
                onTextChange("nome", event.target.value)
              }
              disabled={saving}
              placeholder="Ex: Prompt padrão - Agente Técnico Sirros"
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
              Aplicar em
            </label>

            <select
              value={form.dispositivo_id}
              onChange={(event) =>
                onTextChange(
                  "dispositivo_id",
                  event.target.value,
                )
              }
              disabled={saving}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500 disabled:opacity-60"
            >
              <option value="">Prompt global</option>

              {devices.map((device) => (
                <option
                  key={device.id}
                  value={device.id}
                >
                  {device.nome}
                </option>
              ))}
            </select>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Use prompt global para todos os dispositivos ou
              selecione um dispositivo específico.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
              Conteúdo do prompt
            </label>

            <textarea
              value={form.conteudo}
              onChange={(event) =>
                onTextChange(
                  "conteudo",
                  event.target.value,
                )
              }
              disabled={saving}
              rows={10}
              placeholder="Digite as instruções do agente IA..."
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500 resize-none leading-relaxed disabled:opacity-60"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(event) =>
                onActiveChange(event.target.checked)
              }
              disabled={saving}
              className="w-5 h-5 disabled:opacity-60"
            />

            <span className="text-sm font-semibold text-[#080E2F] dark:text-white">
              Prompt ativo
            </span>
          </label>

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
            O agente deve responder apenas dúvidas sobre dispositivos
            Sirros e usar os documentos técnicos cadastrados. Evite
            prompts que permitam respostas fora da base técnica.
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-2xl border border-gray-200 dark:border-white/10 px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving
                ? "Salvando..."
                : editingPrompt
                  ? "Salvar alterações"
                  : "Criar prompt"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}