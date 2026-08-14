import {
  ArrowLeft,
  BotMessageSquare,
  Cpu,
  Download,
  FileText,
  Info,
  Loader2,
  MessageCircle,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";
import axios from "axios";

import {
  api,
} from "../../services/api";

type DeviceDetailTab =
  | "overview"
  | "documents"
  | "support";

interface ClientDeviceDetailsType {
  id: number;
  nome: string;
  modelo?: string;
  tipo?: string;
  descricao?: string;
  imagem_url?: string;
  criado_em?: string;
}

interface ClientDeviceDocumentType {
  id: number;
  dispositivo_id: number;
  titulo: string;
  descricao?: string;
  nome_arquivo_original: string;
  status: string;
  total_chunks?: number;
  criado_em?: string;
}

function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (
    axios.isAxiosError<{
      error?: string;
      message?: string;
    }>(error)
  ) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      fallbackMessage
    );
  }

  return fallbackMessage;
}

export default function ClientDeviceDetails() {
  const {
    deviceId,
  } = useParams();

  const navigate =
    useNavigate();

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<DeviceDetailTab>(
      "overview",
    );

  const [
    device,
    setDevice,
  ] =
    useState<ClientDeviceDetailsType | null>(
      null,
    );

  const [
    documents,
    setDocuments,
  ] =
    useState<
      ClientDeviceDocumentType[]
    >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    downloadingDocumentId,
    setDownloadingDocumentId,
  ] =
    useState<number | null>(
      null,
    );

  const loadDeviceDetails =
    useCallback(
      async () => {
        if (!deviceId) {
          toast.error(
            "Dispositivo inválido.",
          );

          navigate(
            "/devices",
          );

          return;
        }

        try {
          setLoading(true);

          const [
            deviceResponse,
            documentsResponse,
          ] =
            await Promise.all([
              api.get<ClientDeviceDetailsType>(
                `/client/devices/${deviceId}`,
              ),

              api.get<ClientDeviceDocumentType[]>(
                `/client/devices/${deviceId}/documents`,
              ),
            ]);

          setDevice(
            deviceResponse.data,
          );

          setDocuments(
            documentsResponse.data,
          );
        } catch (error: unknown) {
          console.log(
            error,
          );

          toast.error(
            getApiErrorMessage(
              error,
              "Erro ao carregar dispositivo.",
            ),
          );

          navigate(
            "/devices",
          );
        } finally {
          setLoading(false);
        }
      },
      [
        deviceId,
        navigate,
      ],
    );

  async function handleDownloadDocument(
    document:
      ClientDeviceDocumentType,
  ) {
    try {
      setDownloadingDocumentId(
        document.id,
      );

      const response =
        await api.get<Blob>(
          `/client/device-documents/${document.id}/download`,
          {
            responseType:
              "blob",
          },
        );

      const fileUrl =
        window.URL.createObjectURL(
          response.data,
        );

      const link =
        window.document.createElement(
          "a",
        );

      link.href =
        fileUrl;

      link.setAttribute(
        "download",
        document.nome_arquivo_original,
      );

      window.document.body.appendChild(
        link,
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        fileUrl,
      );
    } catch (error: unknown) {
      console.log(
        error,
      );

      toast.error(
        getApiErrorMessage(
          error,
          "Erro ao baixar documento.",
        ),
      );
    } finally {
      setDownloadingDocumentId(
        null,
      );
    }
  }

  useEffect(() => {
    const timeoutId =
      window.setTimeout(
        () => {
          void loadDeviceDetails();
        },
        0,
      );

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [
    loadDeviceDetails,
  ]);

  if (loading) {
    return (
      <div
        className="
          min-h-[60vh]

          flex
          flex-col
          items-center
          justify-center

          gap-3

          text-gray-500
          dark:text-gray-400
        "
      >
        <Loader2
          className="
            w-8
            h-8

            animate-spin

            text-[var(--company-primary)]
          "
        />

        <span>
          Carregando dispositivo...
        </span>
      </div>
    );
  }

  if (!device) {
    return null;
  }

  return (
    <main
      className="
        w-full
        min-w-0

        space-y-5
        sm:space-y-6
      "
    >
      {/* VOLTAR */}
      <button
        type="button"
        onClick={() =>
          navigate(
            "/devices",
          )
        }
        className="
          w-fit

          inline-flex
          items-center

          gap-2

          text-sm
          font-semibold

          text-[var(--company-primary)]

          transition-opacity

          hover:opacity-70
        "
      >
        <ArrowLeft
          size={18}
        />

        Voltar para dispositivos
      </button>

      {/* CARD PRINCIPAL */}
      <section
        className="
          overflow-hidden

          rounded-2xl
          sm:rounded-3xl

          border
          border-gray-200
          dark:border-white/10

          bg-white
          dark:bg-[#091a2c]

          shadow-2xl
          dark:shadow-sm
        "
      >
        {/* CABEÇALHO DO DISPOSITIVO */}
        <div
          className="
            grid
            grid-cols-1

            lg:grid-cols-[320px_minmax(0,1fr)]
            xl:grid-cols-[360px_minmax(0,1fr)]
          "
        >
          {/* IMAGEM */}
          <div
            className="
              relative

              min-h-[260px]

              bg-gray-100
              dark:bg-[#0d2238]

              p-6
              sm:p-8

              flex
              items-center
              justify-center

              overflow-hidden
            "
          >
            <div
              className="
                absolute

                w-48
                h-48

                rounded-full

                bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                blur-xl
              "
            />

            <div
              className="
                relative

                z-10

                w-full
                h-full

                flex
                items-center
                justify-center
              "
            >
              {device.imagem_url ? (
                <img
                  src={
                    device.imagem_url
                  }
                  alt={
                    device.nome
                  }
                  className="
                    max-h-72
                    max-w-[90%]

                    object-contain

                    drop-shadow-xl
                  "
                />
              ) : (
                <div
                  className="
                    w-32
                    h-32

                    sm:w-40
                    sm:h-40

                    rounded-3xl

                    bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

                    text-[var(--company-primary)]

                    flex
                    items-center
                    justify-center
                  "
                >
                  <Cpu
                    size={72}
                  />
                </div>
              )}
            </div>
          </div>

          {/* INFORMAÇÕES */}
          <div
            className="
              min-w-0

              p-4
              sm:p-6
              lg:p-8

              flex
              flex-col
              justify-center
            "
          >
            <div
              className="
                mb-4

                flex
                flex-wrap
                items-center

                gap-2
                sm:gap-3
              "
            >
              <span
                className="
                  inline-flex
                  items-center

                  gap-2

                  rounded-xl

                  border
                  border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

                  bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

                  px-3
                  sm:px-4

                  py-2

                  text-sm
                  font-semibold

                  text-[var(--company-primary)]
                "
              >
                <Cpu
                  size={17}
                />

                {device.tipo ||
                  "Dispositivo"}
              </span>

              {device.modelo && (
                <span
                  className="
                    inline-flex

                    rounded-xl

                    bg-gray-100
                    dark:bg-white/10

                    px-3
                    sm:px-4

                    py-2

                    text-sm
                    font-semibold

                    text-gray-600
                    dark:text-gray-300
                  "
                >
                  Modelo{" "}
                  {
                    device.modelo
                  }
                </span>
              )}
            </div>

            <h1
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl

                font-bold

                text-[#080E2F]
                dark:text-white

                leading-tight
                break-words
              "
            >
              {device.nome}
            </h1>

            <p
              className="
                mt-3

                max-w-2xl

                text-sm
                sm:text-base

                text-gray-500
                dark:text-gray-400

                leading-relaxed
                whitespace-pre-line
              "
            >
              {device.descricao ||
                "Consulte as informações técnicas, documentos e suporte IA deste dispositivo."}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div
          className="
            border-t
            border-gray-200
            dark:border-white/10

            px-2
            sm:px-6
            lg:px-8

            overflow-x-auto
          "
        >
          <div
            className="
              flex

              min-w-max

              gap-1
              sm:gap-3
            "
          >
            <DeviceDetailTabButton
              active={
                activeTab ===
                "overview"
              }
              icon={Info}
              label="Visão geral"
              onClick={() =>
                setActiveTab(
                  "overview",
                )
              }
            />

            <DeviceDetailTabButton
              active={
                activeTab ===
                "documents"
              }
              icon={FileText}
              label="Documentação"
              onClick={() =>
                setActiveTab(
                  "documents",
                )
              }
            />

            <DeviceDetailTabButton
              active={
                activeTab ===
                "support"
              }
              icon={
                BotMessageSquare
              }
              label="Suporte IA"
              onClick={() =>
                setActiveTab(
                  "support",
                )
              }
            />
          </div>
        </div>

        {/* CONTEÚDO DA TAB */}
        <div
          className="
            p-4
            sm:p-6
            lg:p-8
          "
        >
          {/* VISÃO GERAL */}
          {activeTab ===
            "overview" && (
            <div
              className="
                grid
                grid-cols-1

                md:grid-cols-3

                gap-4
                sm:gap-5
              "
            >
              <InfoCard
                title="Nome"
                value={
                  device.nome
                }
              />

              <InfoCard
                title="Modelo"
                value={
                  device.modelo ||
                  "Não informado"
                }
              />

              <InfoCard
                title="Categoria"
                value={
                  device.tipo ||
                  "Não informada"
                }
              />

              <div
                className="
                  md:col-span-3

                  rounded-2xl

                  border
                  border-gray-200
                  dark:border-white/10

                  bg-gray-50
                  dark:bg-[#0d2238]

                  p-4
                  sm:p-5

                  shadow-xl
                  dark:shadow-sm
                "
              >
                <div
                  className="
                    flex
                    items-start

                    gap-3
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
                    <Info
                      size={20}
                    />
                  </div>

                  <div className="min-w-0">
                    <h2
                      className="
                        text-base
                        sm:text-lg

                        font-bold

                        text-[#080E2F]
                        dark:text-white
                      "
                    >
                      Sobre o
                      dispositivo
                    </h2>

                    <p
                      className="
                        mt-2

                        text-sm
                        sm:text-base

                        text-gray-500
                        dark:text-gray-400

                        leading-relaxed
                        whitespace-pre-line
                      "
                    >
                      {device.descricao ||
                        "Nenhuma descrição cadastrada para este dispositivo."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENTAÇÃO */}
          {activeTab ===
            "documents" && (
            <div>
              <div
                className="
                  mb-5

                  flex
                  flex-col

                  gap-3

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="min-w-0">
                  <h2
                    className="
                      text-xl
                      sm:text-2xl

                      font-bold

                      text-[#080E2F]
                      dark:text-white
                    "
                  >
                    Documentação
                  </h2>

                  <p
                    className="
                      mt-1

                      max-w-3xl

                      text-sm
                      sm:text-base

                      text-gray-500
                      dark:text-gray-400

                      leading-relaxed
                    "
                  >
                    Manuais, fichas
                    técnicas e
                    documentos
                    vinculados ao
                    dispositivo.
                  </p>
                </div>

                <span
                  className="
                    w-fit
                    shrink-0

                    rounded-xl

                    border
                    border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

                    bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

                    px-4
                    py-2

                    text-sm
                    font-semibold

                    text-[var(--company-primary)]
                  "
                >
                  {documents.length}{" "}
                  documento
                  {documents.length !==
                  1
                    ? "s"
                    : ""}
                </span>
              </div>

              {documents.length ===
              0 ? (
                <div
                  className="
                    rounded-2xl

                    border
                    border-dashed
                    border-gray-300
                    dark:border-white/10

                    bg-gray-50
                    dark:bg-[#0d2238]

                    p-8

                    text-center

                    shadow-xl
                    dark:shadow-sm
                  "
                >
                  <div
                    className="
                      w-14
                      h-14

                      mx-auto
                      mb-4

                      rounded-2xl

                      bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                      text-[var(--company-primary)]

                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FileText
                      size={28}
                    />
                  </div>

                  <h3
                    className="
                      font-bold

                      text-[#080E2F]
                      dark:text-white
                    "
                  >
                    Nenhum documento
                    disponível
                  </h3>

                  <p
                    className="
                      mt-2

                      text-sm

                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Nenhum documento foi
                    vinculado a este
                    dispositivo.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map(
                    (
                      document,
                    ) => (
                      <article
                        key={
                          document.id
                        }
                        className="
                          rounded-2xl

                          border
                          border-gray-200
                          dark:border-white/10

                          bg-white
                          dark:bg-[#0d2238]

                          p-4

                          flex
                          flex-col

                          gap-4

                          lg:flex-row
                          lg:items-center
                          lg:justify-between

                          shadow-xl
                          dark:shadow-sm

                          transition-all

                          hover:border-[color-mix(in_srgb,var(--company-primary)_30%,transparent)]
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
                              size={23}
                            />
                          </div>

                          <div className="min-w-0">
                            <h3
                              className="
                                font-bold

                                text-[#080E2F]
                                dark:text-white

                                break-words
                              "
                            >
                              {
                                document.titulo
                              }
                            </h3>

                            {document.descricao && (
                              <p
                                className="
                                  mt-1

                                  text-sm

                                  text-gray-500
                                  dark:text-gray-400

                                  leading-relaxed
                                "
                              >
                                {
                                  document.descricao
                                }
                              </p>
                            )}

                            <p
                              className="
                                mt-1

                                text-xs
                                sm:text-sm

                                text-gray-400
                                dark:text-gray-500

                                break-all
                              "
                            >
                              {
                                document.nome_arquivo_original
                              }
                            </p>

                            <div
                              className="
                                mt-3

                                flex
                                flex-wrap

                                gap-2
                              "
                            >
                              <span
                                className="
                                  rounded-xl

                                  bg-gray-100
                                  dark:bg-white/10

                                  px-3
                                  py-1

                                  text-xs
                                  font-semibold

                                  text-gray-600
                                  dark:text-gray-300
                                "
                              >
                                {
                                  document.status
                                }
                              </span>

                              <span
                                className="
                                  rounded-xl

                                  bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

                                  px-3
                                  py-1

                                  text-xs
                                  font-semibold

                                  text-[var(--company-primary)]
                                "
                              >
                                {document.total_chunks ||
                                  0}{" "}
                                trechos IA
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            void handleDownloadDocument(
                              document,
                            )
                          }
                          disabled={
                            downloadingDocumentId ===
                            document.id
                          }
                          className="
                            w-full
                            lg:w-auto

                            min-h-[46px]

                            shrink-0

                            rounded-xl

                            bg-gradient-to-r
                            from-[var(--company-primary)]
                            to-[var(--company-secondary)]

                            px-5
                            py-3

                            text-sm
                            font-semibold

                            text-white

                            flex
                            items-center
                            justify-center

                            gap-2

                            shadow-xl

                            transition-all

                            hover:opacity-95

                            disabled:opacity-60
                            disabled:cursor-not-allowed
                          "
                        >
                          {downloadingDocumentId ===
                          document.id ? (
                            <Loader2
                              size={18}
                              className="
                                animate-spin
                              "
                            />
                          ) : (
                            <Download
                              size={18}
                            />
                          )}

                          {downloadingDocumentId ===
                          document.id
                            ? "Baixando..."
                            : "Baixar"}
                        </button>
                      </article>
                    ),
                  )}
                </div>
              )}
            </div>
          )}

          {/* SUPORTE IA */}
          {activeTab ===
            "support" && (
            <div
              className="
                overflow-hidden

                rounded-2xl
                sm:rounded-3xl

                border
                border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

                bg-[color-mix(in_srgb,var(--company-primary)_5%,transparent)]

                p-5
                sm:p-6
                lg:p-8

                shadow-2xl
                dark:shadow-sm
              "
            >
              <div
                className="
                  w-14
                  h-14

                  sm:w-16
                  sm:h-16

                  rounded-2xl

                  bg-gradient-to-br
                  from-[var(--company-primary)]
                  to-[var(--company-secondary)]

                  text-white

                  flex
                  items-center
                  justify-center

                  shadow-xl
                "
              >
                <MessageCircle
                  size={30}
                />
              </div>

              <h2
                className="
                  mt-5

                  text-xl
                  sm:text-2xl

                  font-bold

                  text-[#080E2F]
                  dark:text-white
                "
              >
                Suporte IA
              </h2>

              <p
                className="
                  mt-3

                  max-w-2xl

                  text-sm
                  sm:text-base

                  text-gray-500
                  dark:text-gray-400

                  leading-relaxed
                "
              >
                Converse com o agente
                técnico para tirar
                dúvidas sobre
                instalação,
                configuração,
                operação e
                documentação deste
                dispositivo.
              </p>

              <div
                className="
                  mt-5

                  rounded-2xl

                  border
                  border-gray-200
                  dark:border-white/10

                  bg-white/70
                  dark:bg-[#091a2c]/70

                  p-4

                  flex
                  items-start

                  gap-3
                "
              >
                <BotMessageSquare
                  size={21}
                  className="
                    mt-0.5

                    shrink-0

                    text-[var(--company-primary)]
                  "
                />

                <p
                  className="
                    text-sm

                    text-gray-600
                    dark:text-gray-300

                    leading-relaxed
                  "
                >
                  O agente utiliza a
                  documentação técnica
                  vinculada aos
                  dispositivos para
                  apoiar as respostas.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/support",
                  )
                }
                className="
                  mt-6

                  w-full
                  sm:w-auto

                  min-h-[48px]

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

                  shadow-2xl

                  transition-all

                  hover:opacity-95
                "
              >
                <BotMessageSquare
                  size={20}
                />

                Abrir suporte IA
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

interface DeviceDetailTabButtonProps {
  active: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

function DeviceDetailTabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: DeviceDetailTabButtonProps) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        flex
        items-center

        gap-2

        border-b-[3px]

        px-4
        py-4

        font-semibold

        transition-all

        ${
          active
            ? `
                border-[var(--company-primary)]

                text-[var(--company-primary)]
              `
            : `
                border-transparent

                text-gray-500
                dark:text-gray-400

                hover:text-[var(--company-primary)]
              `
        }
      `}
    >
      <Icon
        size={19}
      />

      {label}
    </button>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      className="
        min-w-0

        rounded-2xl

        border
        border-gray-200
        dark:border-white/10

        bg-gray-50
        dark:bg-[#0d2238]

        p-4
        sm:p-5

        shadow-xl
        dark:shadow-sm
      "
    >
      <p
        className="
          text-sm

          text-gray-500
          dark:text-gray-400
        "
      >
        {title}
      </p>

      <strong
        className="
          block

          mt-2

          text-base
          sm:text-lg

          text-[#080E2F]
          dark:text-white

          break-words
        "
      >
        {value}
      </strong>
    </div>
  );
}