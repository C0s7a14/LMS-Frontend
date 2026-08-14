import {
  BotMessageSquare,
  Loader2,
  Save,
  ShieldAlert,
  X,
} from "lucide-react";

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
  onActiveChange: (
    active: boolean,
  ) => void;
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
        aria-labelledby="ai-prompt-modal-title"
        className="
          w-full
          max-w-3xl

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
        {/* HEADER */}
        <div
          className="
            sticky
            top-0
            z-10

            flex
            items-start
            justify-between

            gap-3
            sm:gap-4

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
              <BotMessageSquare
                size={22}
              />
            </div>

            <div className="min-w-0">
              <h2
                id="ai-prompt-modal-title"
                className="
                  text-xl
                  sm:text-2xl

                  font-bold

                  text-[#080E2F]
                  dark:text-white

                  leading-tight
                "
              >
                {editingPrompt
                  ? "Editar Prompt"
                  : "Novo Prompt"}
              </h2>

              <p
                className="
                  mt-1

                  text-sm

                  text-gray-500
                  dark:text-gray-400

                  leading-relaxed
                "
              >
                Configure as instruções usadas pelo agente técnico
                da empresa.
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

        {/* CONTEÚDO */}
        <div
          className="
            p-4
            sm:p-6

            space-y-5
          "
        >
          {/* NOME */}
          <div>
            <label
              htmlFor="ai-prompt-name"
              className="
                block

                mb-2

                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-white
              "
            >
              Nome do prompt
            </label>

            <input
              id="ai-prompt-name"
              value={form.nome}
              onChange={(event) =>
                onTextChange(
                  "nome",
                  event.target.value,
                )
              }
              disabled={saving}
              placeholder="Ex: Prompt padrão - Agente Técnico"
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
                dark:placeholder:text-gray-500

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />
          </div>

          {/* APLICAR EM */}
          <div>
            <label
              htmlFor="ai-prompt-device"
              className="
                block

                mb-2

                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-white
              "
            >
              Aplicar em
            </label>

            <select
              id="ai-prompt-device"
              value={
                form.dispositivo_id
              }
              onChange={(event) =>
                onTextChange(
                  "dispositivo_id",
                  event.target.value,
                )
              }
              disabled={saving}
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

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              <option value="">
                Prompt global
              </option>

              {devices.map(
                (device) => (
                  <option
                    key={device.id}
                    value={device.id}
                  >
                    {device.nome}
                    {device.modelo
                      ? ` - ${device.modelo}`
                      : ""}
                  </option>
                ),
              )}
            </select>

            <p
              className="
                mt-2

                text-xs

                text-gray-500
                dark:text-gray-400

                leading-relaxed
              "
            >
              O prompt global orienta o agente de forma geral.
              Selecione um dispositivo para criar instruções
              específicas para ele.
            </p>
          </div>

          {/* CONTEÚDO */}
          <div>
            <div
              className="
                flex
                items-center
                justify-between

                gap-3

                mb-2
              "
            >
              <label
                htmlFor="ai-prompt-content"
                className="
                  text-sm
                  font-semibold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Conteúdo do prompt
              </label>

              <span
                className="
                  text-xs

                  text-gray-400
                  dark:text-gray-500

                  whitespace-nowrap
                "
              >
                {form.conteudo.length} caracteres
              </span>
            </div>

            <textarea
              id="ai-prompt-content"
              value={form.conteudo}
              onChange={(event) =>
                onTextChange(
                  "conteudo",
                  event.target.value,
                )
              }
              disabled={saving}
              rows={10}
              placeholder="Digite as instruções que orientarão o comportamento do agente técnico..."
              className="
                w-full

                min-h-[220px]

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
                dark:placeholder:text-gray-500

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                resize-y

                leading-relaxed

                transition-all

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />
          </div>

          {/* STATUS */}
          <div
            className="
              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-gray-50
              dark:bg-white/5

              p-4

              flex
              items-center
              justify-between

              gap-4
            "
          >
            <div className="min-w-0">
              <p
                className="
                  text-sm
                  font-semibold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Prompt ativo
              </p>

              <p
                className="
                  mt-1

                  text-xs

                  text-gray-500
                  dark:text-gray-400
                "
              >
                Define se este prompt poderá ser utilizado pelo agente.
              </p>
            </div>

            <label
              className={`
                relative

                inline-flex

                h-7
                w-12

                items-center

                shrink-0

                ${
                  saving
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }
              `}
            >
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(event) =>
                  onActiveChange(
                    event.target.checked,
                  )
                }
                disabled={saving}
                className="peer sr-only"
              />

              <span
                className="
                  absolute
                  inset-0

                  rounded-full

                  bg-gray-300
                  dark:bg-white/15

                  transition-all

                  peer-checked:bg-[var(--company-primary)]
                "
              />

              <span
                className="
                  relative

                  ml-1

                  h-5
                  w-5

                  rounded-full

                  bg-white

                  shadow-md

                  transition-transform

                  peer-checked:translate-x-5
                "
              />
            </label>
          </div>

          {/* ALERTA */}
          <div
            className="
              rounded-2xl

              border
              border-orange-500/20

              bg-orange-500/10

              p-4

              flex
              items-start

              gap-3

              text-sm

              text-orange-700
              dark:text-orange-300

              leading-relaxed
            "
          >
            <ShieldAlert
              size={20}
              className="
                mt-0.5
                shrink-0
              "
            />

            <p>
              O agente técnico deve trabalhar dentro do escopo
              definido pela empresa e utilizar a base técnica
              autorizada para cada dispositivo. Evite instruções que
              incentivem respostas técnicas sem informações suficientes
              no contexto fornecido.
            </p>
          </div>

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
                    size={18}
                    className="animate-spin"
                  />

                  Salvando...
                </>
              ) : editingPrompt ? (
                <>
                  <Save size={18} />

                  Salvar alterações
                </>
              ) : (
                <>
                  <BotMessageSquare
                    size={18}
                  />

                  Criar prompt
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}