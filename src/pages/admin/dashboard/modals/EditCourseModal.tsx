import { X } from "lucide-react";

import type { CourseType } from "../types/adminDashboard.types";

interface EditCourseForm {
  titulo: string;
  descricao: string;
  thumbnail: string;
}

type EditCourseField = keyof EditCourseForm;

interface EditCourseModalProps {
  course: CourseType | null;
  form: EditCourseForm;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (
    field: EditCourseField,
    value: string,
  ) => void;
}

export default function EditCourseModal({
  course,
  form,
  saving,
  onClose,
  onSave,
  onChange,
}: EditCourseModalProps) {
  if (!course) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
              Editar curso
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Atualize as informações principais do curso.
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
              Título do curso
            </label>

            <input
              value={form.titulo}
              onChange={(event) =>
                onChange("titulo", event.target.value)
              }
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
              placeholder="Ex: Treinamento Técnico Sirros S1"
            />
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
              rows={5}
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500 resize-none"
              placeholder="Descreva o objetivo do curso..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#080E2F] dark:text-white mb-2">
              URL da imagem do curso
            </label>

            <input
              value={form.thumbnail}
              onChange={(event) =>
                onChange("thumbnail", event.target.value)
              }
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2238] px-4 py-3 text-[#080E2F] dark:text-white outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </div>

          {form.thumbnail && (
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-4">
              <p className="text-sm font-semibold text-[#080E2F] dark:text-white mb-3">
                Prévia da imagem
              </p>

              <img
                src={form.thumbnail}
                alt="Prévia do curso"
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