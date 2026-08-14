import {
  Cpu,
  Loader2,
  Plus,
  X,
} from "lucide-react";

import {
  useState,
  type FormEvent,
} from "react";

import axios from "axios";

interface DeviceFormData {
  nome: string;
  modelo: string;
  tipo: string;
  descricao: string;
  imagem_url: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeviceModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [creating, setCreating] =
    useState(false);

  const [formData, setFormData] =
    useState<DeviceFormData>({
      nome: "",
      modelo: "",
      tipo: "",
      descricao: "",
      imagem_url: "",
    });

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!formData.nome.trim()) {
      alert(
        "O nome do dispositivo é obrigatório",
      );

      return;
    }

    try {
      setCreating(true);

      await axios.post(
        "http://localhost:3333/devices",
        formData,
      );

      setFormData({
        nome: "",
        modelo: "",
        tipo: "",
        descricao: "",
        imagem_url: "",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);

      alert(
        "Erro ao cadastrar dispositivo",
      );
    } finally {
      setCreating(false);
    }
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
        aria-labelledby="new-device-title"
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

                sm:w-12
                sm:h-12

                rounded-2xl

                bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                text-[var(--company-primary)]

                flex
                items-center
                justify-center

                shrink-0
              "
            >
              <Cpu
                size={24}
              />
            </div>

            <div className="min-w-0">
              <h2
                id="new-device-title"
                className="
                  text-xl
                  sm:text-2xl

                  font-bold

                  text-[#080E2F]
                  dark:text-white

                  leading-tight
                "
              >
                Novo Dispositivo
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
                Cadastre um novo dispositivo
                para a empresa.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={creating}
            aria-label="Fechar modal"
            className="
              w-10
              h-10

              rounded-xl

              flex
              items-center
              justify-center

              text-gray-500
              dark:text-gray-400

              hover:bg-red-500/10
              hover:text-red-500

              transition-all

              disabled:opacity-60

              shrink-0
            "
          >
            <X size={23} />
          </button>
        </div>

        {/* FORMULÁRIO */}
        <form
          onSubmit={handleSubmit}
          className="
            p-4
            sm:p-6

            grid
            grid-cols-1
            sm:grid-cols-2

            gap-4
            sm:gap-5
          "
        >
          {/* NOME */}
          <div
            className="
              flex
              flex-col
              gap-2
            "
          >
            <label
              htmlFor="new-device-name"
              className="
                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-gray-300
              "
            >
              Nome
            </label>

            <input
              id="new-device-name"
              type="text"
              value={formData.nome}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  nome:
                    event.target.value,
                })
              }
              placeholder="Sensor de Temperatura"
              className="
                w-full

                bg-gray-50
                dark:bg-[#0d2238]

                border
                border-gray-200
                dark:border-white/10

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400
                dark:placeholder:text-gray-500

                rounded-2xl

                px-4
                py-3

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all
              "
            />
          </div>

          {/* MODELO */}
          <div
            className="
              flex
              flex-col
              gap-2
            "
          >
            <label
              htmlFor="new-device-model"
              className="
                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-gray-300
              "
            >
              Modelo
            </label>

            <input
              id="new-device-model"
              type="text"
              value={formData.modelo}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  modelo:
                    event.target.value,
                })
              }
              placeholder="TEMP-01"
              className="
                w-full

                bg-gray-50
                dark:bg-[#0d2238]

                border
                border-gray-200
                dark:border-white/10

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400
                dark:placeholder:text-gray-500

                rounded-2xl

                px-4
                py-3

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all
              "
            />
          </div>

          {/* TIPO */}
          <div
            className="
              flex
              flex-col
              gap-2
            "
          >
            <label
              htmlFor="new-device-type"
              className="
                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-gray-300
              "
            >
              Tipo
            </label>

            <input
              id="new-device-type"
              type="text"
              value={formData.tipo}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  tipo:
                    event.target.value,
                })
              }
              placeholder="Sensor, gateway, atuador..."
              className="
                w-full

                bg-gray-50
                dark:bg-[#0d2238]

                border
                border-gray-200
                dark:border-white/10

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400
                dark:placeholder:text-gray-500

                rounded-2xl

                px-4
                py-3

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all
              "
            />
          </div>

          {/* URL DA IMAGEM */}
          <div
            className="
              flex
              flex-col
              gap-2
            "
          >
            <label
              htmlFor="new-device-image"
              className="
                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-gray-300
              "
            >
              URL da Imagem
            </label>

            <input
              id="new-device-image"
              type="text"
              value={
                formData.imagem_url
              }
              onChange={(event) =>
                setFormData({
                  ...formData,
                  imagem_url:
                    event.target.value,
                })
              }
              placeholder="https://imagem.com/dispositivo.png"
              className="
                w-full

                bg-gray-50
                dark:bg-[#0d2238]

                border
                border-gray-200
                dark:border-white/10

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400
                dark:placeholder:text-gray-500

                rounded-2xl

                px-4
                py-3

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                transition-all
              "
            />
          </div>

          {/* DESCRIÇÃO */}
          <div
            className="
              sm:col-span-2

              flex
              flex-col
              gap-2
            "
          >
            <label
              htmlFor="new-device-description"
              className="
                text-sm
                font-semibold

                text-[#080E2F]
                dark:text-gray-300
              "
            >
              Descrição
            </label>

            <textarea
              id="new-device-description"
              value={
                formData.descricao
              }
              onChange={(event) =>
                setFormData({
                  ...formData,
                  descricao:
                    event.target.value,
                })
              }
              placeholder="Descrição do dispositivo..."
              rows={4}
              className="
                w-full

                bg-gray-50
                dark:bg-[#0d2238]

                border
                border-gray-200
                dark:border-white/10

                text-[#080E2F]
                dark:text-white

                placeholder:text-gray-400
                dark:placeholder:text-gray-500

                rounded-2xl

                px-4
                py-3

                outline-none

                focus:border-[var(--company-primary)]
                focus:ring-4
                focus:ring-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                resize-none

                transition-all
              "
            />
          </div>

          {/* PRÉVIA */}
          {formData.imagem_url && (
            <div
              className="
                sm:col-span-2

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
                  src={
                    formData.imagem_url
                  }
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

          {/* AÇÕES */}
          <div
            className="
              sm:col-span-2

              grid
              grid-cols-1
              sm:grid-cols-2

              gap-3

              pt-2
              sm:pt-3
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
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

                hover:bg-gray-100
                dark:hover:bg-white/5

                transition-all

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={creating}
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
              {creating ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />

                  Cadastrando...
                </>
              ) : (
                <>
                  <Plus size={19} />

                  Cadastrar Dispositivo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}