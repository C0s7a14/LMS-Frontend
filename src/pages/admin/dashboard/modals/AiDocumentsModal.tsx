import type {
  ChangeEvent,
} from "react";

import {
  FileText,
  Loader2,
  Play,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import type {
  DeviceType,
} from "../types/adminDashboard.types";

interface AiDocument {
  id: number;
  titulo: string;
  nome_arquivo_original: string;
  total_chunks?: number | null;
  status: string;
}

interface AiDocumentsModalProps {
  device: DeviceType | null;
  documents: AiDocument[];
  loading: boolean;
  uploading: boolean;
  processingDocumentId: number | null;
  onClose: () => void;
  onUpload: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onProcess: (
    documentId: number,
  ) => void;
  onDelete: (
    documentId: number,
  ) => void;
}

export default function AiDocumentsModal({
  device,
  documents,
  loading,
  uploading,
  processingDocumentId,
  onClose,
  onUpload,
  onProcess,
  onDelete,
}: AiDocumentsModalProps) {
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
        aria-labelledby="ai-documents-title"
        className="
          w-full
          max-w-4xl

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
              <FileText size={22} />
            </div>

            <div className="min-w-0">
              <h2
                id="ai-documents-title"
                className="
                  text-xl
                  sm:text-2xl

                  font-bold

                  text-[#080E2F]
                  dark:text-white

                  leading-tight
                "
              >
                PDFs da IA
              </h2>

              <p
                className="
                  mt-1

                  text-xs
                  sm:text-sm

                  text-gray-500
                  dark:text-gray-400

                  leading-relaxed
                  break-words
                "
              >
                Base de conhecimento do dispositivo{" "}
                <strong
                  className="
                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  {device.nome}
                </strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
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

            space-y-6
          "
        >
          {/* UPLOAD */}
          <section
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-dashed
              border-[color-mix(in_srgb,var(--company-primary)_40%,transparent)]

              bg-[color-mix(in_srgb,var(--company-primary)_4%,transparent)]

              p-4
              sm:p-5
            "
          >
            <label
              className="
                flex
                flex-col

                sm:flex-row
                sm:items-center
                sm:justify-between

                gap-4

                cursor-pointer
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

                    rounded-xl

                    bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                    text-[var(--company-primary)]

                    flex
                    items-center
                    justify-center

                    shrink-0
                  "
                >
                  <Plus size={20} />
                </div>

                <div className="min-w-0">
                  <h3
                    className="
                      font-bold

                      text-[#080E2F]
                      dark:text-white
                    "
                  >
                    Adicionar PDF
                  </h3>

                  <p
                    className="
                      mt-1

                      text-sm

                      text-gray-500
                      dark:text-gray-400

                      leading-relaxed
                    "
                  >
                    Envie manuais, fichas técnicas ou documentos
                    relacionados ao dispositivo.
                  </p>
                </div>
              </div>

              <span
                className={`
                  w-full
                  sm:w-auto

                  inline-flex
                  items-center
                  justify-center

                  gap-2

                  rounded-xl

                  bg-gradient-to-r
                  from-[var(--company-primary)]
                  to-[var(--company-secondary)]

                  px-4
                  py-3

                  font-semibold
                  text-white

                  shadow-lg

                  transition-all

                  ${
                    uploading
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:brightness-105 active:scale-[0.98]"
                  }
                `}
              >
                {uploading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={18} />
                )}

                {uploading
                  ? "Enviando..."
                  : "Selecionar PDF"}
              </span>

              <input
                type="file"
                accept="application/pdf"
                onChange={onUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </section>

          {/* DOCUMENTOS */}
          <section className="min-w-0">
            <div
              className="
                flex
                flex-col

                sm:flex-row
                sm:items-center
                sm:justify-between

                gap-2

                mb-4
              "
            >
              <div>
                <h3
                  className="
                    font-bold

                    text-[#080E2F]
                    dark:text-white
                  "
                >
                  Documentos cadastrados
                </h3>

                <p
                  className="
                    mt-1

                    text-sm

                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {documents.length}{" "}
                  {documents.length === 1
                    ? "documento"
                    : "documentos"}
                </p>
              </div>
            </div>

            {loading ? (
              <DocumentsLoading />
            ) : documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((document) => {
                  const isProcessing =
                    processingDocumentId ===
                    document.id;

                  return (
                    <article
                      key={document.id}
                      className="
                        min-w-0

                        rounded-2xl

                        border
                        border-gray-200
                        dark:border-white/10

                        p-4

                        flex
                        flex-col

                        lg:flex-row
                        lg:items-center
                        lg:justify-between

                        gap-4

                        shadow-lg
                        dark:shadow-none

                        transition-all

                        hover:border-[color-mix(in_srgb,var(--company-primary)_25%,transparent)]
                      "
                    >
                      {/* DADOS */}
                      <div
                        className="
                          flex
                          items-start
                          gap-3

                          min-w-0
                          flex-1
                        "
                      >
                        <div
                          className="
                            w-11
                            h-11

                            sm:w-12
                            sm:h-12

                            rounded-xl

                            bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                            text-[var(--company-primary)]

                            flex
                            items-center
                            justify-center

                            shrink-0
                          "
                        >
                          <FileText
                            size={22}
                          />
                        </div>

                        <div className="min-w-0">
                          <h4
                            className="
                              font-bold

                              text-sm
                              sm:text-base

                              text-[#080E2F]
                              dark:text-white

                              leading-snug
                              break-words
                            "
                          >
                            {document.titulo}
                          </h4>

                          <p
                            className="
                              mt-1

                              text-xs
                              sm:text-sm

                              text-gray-500
                              dark:text-gray-400

                              break-all
                            "
                          >
                            {
                              document.nome_arquivo_original
                            }
                          </p>

                          <div
                            className="
                              flex
                              flex-wrap

                              gap-2

                              mt-3
                            "
                          >
                            {/* CHUNKS */}
                            <span
                              className="
                                px-3
                                py-1

                                rounded-xl

                                bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                                text-xs
                                sm:text-sm

                                font-semibold

                                text-[var(--company-primary)]
                              "
                            >
                              {document.total_chunks ??
                                0}{" "}
                              chunks
                            </span>

                            {/* STATUS */}
                            <span
                              className={`
                                px-3
                                py-1

                                rounded-xl

                                text-xs
                                sm:text-sm

                                font-semibold

                                ${getStatusClasses(
                                  document.status,
                                )}
                              `}
                            >
                              {getStatusLabel(
                                document.status,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AÇÕES */}
                      <div
                        className="
                          grid
                          grid-cols-2

                          lg:flex

                          gap-2

                          w-full
                          lg:w-auto
                        "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onProcess(
                              document.id,
                            )
                          }
                          disabled={
                            isProcessing
                          }
                          className="
                            min-w-0

                            rounded-xl

                            bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                            px-4
                            py-2.5

                            text-sm
                            font-semibold

                            text-[var(--company-primary)]

                            flex
                            items-center
                            justify-center

                            gap-2

                            hover:bg-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]

                            transition-all

                            disabled:opacity-60
                            disabled:cursor-not-allowed
                          "
                        >
                          {isProcessing ? (
                            <Loader2
                              size={17}
                              className="animate-spin shrink-0"
                            />
                          ) : (
                            <Play
                              size={17}
                              className="shrink-0"
                            />
                          )}

                          <span>
                            {isProcessing
                              ? "Processando..."
                              : "Processar"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onDelete(
                              document.id,
                            )
                          }
                          className="
                            min-w-0

                            rounded-xl

                            bg-red-500/10

                            px-4
                            py-2.5

                            text-sm
                            font-semibold
                            text-red-500

                            flex
                            items-center
                            justify-center

                            gap-2

                            hover:bg-red-500/20

                            transition-all
                          "
                        >
                          <Trash2
                            size={17}
                            className="shrink-0"
                          />

                          Excluir
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <DocumentsEmptyState />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function getStatusClasses(
  status: string,
) {
  if (status === "processado") {
    return `
      bg-green-500/10
      text-green-600
      dark:text-green-400
    `;
  }

  if (status === "erro") {
    return `
      bg-red-500/10
      text-red-500
    `;
  }

  return `
    bg-orange-500/10
    text-orange-600
    dark:text-orange-400
  `;
}

function getStatusLabel(
  status: string,
) {
  if (status === "processado") {
    return "Processado";
  }

  if (status === "erro") {
    return "Erro";
  }

  if (status === "pendente") {
    return "Pendente";
  }

  return status;
}

function DocumentsLoading() {
  return (
    <div
      className="
        py-10
        sm:py-12

        rounded-2xl

        border
        border-gray-200
        dark:border-white/10

        flex
        flex-col
        items-center
        justify-center

        text-sm

        text-gray-500
        dark:text-gray-400
      "
    >
      <Loader2
        size={28}
        className="
          animate-spin

          text-[var(--company-primary)]

          mb-3
        "
      />

      Carregando documentos...
    </div>
  );
}

function DocumentsEmptyState() {
  return (
    <div
      className="
        py-10
        sm:py-12

        px-4

        text-center

        border
        border-dashed
        border-gray-300
        dark:border-white/15

        rounded-2xl
      "
    >
      <div
        className="
          w-14
          h-14

          mx-auto
          mb-3

          rounded-2xl

          bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
          text-[var(--company-primary)]

          flex
          items-center
          justify-center
        "
      >
        <FileText size={26} />
      </div>

      <h4
        className="
          font-bold

          text-[#080E2F]
          dark:text-white
        "
      >
        Nenhum PDF cadastrado
      </h4>

      <p
        className="
          mt-1

          text-sm

          text-gray-500
          dark:text-gray-400
        "
      >
        Nenhum documento foi adicionado para este dispositivo.
      </p>
    </div>
  );
}