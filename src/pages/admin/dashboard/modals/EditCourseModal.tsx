import {
  BookOpen,
  Loader2,
  Save,
  X,
} from "lucide-react";

import type {
  CourseType,
} from "../types/adminDashboard.types";

interface EditCourseForm {
  titulo: string;
  descricao: string;
  thumbnail: string;
}

type EditCourseField =
  keyof EditCourseForm;

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
        aria-labelledby="edit-course-title"
        className="
          w-full
          max-w-2xl

          max-h-[calc(100dvh-24px)]

          overflow-y-auto
          overscroll-contain

          rounded-2xl
          sm:rounded-3xl

          bg-white
          dark:bg-[#091a2c]

          border
          border-gray-200
          dark:border-white/10

          shadow-2xl
        "
      >
        {/* HEADER */}
        <div
          className="
            sticky top-0 z-10

            flex
            items-start
            justify-between

            gap-4

            bg-white/95
            dark:bg-[#091a2c]/95

            backdrop-blur-xl

            border-b
            border-gray-200
            dark:border-white/10

            px-4 sm:px-6
            py-4 sm:py-5
          "
        >
          <div
            className="
              min-w-0
              flex
              items-start
              gap-3
            "
          >
            <div
              className="
                w-10 h-10
                sm:w-11 sm:h-11

                rounded-2xl

                bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                text-[var(--company-primary)]

                flex
                items-center
                justify-center

                shrink-0
              "
            >
              <BookOpen size={22} />
            </div>

            <div className="min-w-0">
              <h2
                id="edit-course-title"
                className="
                  text-xl
                  sm:text-2xl

                  font-bold

                  text-[#080E2F]
                  dark:text-white

                  leading-tight
                "
              >
                Editar curso
              </h2>

              <p
                className="
                  mt-1
                  text-sm

                  text-gray-500
                  dark:text-gray-400
                "
              >
                Atualize as informações principais do curso.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Fechar modal"
            className="
              w-10 h-10

              rounded-xl

              flex
              items-center
              justify-center

              text-gray-500

              hover:text-red-500
              hover:bg-red-500/10

              transition-all

              disabled:opacity-60

              shrink-0
            "
          >
            <X size={23} />
          </button>
        </div>

        <div
          className="
            p-4
            sm:p-6

            space-y-5
          "
        >
          {/* TÍTULO */}
          <div>
            <label
              htmlFor="edit-course-title-input"
              className="
                block
                mb-2

                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-white
              "
            >
              Título do curso
            </label>

            <input
              id="edit-course-title-input"
              value={form.titulo}
              onChange={(event) =>
                onChange(
                  "titulo",
                  event.target.value,
                )
              }
              className="
                w-full

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#0d2238]

                px-4 py-3

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all
              "
              placeholder="Ex: Treinamento de instalação e manutenção"
            />
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label
              htmlFor="edit-course-description"
              className="
                block
                mb-2

                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-white
              "
            >
              Descrição
            </label>

            <textarea
              id="edit-course-description"
              value={form.descricao}
              onChange={(event) =>
                onChange(
                  "descricao",
                  event.target.value,
                )
              }
              rows={5}
              className="
                w-full

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#0d2238]

                px-4 py-3

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                resize-none

                transition-all
              "
              placeholder="Descreva o objetivo do curso..."
            />
          </div>

          {/* THUMBNAIL */}
          <div>
            <label
              htmlFor="edit-course-thumbnail"
              className="
                block
                mb-2

                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-white
              "
            >
              URL da imagem do curso
            </label>

            <input
              id="edit-course-thumbnail"
              value={form.thumbnail}
              onChange={(event) =>
                onChange(
                  "thumbnail",
                  event.target.value,
                )
              }
              className="
                w-full

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#0d2238]

                px-4 py-3

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all
              "
              placeholder="https://..."
            />
          </div>

          {form.thumbnail && (
            <div
              className="
                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                p-3
                sm:p-4
              "
            >
              <p
                className="
                  mb-3

                  text-sm
                  font-semibold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Prévia da imagem
              </p>

              <div
                className="
                  rounded-2xl

                  bg-gray-100
                  dark:bg-[#0d2238]

                  overflow-hidden
                "
              >
                <img
                  src={form.thumbnail}
                  alt="Prévia do curso"
                  className="
                    w-full
                    max-h-64
                    object-contain
                  "
                />
              </div>
            </div>
          )}

          {/* AÇÕES */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2

              gap-3

              pt-2
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
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
              "
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="
                w-full

                rounded-2xl

                bg-gradient-to-r
                from-[var(--company-primary)]
                to-[var(--company-secondary)]

                px-5 py-3

                font-semibold
                text-white

                flex
                items-center
                justify-center
                gap-2

                shadow-lg

                hover:brightness-105

                transition-all

                active:scale-[0.99]

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />

                  Salvar alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}