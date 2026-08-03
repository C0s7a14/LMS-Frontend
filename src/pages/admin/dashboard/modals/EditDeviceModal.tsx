import { X } from "lucide-react";

import type { DeviceType } from "../types/adminDashboard.types";

interface EditDeviceForm {
  nome: string;
  modelo: string;
  tipo: string;
  descricao: string;
  imagem_url: string;
}

type EditDeviceField = keyof EditDeviceForm;

interface EditDeviceModalProps {
  device: DeviceType | null;
  form: EditDeviceForm;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (
    field: EditDeviceField,
    value: string,
  ) => void;
}

export default function EditDeviceModal({
  device,
  form,
  saving,
  onClose,
  onSave,
  onChange,
}: EditDeviceModalProps) {
  if (!device) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
              Editar dispositivo
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Atualize as informações do dispositivo cadastrado.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-gray-500 hover:text-red-500 transition-all disabled:opacity-60"
          >
            <X size={26} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
              Nome do dispositivo
            </label>

            <input
              value={form.nome}
              onChange={(event) =>
                onChange("nome", event.target.value)
              }
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
              placeholder="Ex: Sirros S1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
                Modelo
              </label>

              <input
                value={form.modelo}
                onChange={(event) =>
                  onChange("modelo", event.target.value)
                }
                className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
                placeholder="Ex: S1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
                Categoria
              </label>

              <input
                value={form.tipo}
                onChange={(event) =>
                  onChange("tipo", event.target.value)
                }
                className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
                placeholder="Ex: Sensor IoT"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
              Descrição
            </label>

            <textarea
              value={form.descricao}
              onChange={(event) =>
                onChange("descricao", event.target.value)
              }
              rows={4}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500 resize-none"
              placeholder="Descreva o dispositivo..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
              URL da imagem
            </label>

            <input
              value={form.imagem_url}
              onChange={(event) =>
                onChange(
                  "imagem_url",
                  event.target.value,
                )
              }
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </div>

          {form.imagem_url && (
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-4">
              <p className="text-sm font-semibold text-[#080E2F] dark:text-white mb-3">
                Prévia da imagem
              </p>

              <img
                src={form.imagem_url}
                alt="Prévia do dispositivo"
                className="w-full max-h-56 object-cover rounded-2xl"
              />
            </div>
          )}

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
                : "Salvar alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}