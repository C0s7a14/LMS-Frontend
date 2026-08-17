import {
  Award,
  BadgeCheck,
  Calendar,
  Clock3,
  Copy,
  Loader2,
  ShieldAlert,
  User,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  validateCertificateCode,
} from "../../services/certificateService";

interface ValidatedCertificate {
  found?: boolean;
  isValid?: boolean;
  validation_code: string;
  curso_titulo: string;
  student_name: string;
  emitido_em: string;
  validade_ate: string;
  status_certificado:
    | "valido"
    | "expirado"
    | "revogado";
  revogado_em: string | null;
  motivo_revogacao: string | null;
  workload: string;
}

export default function CertificateDetails() {
  const {
    certificateId,
  } = useParams<{
    certificateId: string;
  }>();

  const [
    certificate,
    setCertificate,
  ] =
    useState<ValidatedCertificate | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(false);

  const [
    copied,
    setCopied,
  ] = useState(false);

  useEffect(() => {
    async function fetchValidation() {
      if (!certificateId) {
        setError(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(false);

        const data =
          await validateCertificateCode(
            certificateId,
          );

        if (data.found === false) {
          setError(true);
          return;
        }

        setCertificate(
          data,
        );
      } catch (err) {
        console.error(
          "Erro ao validar certificado:",
          err,
        );

        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchValidation();
  }, [
    certificateId,
  ]);

  async function copyCode() {
    if (!certificate) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        certificate.validation_code,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Erro ao copiar código:",
        error,
      );
    }
  }

  if (isLoading) {
    return (
      <div
        className="
          min-h-[100dvh]

          flex
          flex-col
          items-center
          justify-center

          gap-4

          bg-gray-50
          dark:bg-[#071827]

          px-4
          py-8

          transition-colors
        "
      >
        <div
          className="
            w-full
            max-w-md

            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            p-6
            sm:p-8

            flex
            flex-col
            items-center

            text-center

            shadow-2xl
            dark:shadow-sm
          "
        >
          <Loader2
            className="
              w-10
              h-10

              animate-spin

              text-[var(--company-primary)]
            "
          />

          <h2
            className="
              mt-4

              text-lg
              sm:text-xl

              font-semibold

              text-[#080E2F]
              dark:text-white
            "
          >
            Verificando certificado
          </h2>

          <p
            className="
              mt-2

              text-sm
              sm:text-base

              text-gray-500
              dark:text-gray-400
            "
          >
            Verificando a autenticidade
            do documento...
          </p>
        </div>
      </div>
    );
  }

  if (
    error ||
    !certificate
  ) {
    return (
      <main
        className="
          min-h-[100dvh]

          flex
          items-center
          justify-center

          bg-gray-50
          dark:bg-[#071827]

          px-4
          py-8

          transition-colors
        "
      >
        <div
          className="
            w-full
            max-w-lg

            rounded-2xl
            sm:rounded-3xl

            border
            border-red-200
            dark:border-red-900/30

            bg-white
            dark:bg-[#091a2c]

            p-6
            sm:p-8

            text-center

            shadow-2xl
            dark:shadow-sm
          "
        >
          <div
            className="
              w-16
              h-16

              sm:w-20
              sm:h-20

              mx-auto
              mb-5
              sm:mb-6

              rounded-full

              bg-red-100
              dark:bg-red-500/20

              text-red-600
              dark:text-red-400

              flex
              items-center
              justify-center
            "
          >
            <ShieldAlert
              size={38}
            />
          </div>

          <h1
            className="
              text-2xl
              sm:text-3xl

              font-bold

              text-[#080E2F]
              dark:text-white
            "
          >
            Certificado Inválido
          </h1>

          <p
            className="
              mt-3

              text-sm
              sm:text-base

              text-gray-600
              dark:text-gray-400

              leading-relaxed
            "
          >
            Não encontramos um
            certificado autêntico com
            o código informado.
            Verifique se o link ou o
            código de validação está
            correto.
          </p>

          <div
            className="
              mt-6

              rounded-xl

              border
              border-gray-200
              dark:border-white/10

              bg-gray-100
              dark:bg-black/20

              p-4

              font-mono
              text-sm

              text-gray-500
              dark:text-gray-400

              break-all
            "
          >
            Código buscado:{" "}
            {certificateId ||
              "Não informado"}
          </div>
        </div>
      </main>
    );
  }

  const formattedIssueDate =
    formatCertificateDate(
      certificate.emitido_em,
    );

  const formattedValidDate =
    formatCertificateDate(
      certificate.validade_ate,
    );

  const formattedRevokedDate =
    formatCertificateDate(
      certificate.revogado_em,
    );

  const statusConfig =
    certificate.status_certificado ===
    "revogado"
      ? {
          title:
            "CERTIFICADO REVOGADO",
          description:
            "Este certificado é autêntico, mas foi revogado pela instituição emissora e não possui mais validade.",
          bannerClass:
            "bg-red-600 dark:bg-red-700",
          descriptionClass:
            "text-red-50",
          icon: ShieldAlert,
          tone: "danger" as const,
        }
      : certificate.status_certificado ===
          "expirado"
        ? {
            title:
              "CERTIFICADO EXPIRADO",
            description:
              "Este certificado é autêntico, mas seu período de validade já terminou. Ele permanece disponível como histórico.",
            bannerClass:
              "bg-amber-500 dark:bg-amber-600",
            descriptionClass:
              "text-amber-50",
            icon: Clock3,
            tone: "warning" as const,
          }
        : {
            title:
              "CERTIFICADO VÁLIDO E AUTÊNTICO",
            description:
              "Este documento foi verificado eletronicamente e consta como válido no sistema da instituição emissora.",
            bannerClass:
              "bg-green-600 dark:bg-green-700",
            descriptionClass:
              "text-green-50",
            icon: BadgeCheck,
            tone: "success" as const,
          };

  const StatusIcon =
    statusConfig.icon;

  return (
    <main
      className="
        min-h-[100dvh]

        bg-gray-50
        dark:bg-[#071827]

        px-4
        py-6

        sm:px-6
        sm:py-8

        lg:px-10
        lg:py-10

        transition-colors
      "
    >
      <div
        className="
          w-full
          max-w-[1200px]

          mx-auto

          space-y-6
          sm:space-y-8
        "
      >
        {/* STATUS */}
        <section
          className={`
            rounded-2xl
            sm:rounded-3xl

            p-5
            sm:p-6
            lg:p-8

            flex
            flex-col

            items-center

            gap-4
            sm:gap-5

            sm:flex-row
            sm:items-start

            text-white

            shadow-2xl

            ${statusConfig.bannerClass}
          `}
        >
          <div
            className="
              rounded-full

              bg-white/20

              p-3
              sm:p-4

              shrink-0
            "
          >
            <StatusIcon
              size={38}
              className="
                text-white
              "
            />
          </div>

          <div
            className="
              min-w-0

              text-center
              sm:text-left
            "
          >
            <h1
              className="
                text-xl
                sm:text-2xl
                lg:text-3xl

                font-bold

                tracking-wide
              "
            >
              {statusConfig.title}
            </h1>

            <p
              className={`
                mt-2

                text-sm
                sm:text-base
                lg:text-lg

                leading-relaxed

                ${statusConfig.descriptionClass}
              `}
            >
              {statusConfig.description}
            </p>
          </div>
        </section>

        {/* CONTEÚDO */}
        <div
          className="
            grid
            grid-cols-1

            gap-6
            lg:gap-8

            lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,1fr)]

            items-start
          "
        >
          {/* CERTIFICADO */}
          <section
            className="
              min-w-0
            "
          >
            <div
              className="
                rounded-2xl
                sm:rounded-3xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#091a2c]

                p-2
                sm:p-4

                shadow-2xl
                dark:shadow-sm
              "
            >
              <BigCertificatePreview
                studentName={
                  certificate.student_name
                }
                courseTitle={
                  certificate.curso_titulo
                }
              />
            </div>
          </section>

          {/* DETALHES */}
          <section
            className="
              min-w-0

              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-4
              sm:p-6
              lg:p-8

              shadow-2xl
              dark:shadow-sm
            "
          >
            <h2
              className="
                border-b
                border-gray-100
                dark:border-white/10

                pb-4
                mb-4

                text-xl
                sm:text-2xl

                font-bold

                text-[#080E2F]
                dark:text-white
              "
            >
              Detalhes do Documento
            </h2>

            <div>
              <CertificateDetailRow
                icon={User}
                label="Aluno(a)"
                value={
                  certificate.student_name
                }
              />

              <CertificateDetailRow
                icon={Award}
                label="Curso"
                value={
                  certificate.curso_titulo
                }
              />

              <CertificateDetailRow
                icon={Calendar}
                label="Emitido em"
                value={
                  formattedIssueDate
                }
              />

              <CertificateDetailRow
                icon={BadgeCheck}
                label={
                  certificate.status_certificado ===
                  "revogado"
                    ? "Validade original"
                    : "Válido até"
                }
                value={
                  formattedValidDate
                }
                tone={
                  certificate.status_certificado ===
                  "revogado"
                    ? "default"
                    : statusConfig.tone
                }
              />

              {certificate.status_certificado ===
                "revogado" && (
                <>
                  <CertificateDetailRow
                    icon={Calendar}
                    label="Revogado em"
                    value={
                      formattedRevokedDate
                    }
                    tone="danger"
                  />

                  <CertificateDetailRow
                    icon={ShieldAlert}
                    label="Motivo da revogação"
                    value={
                      certificate.motivo_revogacao ||
                      "Não informado"
                    }
                    tone="danger"
                  />
                </>
              )}

              <CertificateDetailRow
                icon={Clock3}
                label="Carga horária"
                value={
                  certificate.workload ||
                  "Não especificada"
                }
              />
            </div>

            {/* CÓDIGO */}
            <div
              className="
                mt-8

                rounded-2xl

                border
                border-gray-200
                dark:border-white/5

                bg-gray-50
                dark:bg-[#0d2238]

                p-4
                sm:p-6

                text-center

                shadow-xl
                dark:shadow-sm
              "
            >
              <p
                className="
                  text-xs
                  sm:text-sm

                  font-semibold

                  uppercase
                  tracking-widest

                  text-gray-500
                  dark:text-gray-400
                "
              >
                Código de Validação
              </p>

              <p
                className="
                  mt-3

                  text-lg
                  sm:text-xl
                  lg:text-2xl

                  font-bold
                  font-mono

                  text-[#080E2F]
                  dark:text-white

                  break-all
                "
              >
                {
                  certificate.validation_code
                }
              </p>

              <button
                type="button"
                onClick={() =>
                  void copyCode()
                }
                className="
                  mt-5

                  min-h-[48px]

                  w-full

                  rounded-xl

                  border
                  border-[color-mix(in_srgb,var(--company-primary)_25%,transparent)]

                  bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]

                  px-5
                  py-3

                  flex
                  items-center
                  justify-center

                  gap-2

                  font-semibold

                  text-[var(--company-primary)]

                  transition-all

                  hover:bg-[color-mix(in_srgb,var(--company-primary)_13%,transparent)]
                "
              >
                {copied ? (
                  <BadgeCheck
                    size={20}
                  />
                ) : (
                  <Copy
                    size={20}
                  />
                )}

                {copied
                  ? "Código copiado"
                  : "Copiar código"}
              </button>
            </div>
          </section>
        </div>

        {/* RODAPÉ INFORMATIVO */}
        <section
          className="
            rounded-2xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            p-4
            sm:p-5

            flex
            items-start

            gap-3

            shadow-2xl
            dark:shadow-sm
          "
        >
          <StatusIcon
            size={22}
            className={`
              mt-0.5

              shrink-0

              ${
                certificate.status_certificado ===
                "revogado"
                  ? "text-red-600 dark:text-red-400"
                  : certificate.status_certificado ===
                      "expirado"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-green-600 dark:text-green-400"
              }
            `}
          />

          <p
            className="
              text-sm
              sm:text-base

              text-gray-600
              dark:text-gray-400

              leading-relaxed
            "
          >
            {certificate.status_certificado ===
            "revogado"
              ? "A autenticidade deste certificado foi confirmada, mas sua revogação está registrada na plataforma."
              : certificate.status_certificado ===
                  "expirado"
                ? "A autenticidade deste certificado foi confirmada. O documento permanece registrado como histórico, embora sua validade tenha expirado."
                : "A autenticidade deste certificado foi confirmada através do código de validação registrado na plataforma."}
          </p>
        </section>
      </div>
    </main>
  );
}

function BigCertificatePreview({
  studentName,
  courseTitle,
}: {
  studentName: string;
  courseTitle: string;
}) {
  return (
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

      {/* NOME */}
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

      {/* CURSO */}
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
          {courseTitle}
        </p>
      </div>
    </div>
  );
}

interface CertificateDetailRowProps {
  icon: LucideIcon;

  label: string;
  value: string;

  tone?:
    | "default"
    | "success"
    | "warning"
    | "danger";
}

function CertificateDetailRow({
  icon: Icon,
  label,
  value,
  tone = "default",
}: CertificateDetailRowProps) {
  const isSuccess =
    tone === "success";

  const isWarning =
    tone === "warning";

  const isDanger =
    tone === "danger";

  return (
    <div
      className="
        flex
        flex-col

        gap-2

        border-b
        border-gray-100
        dark:border-white/5

        py-4

        last:border-0

        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:gap-5
      "
    >
      <div
        className="
          min-w-0

          flex
          items-center

          gap-3

          text-gray-500
          dark:text-gray-400
        "
      >
        <div
          className={`
            p-2

            rounded-lg

            shrink-0

            ${
              isSuccess
                ? `
                    bg-green-500/10
                  `
                : isWarning
                  ? `
                      bg-amber-500/10
                    `
                  : isDanger
                    ? `
                        bg-red-500/10
                      `
                : `
                    bg-[color-mix(in_srgb,var(--company-primary)_8%,transparent)]
                  `
            }
          `}
        >
          <Icon
            size={20}
            className={
              isSuccess
                ? `
                    text-green-600
                    dark:text-green-400
                  `
                : isWarning
                  ? `
                      text-amber-600
                      dark:text-amber-400
                    `
                  : isDanger
                    ? `
                        text-red-600
                        dark:text-red-400
                      `
                : `
                    text-[var(--company-primary)]
                  `
            }
          />
        </div>

        <span
          className="
            font-medium
          "
        >
          {label}
        </span>
      </div>

      <strong
        className={`
          min-w-0

          text-base
          sm:text-right

          break-words

          ${
            isSuccess
              ? `
                  text-green-600
                  dark:text-green-400
                `
              : isWarning
                ? `
                    text-amber-600
                    dark:text-amber-400
                  `
                : isDanger
                  ? `
                      text-red-600
                      dark:text-red-400
                    `
              : `
                  text-[#080E2F]
                  dark:text-white
                `
          }
        `}
      >
        {value}
      </strong>
    </div>
  );
}

function formatCertificateDate(
  value: string | null,
) {
  if (!value) {
    return "Não informada";
  }

  const dateOnlyMatch =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value,
    );

  if (dateOnlyMatch) {
    const [
      ,
      year,
      month,
      day,
    ] = dateOnlyMatch;

    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);

  return Number.isNaN(
    date.getTime(),
  )
    ? "Não informada"
    : date.toLocaleDateString(
        "pt-BR",
      );
}
