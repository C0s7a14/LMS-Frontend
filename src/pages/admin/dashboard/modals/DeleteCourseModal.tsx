import {
  Loader2,
  Trash2,
} from "lucide-react";

import type {
  CourseType,
} from "../types/adminDashboard.types";

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
    <div
      className="
        fixed inset-0 z-[110]
        flex items-center justify-center
        bg-black/60 backdrop-blur-[2px]
        p-3 sm:p-4
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-course-title"
        className="
          w-full
          max-w-md
          max-h-[calc(100dvh-24px)]
          overflow-y-auto

          rounded-2xl
          sm:rounded-3xl

          bg-white
          dark:bg-[#091a2c]

          border
          border-gray-200
          dark:border-white/10

          p-5
          sm:p-6

          shadow-2xl
        "
      >
        <div
          className="
            w-14 h-14
            sm:w-16 sm:h-16

            rounded-2xl

            bg-red-500/10
            text-red-500

            flex
            items-center
            justify-center

            mx-auto
          "
        >
          <Trash2
            size={32}
            className="sm:w-9 sm:h-9"
          />
        </div>

        <h2
          id="delete-course-title"
          className="
            mt-5

            text-xl
            sm:text-2xl

            font-bold

            text-[#080E2F]
            dark:text-white

            text-center
          "
        >
          Excluir curso
        </h2>

        <p
          className="
            mt-3

            text-sm
            sm:text-base

            text-gray-500
            dark:text-gray-400

            text-center
            leading-relaxed

            break-words
          "
        >
          Tem certeza que deseja excluir o curso{" "}
          <strong
            className="
              text-[#080E2F]
              dark:text-white
            "
          >
            “{course.titulo}”
          </strong>
          ?
        </p>

        <div
          className="
            mt-5

            rounded-2xl

            border
            border-red-500/20

            bg-red-500/10

            p-4

            text-sm
            font-medium
            text-red-500

            leading-relaxed
          "
        >
          Essa ação removerá módulos, aulas, quizzes, progresso das
          aulas e vínculos com dispositivos.
        </div>

        <div
          className="
            mt-6

            grid
            grid-cols-1
            sm:grid-cols-2

            gap-3
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="
              w-full

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              px-5 py-3

              font-semibold

              text-gray-600
              dark:text-gray-300

              hover:bg-gray-50
              dark:hover:bg-white/5

              transition-all

              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="
              w-full

              rounded-2xl

              bg-red-500

              px-5 py-3

              font-semibold
              text-white

              flex
              items-center
              justify-center
              gap-2

              shadow-lg
              shadow-red-500/15

              hover:bg-red-600

              transition-all

              active:scale-[0.98]

              disabled:opacity-60
              disabled:cursor-not-allowed
              disabled:active:scale-100
            "
          >
            {deleting ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Excluindo...
              </>
            ) : (
              <>
                <Trash2 size={18} />

                Excluir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}