import {
  Cpu,
  Loader2,
  Save,
  X,
} from "lucide-react";

import type {
  DeviceType,
} from "../types/adminDashboard.types";

interface EditDeviceForm {
  nome: string;
  modelo: string;
  tipo: string;
  descricao: string;
  imagem_url: string;
}

type EditDeviceField =
  keyof EditDeviceForm;

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
    <div
      className="
        fixed
        inset-0
        z-[110]

        flex
        items-center
        justify-center

        bg-black/60
        backdrop-blur-[2px]

        p-3
        sm:p-4
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-device-title"
        className="
          w-full
          max-w-2xl

          max-h-[calc(100dvh-24px)]
          sm:max-h-[calc(100dvh-32px)]

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
        {/* Header */}
        <div
          className="
            sticky
            top-0
            z-10

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

            px-4
            sm:px-6

            py-4
            sm:py-5
          "
        >
          <div
            className="
              flex
              items-start
              gap-3

              min-w-0
            "
          >
            <div
              className="
                w-10
                h-10

                sm:w-11
                sm:h-11

                rounded-2xl

                bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                text-[var(--company-primary)]

                flex
                items-center
                justify-center

                shrink-0
              "
            >
              <Cpu size={22} />
            </div>

            <div className="min-w-0">
              <h2
                id="edit-device-title"
                className="
                  text-xl
                  sm:text-2xl

                  font-bold

                  text-[#080E2F]
                  dark:text-white

                  leading-tight
                "
              >
                Editar dispositivo
              </h2>

              <p
                className="
                  text-sm

                  text-gray-500
                  dark:text-gray-400

                  mt-1

                  leading-relaxed
                "
              >
                Atualize as informações do dispositivo cadastrado.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Fechar modal"
            className="
              w-10
              h-10

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

        {/* Formulário */}
        <div
          className="
            p-4
            sm:p-6

            space-y-5
          "
        >
          {/* Nome */}
          <div>
            <label
              htmlFor="device-name"
              className="
                block

                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-white

                mb-2
              "
            >
              Nome do dispositivo
            </label>

            <input
              id="device-name"
              value={form.nome}
              onChange={(event) =>
                onChange(
                  "nome",
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

                px-4
                py-3

                text-sm
                sm:text-base

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all
              "
              placeholder="Ex: Sensor de temperatura"
            />
          </div>

          {/* Modelo / Categoria */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2

              gap-4
            "
          >
            <div>
              <label
                htmlFor="device-model"
                className="
                  block

                  text-sm
                  font-semibold

                  text-[#080E2F]
                  dark:text-white

                  mb-2
                "
              >
                Modelo
              </label>

              <input
                id="device-model"
                value={form.modelo}
                onChange={(event) =>
                  onChange(
                    "modelo",
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

                  px-4
                  py-3

                  text-sm
                  sm:text-base

                  text-[#080E2F]
                  dark:text-white

                  placeholder:text-gray-400

                  outline-none

                  focus:border-[var(--company-primary)]
                  focus:ring-4
                  focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                  transition-all
                "
                placeholder="Ex: ST-100"
              />
            </div>

            <div>
              <label
                htmlFor="device-category"
                className="
                  block

                  text-sm
                  font-semibold

                  text-[#080E2F]
                  dark:text-white

                  mb-2
                "
              >
                Categoria
              </label>

              <input
                id="device-category"
                value={form.tipo}
                onChange={(event) =>
                  onChange(
                    "tipo",
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

                  px-4
                  py-3

                  text-sm
                  sm:text-base

                  text-[#080E2F]
                  dark:text-white

                  placeholder:text-gray-400

                  outline-none

                  focus:border-[var(--company-primary)]
                  focus:ring-4
                  focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                  transition-all
                "
                placeholder="Ex: Sensor IoT"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label
              htmlFor="device-description"
              className="
                block

                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-white

                mb-2
              "
            >
              Descrição
            </label>

            <textarea
              id="device-description"
              value={form.descricao}
              onChange={(event) =>
                onChange(
                  "descricao",
                  event.target.value,
                )
              }
              rows={4}
              className="
                w-full

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#0d2238]

                px-4
                py-3

                text-sm
                sm:text-base

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all

                resize-none
              "
              placeholder="Descreva o dispositivo..."
            />
          </div>

          {/* URL */}
          <div>
            <label
              htmlFor="device-image"
              className="
                block

                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-white

                mb-2
              "
            >
              URL da imagem
            </label>

            <input
              id="device-image"
              value={form.imagem_url}
              onChange={(event) =>
                onChange(
                  "imagem_url",
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

                px-4
                py-3

                text-sm
                sm:text-base

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

          {/* Prévia */}
          {form.imagem_url && (
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
                  text-sm
                  font-semibold

                  text-[#080E2F]
                  dark:text-white

                  mb-3
                "
              >
                Prévia da imagem
              </p>

              <div
                className="
                  w-full

                  rounded-2xl

                  bg-gray-100
                  dark:bg-[#0d2238]

                  overflow-hidden
                "
              >
                <img
                  src={form.imagem_url}
                  alt="Prévia do dispositivo"
                  className="
                    w-full
                    max-h-64

                    object-contain
                  "
                />
              </div>
            </div>
          )}

          {/* Ações */}
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
                sm:order-1

                w-full

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                px-5
                py-3

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
              onClick={onSave}
              disabled={saving}
              className="
                sm:order-2

                w-full

                rounded-2xl

                bg-gradient-to-r
                from-[var(--company-primary)]
                to-[var(--company-secondary)]

                px-5
                py-3

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
                disabled:active:scale-100
              "
            >
              {saving ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />

                  Salvando...
                </>
              ) : (
                <>
                  <Save size={19} />

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