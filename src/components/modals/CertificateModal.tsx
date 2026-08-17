import {
  Award,
  Calendar,
  Clock3,
  Download,
  ExternalLink,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  downloadCertificatePdf,
} from "../../services/certificateService";

interface Props {
  isOpen: boolean;
  onClose: () => void;

  certificateId:
    | number
    | null;

  certificateTitle: string;
  studentName: string;
  emitidoEm: string;
  validUntil: string;

  status:
    | "valido"
    | "expirado"
    | "revogado";

  revokedAt: string | null;
  revocationReason: string | null;

  validationCode?: string;

  workload: string;
}

export default function CertificateModal({
  isOpen,
  onClose,
  certificateId,
  certificateTitle,
  studentName,
  emitidoEm,
  validUntil,
  status,
  revokedAt,
  revocationReason,
  validationCode,
  workload,
}: Props) {
  const [
    isDownloading,
    setIsDownloading,
  ] = useState(false);

  if (!isOpen) {
    return null;
  }

  const isRevoked =
    status === "revogado";

  const statusLabel =
    status === "valido"
      ? "Válido"
      : status === "expirado"
        ? "Expirado"
        : "Revogado";

  const statusTone =
    status === "valido"
      ? "success"
      : status === "expirado"
        ? "warning"
        : "danger";

  const qrCodeData =
    validationCode
      ? `${window.location.origin}/validar/${validationCode}`
      : String(
          certificateId,
        );

  const qrCodeUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      qrCodeData,
    )}`;

  async function handleDownload() {
    if (
      !certificateId ||
      isRevoked
    ) {
      return;
    }

    try {
      setIsDownloading(
        true,
      );

      const blob =
        await downloadCertificatePdf(
          certificateId,
        );

      const url =
        window.URL.createObjectURL(
          new Blob([
            blob,
          ]),
        );

      const link =
        document.createElement(
          "a",
        );

      link.href = url;

      link.setAttribute(
        "download",
        `Certificado-${certificateTitle.replace(
          /\s+/g,
          "-",
        )}.pdf`,
      );

      document.body.appendChild(
        link,
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url,
      );
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao baixar o certificado.",
      );
    } finally {
      setIsDownloading(
        false,
      );
    }
  }

  return (
    <div
      className="
        fixed
        inset-0

        z-[999]

        flex
        items-center
        justify-center

        bg-black/70
        backdrop-blur-sm

        p-2
        sm:p-4
        lg:p-6
      "
    >
      <div
        className="
          w-full
          max-w-5xl

          max-h-[96dvh]
          sm:max-h-[92dvh]

          overflow-hidden

          rounded-2xl
          sm:rounded-3xl

          border
          border-gray-200
          dark:border-white/10

          bg-white
          dark:bg-[#091a2c]

          shadow-2xl

          flex
          flex-col
        "
      >
        {/* HEADER */}
        <div
          className="
            sticky
            top-0

            z-20

            flex
            items-start
            justify-between

            gap-3
            sm:gap-4

            border-b
            border-gray-200
            dark:border-white/10

            bg-white/95
            dark:bg-[#091a2c]/95

            backdrop-blur-xl

            p-4
            sm:p-5
            lg:p-6
          "
        >
          <div
            className="
              min-w-0

              flex
              items-start

              gap-3
              sm:gap-4
            "
          >
            <div
              className="
                w-11
                h-11

                sm:w-12
                sm:h-12

                rounded-2xl

                bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                flex
                items-center
                justify-center

                shrink-0
              "
            >
              <Award
                size={25}
                className="
                  text-[var(--company-primary)]
                "
              />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-lg
                  sm:text-xl
                  lg:text-2xl

                  font-bold

                  text-[#080E2F]
                  dark:text-white

                  leading-tight
                "
              >
                Detalhes do
                Certificado
              </h2>

              <p
                className="
                  mt-1

                  text-xs
                  sm:text-sm
                  lg:text-base

                  text-gray-500
                  dark:text-gray-400

                  leading-relaxed
                "
              >
                Visualize e baixe
                seu documento
                oficial.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            aria-label="Fechar certificado"
            className="
              w-10
              h-10

              rounded-xl

              flex
              items-center
              justify-center

              shrink-0

              bg-gray-100
              dark:bg-white/10

              text-gray-500
              dark:text-gray-300

              transition-all

              hover:bg-red-500/10
              hover:text-red-500
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div
          className="
            flex-1

            overflow-y-auto

            p-4
            sm:p-5
            lg:p-6
          "
        >
          <div
            className="
              flex
              flex-col

              gap-5
              sm:gap-6
            "
          >
            {/* PREVIEW DO CERTIFICADO */}
            <div
              className="
                relative

                w-full

                overflow-hidden

                rounded-xl
                sm:rounded-2xl

                border
                border-gray-300

                bg-white

                aspect-[1.414]

                shadow-2xl
              "
            >
              <img
                src="/certificado_bg.png"
                alt="Modelo do certificado"
                className="
                  absolute
                  inset-0

                  w-full
                  h-full

                  object-cover
                "
              />

              {/* NOME DO ALUNO */}
              <div
                className="
                  absolute

                  top-[43%]
                  left-[58%]

                  -translate-x-1/2
                  -translate-y-1/2

                  w-full

                  px-5
                  sm:px-8
                  lg:px-12

                  text-center
                "
              >
                <p
                  className="
                    text-xs

                    min-[430px]:text-sm

                    sm:text-xl
                    md:text-2xl
                    lg:text-3xl
                    xl:text-4xl

                    font-bold

                    text-[#1C2B4B]

                    leading-tight

                    line-clamp-1
                  "
                >
                  {studentName}
                </p>
              </div>

              {/* NOME DO CURSO */}
              <div
                className="
                  absolute

                  top-[65%]
                  left-[59%]

                  -translate-x-1/2
                  -translate-y-1/2

                  w-full

                  px-5
                  sm:px-8
                  lg:px-12

                  text-center
                "
              >
                <p
                  className="
                    text-[8px]

                    min-[430px]:text-[10px]

                    sm:text-sm
                    md:text-base
                    lg:text-lg
                    xl:text-xl

                    text-[#444444]

                    leading-tight

                    line-clamp-2
                  "
                >
                  {
                    certificateTitle
                  }
                </p>
              </div>
            </div>

            {/* INFORMAÇÕES */}
            <div
              className="
                grid
                grid-cols-1

                sm:grid-cols-2
                lg:grid-cols-4

                gap-4

                rounded-2xl

                border
                border-gray-200
                dark:border-white/5

                bg-gray-50
                dark:bg-[#0d2238]

                p-4
                sm:p-5

                shadow-xl
                dark:shadow-sm
              "
            >
              <CertificateInfo
                icon={Calendar}
                title="Data de Conclusão"
                value={
                  emitidoEm ||
                  "Não informada"
                }
              />

              <CertificateInfo
                icon={
                  ShieldCheck
                }
                title="Validade"
                value={
                  validUntil
                    ? `Até ${validUntil}`
                    : "Não informada"
                }
                tone={
                  statusTone
                }
              />

              <CertificateInfo
                icon={Clock3}
                title="Carga Horária"
                value={
                  workload ||
                  "Não informada"
                }
              />

              <CertificateInfo
                icon={
                  status ===
                  "revogado"
                    ? ShieldAlert
                    : status ===
                        "expirado"
                      ? Clock3
                      : ShieldCheck
                }
                title="Status"
                value={
                  statusLabel
                }
                tone={
                  statusTone
                }
              />
            </div>

            {/* INFORMAÇÕES DA REVOGAÇÃO */}
            {isRevoked && (
              <div
                className="
                  rounded-2xl

                  border
                  border-red-200
                  dark:border-red-500/20

                  bg-red-50
                  dark:bg-red-500/10

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
                      rounded-xl

                      bg-red-100
                      dark:bg-red-500/15

                      p-2

                      text-red-600
                      dark:text-red-400

                      shrink-0
                    "
                  >
                    <ShieldAlert
                      className="
                        w-5
                        h-5
                      "
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        font-semibold

                        text-red-700
                        dark:text-red-300
                      "
                    >
                      Certificado revogado
                    </p>

                    <p
                      className="
                        mt-1

                        text-sm

                        text-red-600
                        dark:text-red-400
                      "
                    >
                      Este certificado não pode mais ser usado como comprovante e o download foi bloqueado.
                    </p>

                    <div
                      className="
                        mt-4

                        grid
                        grid-cols-1
                        sm:grid-cols-2

                        gap-3
                      "
                    >
                      <div>
                        <p
                          className="
                            text-xs
                            font-medium

                            uppercase
                            tracking-wider

                            text-red-500
                            dark:text-red-400
                          "
                        >
                          Data da revogação
                        </p>

                        <p
                          className="
                            mt-1

                            text-sm
                            font-semibold

                            text-red-800
                            dark:text-red-200
                          "
                        >
                          {revokedAt ||
                            "Não informada"}
                        </p>
                      </div>

                      <div>
                        <p
                          className="
                            text-xs
                            font-medium

                            uppercase
                            tracking-wider

                            text-red-500
                            dark:text-red-400
                          "
                        >
                          Motivo
                        </p>

                        <p
                          className="
                            mt-1

                            text-sm
                            font-semibold

                            text-red-800
                            dark:text-red-200

                            break-words
                          "
                        >
                          {revocationReason ||
                            "Não informado"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VALIDAÇÃO */}
            {validationCode && (
              <div
                className="
                  rounded-2xl

                  border
                  border-gray-200
                  dark:border-white/5

                  bg-gray-50
                  dark:bg-[#0d2238]

                  p-4
                  sm:p-5

                  flex
                  flex-col

                  gap-5
                  sm:gap-6

                  sm:flex-row
                  sm:items-center
                  sm:justify-between

                  shadow-xl
                  dark:shadow-sm
                "
              >
                <div
                  className="
                    min-w-0

                    flex
                    flex-col

                    gap-4
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
                        p-2

                        rounded-xl

                        bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                        text-[var(--company-primary)]

                        shrink-0
                      "
                    >
                      <ShieldCheck
                        className="
                          w-5
                          h-5
                        "
                      />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          text-xs

                          font-medium

                          uppercase
                          tracking-wider

                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Código de
                        Validação
                      </p>

                      <p
                        className="
                          mt-1

                          text-sm
                          sm:text-base

                          font-bold
                          font-mono

                          text-[#080E2F]
                          dark:text-white

                          break-all
                        "
                      >
                        {
                          validationCode
                        }
                      </p>
                    </div>
                  </div>

                  <a
                    href={`/validar/${validationCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      w-full
                      sm:w-fit

                      min-h-[44px]

                      rounded-xl

                      border
                      border-[color-mix(in_srgb,var(--company-primary)_25%,transparent)]

                      bg-white
                      dark:bg-transparent

                      px-4
                      py-2.5

                      text-sm
                      font-semibold

                      text-[var(--company-primary)]

                      flex
                      items-center
                      justify-center

                      gap-2

                      transition-all

                      hover:bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]
                    "
                  >
                    Verificar
                    Autenticidade

                    <ExternalLink
                      className="
                        w-4
                        h-4
                      "
                    />
                  </a>
                </div>

                {/* QR CODE */}
                <div
                  className="
                    mx-auto
                    sm:mx-0

                    w-fit

                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-white

                    p-2

                    shrink-0

                    shadow-lg
                  "
                >
                  <img
                    src={
                      qrCodeUrl
                    }
                    alt="QR Code de Validação"
                    className="
                      w-24
                      h-24

                      sm:w-28
                      sm:h-28

                      object-contain

                      rounded-lg
                    "
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            sticky
            bottom-0

            z-20

            flex
            flex-col-reverse

            gap-3

            sm:flex-row
            sm:justify-end

            border-t
            border-gray-200
            dark:border-white/10

            bg-white/95
            dark:bg-[#091a2c]/95

            backdrop-blur-xl

            p-4
            sm:p-5
            lg:p-6
          "
        >
          <button
            type="button"
            onClick={
              onClose
            }
            className="
              min-h-[48px]

              w-full
              sm:w-auto

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#0d2238]

              px-5
              py-3

              font-medium

              text-gray-600
              dark:text-gray-300

              transition-all

              hover:bg-gray-100
              dark:hover:bg-white/5
            "
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={() =>
              void handleDownload()
            }
            disabled={
              isDownloading ||
              isRevoked
            }
            title={
              isRevoked
                ? "Certificados revogados não podem ser baixados."
                : undefined
            }
            className={`
              min-h-[48px]

              w-full
              sm:w-auto

              rounded-2xl

              px-6
              py-3

              font-semibold

              text-white

              flex
              items-center
              justify-center

              gap-2

              shadow-2xl

              transition-all

              disabled:opacity-60
              disabled:cursor-not-allowed

              ${
                isRevoked
                  ? `
                      bg-gray-400
                      dark:bg-gray-600
                    `
                  : `
                      bg-gradient-to-r
                      from-[var(--company-primary)]
                      to-[var(--company-secondary)]

                      hover:opacity-95
                    `
              }
            `}
          >
            {isDownloading ? (
              <Loader2
                size={20}
                className="
                  animate-spin
                "
              />
            ) : isRevoked ? (
              <ShieldAlert
                size={20}
              />
            ) : (
              <Download
                size={20}
              />
            )}

            {isDownloading
              ? "Baixando..."
              : isRevoked
                ? "Download bloqueado"
              : "Baixar PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface CertificateInfoProps {
  icon:
    typeof Calendar;

  title: string;
  value: string;

  tone?:
    | "default"
    | "success"
    | "warning"
    | "danger";
}

function CertificateInfo({
  icon: Icon,
  title,
  value,
  tone = "default",
}: CertificateInfoProps) {
  const toneClass =
    tone === "success"
      ? "text-green-600 dark:text-green-400"
      : tone === "warning"
        ? "text-amber-600 dark:text-amber-400"
        : tone === "danger"
          ? "text-red-600 dark:text-red-400"
          : "text-[var(--company-primary)]";

  return (
    <div
      className="
        min-w-0

        flex
        items-start

        gap-3
      "
    >
      <Icon
        size={20}
        className={`
          mt-0.5

          shrink-0

          ${toneClass}
        `}
      />

      <div className="min-w-0">
        <p
          className="
            text-sm

            text-gray-500
            dark:text-gray-400
          "
        >
          {title}
        </p>

        <p
          className={`
            mt-1

            font-semibold

            break-words

            ${
              tone === "default"
                ? `
                    text-[#080E2F]
                    dark:text-white
                  `
                : toneClass
            }
          `}
        >
          {value}
        </p>
      </div>
    </div>
  );
}