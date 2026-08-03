import { Trash2 } from "lucide-react";

import type { CourseType } from "../types/adminDashboard.types";

interface DeleteCourseModalProps {
  course: CourseType | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteCourseModal({
  course,
  deleting,
  onClose,
  onConfirm,
}: DeleteCourseModalProps) {
  if (!course) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
          <Trash2 size={36} />
        </div>

        <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white text-center mt-5">
          Excluir curso
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-center mt-3 leading-relaxed">
          Tem certeza que deseja excluir o curso{" "}
          <strong className="text-[#080E2F] dark:text-white">
            “{course.titulo}”
          </strong>
          ?
        </p>

        <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-500 text-sm font-medium">
          Essa ação removerá módulos, aulas, quizzes, progresso das
          aulas e vínculos com dispositivos.
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 rounded-2xl border border-gray-200 dark:border-white/10 px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}