import {
  Award,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  Grid3X3,
  Info,
  List,
  Loader2,
  Monitor,
  Search,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCertificates,
  downloadCertificatePdf,
} from "../../services/certificateService";

import CertificateModal from "../../components/modals/CertificateModal";

import {
  useCompany,
} from "../../contexts/CompanyContext";

interface CertificateType {
  dbId: number;
  id: string;

  title: string;

  conclusionDate: string;
  validUntil: string;

  status:
    | "valido"
    | "expirado"
    | "revogado";

  revokedAt: string | null;
  revocationReason: string | null;

  score: number | null;

  workload: string;

  icon:
    | "monitor"
    | "wrench"
    | "award";
}

interface CertificateApiType {
  id?: number;

  validation_code?: string;

  curso_titulo?: string;
  curso_id?: number | string;

  emitido_em?: string | null;
  validade_ate?: string | null;

  status_certificado?:
    | "valido"
    | "expirado"
    | "revogado";

  revogado_em?: string | null;

  motivo_revogacao?:
    | string
    | null;

  nota_final?:
    | number
    | string
    | null;

  carga_horaria?:
    | number
    | string;
}

function getUserFromStorage() {
  return JSON.parse(
    localStorage.getItem("user") ||
      "{}",
  );
}

function formatApiDate(
  date?: string | null,
) {
  if (!date) {
    return "Não informada";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "Não informada";
  }

  return parsedDate.toLocaleDateString(
    "pt-BR",
  );
}

export default function Certificates() {
  const {
    company,
  } = useCompany();

  const [
    certificates,
    setCertificates,
  ] = useState<
    CertificateType[]
  >([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    viewMode,
    setViewMode,
  ] = useState<
    "grid" | "list"
  >("grid");

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    selectedCert,
    setSelectedCert,
  ] =
    useState<CertificateType | null>(
      null,
    );

  const user =
    getUserFromStorage();

  const academyName =
    company?.configuracao
      ?.nomeAmbiente ||
    company?.nomeFantasia ||
    "Plataforma de Treinamento";

  useEffect(() => {
    async function fetchMyCertificates() {
      try {
        const data =
          await getCertificates();

        const safeData:
          CertificateApiType[] =
          Array.isArray(data)
            ? data
            : [];

        const formattedCertificates:
          CertificateType[] =
          safeData.map(
            (
              cert,
            ) => {
              const parsedScore =
                Number(
                  cert.nota_final,
                );

              const score =
                cert.nota_final ===
                  null ||
                cert.nota_final ===
                  undefined ||
                Number.isNaN(
                  parsedScore,
                )
                  ? null
                  : parsedScore;

              return {
                dbId:
                  cert.id || 0,

                id:
                  cert.validation_code ||
                  "Código Indisponível",

                title:
                  cert.curso_titulo ||
                  `Curso de ID: ${
                    cert.curso_id ||
                    "Desconhecido"
                  }`,

                conclusionDate:
                  formatApiDate(
                    cert.emitido_em,
                  ),

                validUntil:
                  formatApiDate(
                    cert.validade_ate,
                  ),

                status:
                  cert.status_certificado ||
                  "valido",

                revokedAt:
                  cert.revogado_em
                    ? formatApiDate(
                        cert.revogado_em,
                      )
                    : null,

                revocationReason:
                  cert.motivo_revogacao ||
                  null,

                score,

                workload:
                  cert.carga_horaria
                    ? `${cert.carga_horaria} Horas`
                    : "0 Horas",

                icon:
                  "award" as const,
              };
            },
          );

        setCertificates(
          formattedCertificates,
        );
      } catch (error) {
        console.error(
          "Erro ao buscar certificados:",
          error,
        );

        setCertificates([]);
      } finally {
        setIsLoading(
          false,
        );
      }
    }

    void fetchMyCertificates();
  }, []);

  async function handleDownload(
    dbId: number,
    title: string,
    status:
      CertificateType["status"],
  ) {
    if (
      status ===
      "revogado"
    ) {
      alert(
        "Este certificado foi revogado e não pode mais ser baixado.",
      );

      return;
    }

    try {
      const blob =
        await downloadCertificatePdf(
          dbId,
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
        `Certificado-${title.replace(
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
    }
  }

  const searchTerm =
    search
      .trim()
      .toLowerCase();

  const filteredCertificates =
    useMemo(() => {
      return certificates.filter(
        (
          certificate,
        ) =>
          (
            certificate.title ||
            ""
          )
            .toLowerCase()
            .includes(
              searchTerm,
            ) ||
          (
            certificate.id ||
            ""
          )
            .toLowerCase()
            .includes(
              searchTerm,
            ),
      );
    }, [
      searchTerm,
      certificates,
    ]);

  const featuredCertificate =
    filteredCertificates[0];

  const otherCertificates =
    filteredCertificates.slice(
      1,
    );

  const averageScore =
    useMemo(() => {
      const scores =
        certificates
          .map(
            (
              certificate,
            ) =>
              certificate.score,
          )
          .filter(
            (
              score,
            ): score is number =>
              score !== null,
          );

      if (
        scores.length === 0
      ) {
        return null;
      }

      const total =
        scores.reduce(
          (
            sum,
            score,
          ) =>
            sum + score,
          0,
        );

      return (
        total /
        scores.length
      );
    }, [
      certificates,
    ]);

  function getCertificateIcon(
    type:
      CertificateType["icon"],
  ) {
    if (
      type === "monitor"
    ) {
      return Monitor;
    }

    if (
      type === "wrench"
    ) {
      return Wrench;
    }

    return Award;
  }

  if (isLoading) {
    return (
      <div
        className="
          min-h-[60vh]

          flex
          flex-col
          items-center
          justify-center

          gap-3
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
            text-lg
            sm:text-xl

            font-semibold

            text-[#080E2F]
            dark:text-white
          "
        >
          Carregando seus
          certificados...
        </h2>
      </div>
    );
  }

  return (
    <main
      className="
        w-full
        min-w-0

        space-y-6
        sm:space-y-8
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          flex-col

          gap-5

          xl:flex-row
          xl:items-end
          xl:justify-between
        "
      >
        <div
          className="
            min-w-0

            flex
            items-center

            gap-4
            sm:gap-5
          "
        >
          <div
            className="
              hidden
              sm:flex

              w-16
              h-16

              lg:w-20
              lg:h-20

              rounded-2xl
              lg:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              items-center
              justify-center

              shrink-0

              shadow-2xl
              dark:shadow-sm
            "
          >
            <Award
              size={36}
              className="
                text-[var(--company-primary)]
              "
            />
          </div>

          <div className="min-w-0">
            <h1
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl

                font-bold

                text-[#080E2F]
                dark:text-white

                leading-tight
              "
            >
              Meus Certificados
            </h1>

            <p
              className="
                mt-2

                max-w-3xl

                text-sm
                sm:text-base

                text-gray-500
                dark:text-gray-400

                leading-relaxed
              "
            >
              Veja seus certificados
              conquistados e acompanhe
              seu desempenho.
            </p>
          </div>
        </div>

        <div
          className="
            w-full

            flex
            flex-col

            gap-3

            sm:flex-row
            sm:items-center

            xl:w-auto
          "
        >
          {/* BUSCA */}
          <div
            className="
              relative

              w-full

              sm:flex-1
              xl:w-[360px]

              rounded-2xl

              shadow-2xl
              dark:shadow-sm
            "
          >
            <Search
              size={20}
              className="
                absolute

                left-4
                top-1/2

                -translate-y-1/2

                text-gray-400

                pointer-events-none
              "
            />

            <input
              type="search"
              placeholder="Buscar certificados..."
              value={search}
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              className="
                w-full

                rounded-2xl

                border
                border-gray-200
                dark:border-white/10

                bg-white
                dark:bg-[#091a2c]

                py-3.5
                sm:py-4

                pl-12
                pr-4

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
              "
            />
          </div>

          {/* VISUALIZAÇÃO */}
          <div
            className="
              hidden
              sm:flex

              shrink-0

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              p-1

              shadow-2xl
              dark:shadow-sm
            "
          >
            <button
              type="button"
              onClick={() =>
                setViewMode(
                  "grid",
                )
              }
              aria-label="Visualizar certificados em grade"
              className={`
                w-11
                h-11

                lg:w-12
                lg:h-12

                rounded-xl

                flex
                items-center
                justify-center

                transition-all

                ${
                  viewMode ===
                  "grid"
                    ? `
                        bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

                        text-[var(--company-primary)]
                      `
                    : `
                        text-gray-500
                        dark:text-gray-400

                        hover:bg-gray-100
                        dark:hover:bg-white/5
                      `
                }
              `}
            >
              <Grid3X3
                size={21}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setViewMode(
                  "list",
                )
              }
              aria-label="Visualizar certificados em lista"
              className={`
                w-11
                h-11

                lg:w-12
                lg:h-12

                rounded-xl

                flex
                items-center
                justify-center

                transition-all

                ${
                  viewMode ===
                  "list"
                    ? `
                        bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

                        text-[var(--company-primary)]
                      `
                    : `
                        text-gray-500
                        dark:text-gray-400

                        hover:bg-gray-100
                        dark:hover:bg-white/5
                      `
                }
              `}
            >
              <List
                size={23}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ESTATÍSTICAS */}
      <div
        className="
          grid
          grid-cols-1

          sm:grid-cols-2
          xl:grid-cols-3

          gap-4
          sm:gap-5
        "
      >
        <CertificateStatCard
          icon={Award}
          title="Total de Certificados"
          value={
            certificates.length
          }
          subtitle="Certificados emitidos"
          color="
            bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]
            text-[var(--company-primary)]
          "
        />

        <CertificateStatCard
          icon={TrendingUp}
          title="Média de Notas"
          value={
            averageScore ===
            null
              ? "—"
              : `${averageScore
                  .toFixed(1)
                  .replace(
                    ".",
                    ",",
                  )}%`
          }
          subtitle={
            averageScore ===
            null
              ? "Sem avaliações concluídas"
              : "Desempenho geral"
          }
          color="
            bg-green-500/15
            text-green-600
            dark:text-green-400
          "
        />

        <CertificateStatCard
          icon={Calendar}
          title="Último Certificado"
          value={
            featuredCertificate
              ? featuredCertificate.conclusionDate
              : "Nenhum"
          }
          subtitle="Data de emissão"
          color="
            bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]
            text-[var(--company-primary)]
          "
        />
      </div>

      {/* EMPTY */}
      {certificates.length ===
        0 && (
        <div
          className="
            rounded-2xl
            sm:rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            bg-white
            dark:bg-[#091a2c]

            px-5
            py-10

            sm:p-12

            text-center

            shadow-2xl
            dark:shadow-sm
          "
        >
          <div
            className="
              w-16
              h-16

              mx-auto
              mb-4

              rounded-2xl

              bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

              flex
              items-center
              justify-center
            "
          >
            <Award
              size={32}
              className="
                text-[var(--company-primary)]
              "
            />
          </div>

          <h3
            className="
              text-lg
              sm:text-xl

              font-bold

              text-[#080E2F]
              dark:text-white
            "
          >
            Nenhum certificado
            encontrado
          </h3>

          <p
            className="
              mt-2

              max-w-xl
              mx-auto

              text-sm
              sm:text-base

              text-gray-500
              dark:text-gray-400

              leading-relaxed
            "
          >
            Você ainda não concluiu
            nenhum curso na
            plataforma.
          </p>
        </div>
      )}

      {/* BUSCA SEM RESULTADO */}
      {certificates.length >
        0 &&
        filteredCertificates.length ===
          0 && (
          <div
            className="
              rounded-2xl
              sm:rounded-3xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#091a2c]

              px-5
              py-10

              text-center

              shadow-2xl
              dark:shadow-sm
            "
          >
            <Search
              size={32}
              className="
                mx-auto
                text-[var(--company-primary)]
              "
            />

            <h3
              className="
                mt-4

                text-lg
                sm:text-xl

                font-bold

                text-[#080E2F]
                dark:text-white
              "
            >
              Nenhum resultado
            </h3>

            <p
              className="
                mt-2

                text-sm

                text-gray-500
                dark:text-gray-400
              "
            >
              Nenhum certificado
              corresponde à busca
              realizada.
            </p>
          </div>
        )}

      {/* CERTIFICADO PRINCIPAL */}
      {featuredCertificate && (
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

            p-4
            sm:p-5
            lg:p-6

            shadow-2xl
            dark:shadow-sm
          "
        >
          <div
            className="
              grid
              grid-cols-1

              gap-6

              xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]
            "
          >
            <CertificatePreview
              studentName={
                user?.name ||
                "Aluno"
              }
              courseTitle={
                featuredCertificate.title
              }
            />

            <div
              className="
                min-w-0

                flex
                flex-col
                justify-center
              "
            >
              <div
                className="
                  flex
                  flex-col

                  gap-4

                  sm:flex-row
                  sm:items-start
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
                    Certificado de
                    Conclusão
                  </h2>

                  <p
                    className="
                      mt-1

                      text-sm
                      sm:text-base

                      text-gray-500
                      dark:text-gray-400

                      break-words
                    "
                  >
                    {academyName}
                  </p>

                  <h3
                    className="
                      mt-4

                      text-lg
                      sm:text-xl

                      font-bold

                      text-[#080E2F]
                      dark:text-white

                      break-words
                    "
                  >
                    {
                      featuredCertificate.title
                    }
                  </h3>
                </div>

                <div
                  className="
                    flex
                    flex-col

                    items-start
                    sm:items-end

                    gap-2

                    shrink-0
                  "
                >
                  <span
                    className="
                      w-fit

                      rounded-2xl

                      bg-green-500/15

                      px-4
                      py-2

                      text-sm
                      font-semibold

                      text-green-600
                      dark:text-green-400
                    "
                  >
                    Nota:{" "}
                    {featuredCertificate.score ===
                    null
                      ? "Não informada"
                      : `${featuredCertificate.score}%`}
                  </span>

                  <CertificateStatusBadge
                    status={
                      featuredCertificate.status
                    }
                  />
                </div>
              </div>

              <div
                className="
                  mt-5

                  grid
                  grid-cols-1

                  md:grid-cols-3

                  gap-4
                  sm:gap-5

                  border-y
                  border-gray-200
                  dark:border-white/10

                  py-5
                "
              >
                <InfoItem
                  icon={Calendar}
                  title="Data de Conclusão:"
                  value={
                    featuredCertificate.conclusionDate
                  }
                />

                <InfoItem
                  icon={Award}
                  title="Cód. Validação:"
                  value={
                    featuredCertificate.id
                  }
                />

                <InfoItem
                  icon={ShieldCheck}
                  title="Validade"
                  value={
                    featuredCertificate.status ===
                    "revogado"
                      ? "Certificado revogado"
                      : featuredCertificate.status ===
                          "expirado"
                        ? `Expirou em ${featuredCertificate.validUntil}`
                        : `Válido até ${featuredCertificate.validUntil}`
                  }
                  success={
                    featuredCertificate.status ===
                    "valido"
                  }
                />
              </div>

              {featuredCertificate.status ===
                "revogado" && (
                <div
                  className="
                    mt-4

                    rounded-2xl

                    border
                    border-red-500/15

                    bg-red-500/10

                    p-4
                  "
                >
                  <p
                    className="
                      text-sm
                      font-semibold

                      text-red-600
                      dark:text-red-400
                    "
                  >
                    Certificado revogado
                  </p>

                  {featuredCertificate.revokedAt && (
                    <p
                      className="
                        mt-1

                        text-sm

                        text-red-600
                        dark:text-red-300
                      "
                    >
                      Revogado em{" "}
                      {
                        featuredCertificate.revokedAt
                      }
                    </p>
                  )}

                  {featuredCertificate.revocationReason && (
                    <p
                      className="
                        mt-2

                        text-sm

                        text-red-600
                        dark:text-red-300

                        break-words
                      "
                    >
                      Motivo:{" "}
                      {
                        featuredCertificate.revocationReason
                      }
                    </p>
                  )}
                </div>
              )}

              <div
                className="
                  mt-5

                  grid
                  grid-cols-1

                  sm:grid-cols-3

                  gap-3
                  sm:gap-4
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCert(
                      featuredCertificate,
                    );

                    setIsModalOpen(
                      true,
                    );
                  }}
                  className="
                    min-h-[50px]

                    rounded-2xl

                    bg-gradient-to-r
                    from-[var(--company-primary)]
                    to-[var(--company-secondary)]

                    px-4
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
                  <Eye size={21} />

                  Ver
                </button>

                <button
                  type="button"
                  disabled={
                    featuredCertificate.status ===
                    "revogado"
                  }
                  onClick={() =>
                    void handleDownload(
                      featuredCertificate.dbId,
                      featuredCertificate.title,
                      featuredCertificate.status,
                    )
                  }
                  className={`
                    min-h-[50px]

                    rounded-2xl

                    border

                    px-4
                    py-3

                    font-semibold

                    flex
                    items-center
                    justify-center

                    gap-2

                    shadow-2xl
                    dark:shadow-sm

                    transition-all

                    ${
                      featuredCertificate.status ===
                      "revogado"
                        ? `
                            border-gray-200
                            dark:border-white/10

                            bg-gray-100
                            dark:bg-white/5

                            text-gray-400
                            dark:text-gray-600

                            cursor-not-allowed
                          `
                        : `
                            border-[color-mix(in_srgb,var(--company-primary)_35%,transparent)]

                            bg-[color-mix(in_srgb,var(--company-primary)_5%,transparent)]

                            text-[var(--company-primary)]

                            hover:bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                          `
                    }
                  `}
                >
                  <Download
                    size={21}
                  />

                  {featuredCertificate.status ===
                  "revogado"
                    ? "Indisponível"
                    : "Baixar PDF"}
                </button>

                <a
                  href={`/validar/${featuredCertificate.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    min-h-[50px]

                    rounded-2xl

                    border
                    border-gray-300
                    dark:border-white/20

                    bg-white
                    dark:bg-[#0d2238]

                    px-4
                    py-3

                    font-semibold

                    text-gray-700
                    dark:text-gray-300

                    flex
                    items-center
                    justify-center

                    gap-2

                    shadow-2xl
                    dark:shadow-sm

                    transition-all

                    hover:bg-gray-50
                    dark:hover:bg-white/5
                  "
                >
                  <ExternalLink
                    size={21}
                  />

                  Verificar
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* OUTROS CERTIFICADOS */}
      {otherCertificates.length >
        0 && (
        <section>
          <h2
            className="
              mb-5

              text-xl
              sm:text-2xl

              font-bold

              text-[#080E2F]
              dark:text-white
            "
          >
            Outros certificados
            emitidos
          </h2>

          <div
            className={
              viewMode === "grid"
                ? `
                    grid
                    grid-cols-1

                    xl:grid-cols-2

                    gap-5
                    sm:gap-6
                  `
                : `
                    flex
                    flex-col

                    gap-4
                  `
            }
          >
            {otherCertificates.map(
              (
                certificate,
              ) => {
                const Icon =
                  getCertificateIcon(
                    certificate.icon,
                  );

                return (
                  <article
                    key={
                      certificate.dbId
                    }
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
                      sm:p-5
                      lg:p-6

                      shadow-2xl
                      dark:shadow-sm

                      transition-all

                      hover:border-[color-mix(in_srgb,var(--company-primary)_30%,transparent)]
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col

                        gap-4

                        sm:flex-row
                        sm:items-start
                        sm:justify-between
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
                            w-14
                            h-14

                            sm:w-16
                            sm:h-16

                            rounded-2xl

                            bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                            text-[var(--company-primary)]

                            flex
                            items-center
                            justify-center

                            shrink-0
                          "
                        >
                          <Icon
                            size={30}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="
                              text-lg
                              sm:text-xl

                              font-bold

                              text-[#080E2F]
                              dark:text-white

                              break-words
                            "
                          >
                            {
                              certificate.title
                            }
                          </h3>

                          <div
                            className="
                              mt-5

                              grid
                              grid-cols-1

                              md:grid-cols-2

                              gap-4
                            "
                          >
                            <SmallInfo
                              icon={
                                Calendar
                              }
                              title="Data de Conclusão:"
                              value={
                                certificate.conclusionDate
                              }
                            />

                            <SmallInfo
                              icon={
                                ShieldCheck
                              }
                              title="Validade"
                              value={
                                certificate.status ===
                                "revogado"
                                  ? "Certificado revogado"
                                  : certificate.status ===
                                      "expirado"
                                    ? `Expirou em ${certificate.validUntil}`
                                    : `Válido até ${certificate.validUntil}`
                              }
                              success={
                                certificate.status ===
                                "valido"
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <CertificateStatusBadge
                        status={
                          certificate.status
                        }
                      />
                    </div>

                    {certificate.status ===
                      "revogado" && (
                      <div
                        className="
                          mt-5

                          rounded-2xl

                          border
                          border-red-500/15

                          bg-red-500/10

                          p-4
                        "
                      >
                        <p
                          className="
                            text-sm
                            font-semibold

                            text-red-600
                            dark:text-red-400
                          "
                        >
                          Certificado revogado
                        </p>

                        {certificate.revokedAt && (
                          <p
                            className="
                              mt-1

                              text-sm

                              text-red-600
                              dark:text-red-300
                            "
                          >
                            Revogado em{" "}
                            {
                              certificate.revokedAt
                            }
                          </p>
                        )}

                        {certificate.revocationReason && (
                          <p
                            className="
                              mt-2

                              text-sm

                              text-red-600
                              dark:text-red-300

                              break-words
                            "
                          >
                            Motivo:{" "}
                            {
                              certificate.revocationReason
                            }
                          </p>
                        )}
                      </div>
                    )}

                    <div
                      className="
                        mt-6

                        grid
                        grid-cols-1

                        sm:grid-cols-3

                        gap-3
                        sm:gap-4
                      "
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCert(
                            certificate,
                          );

                          setIsModalOpen(
                            true,
                          );
                        }}
                        className="
                          min-h-[46px]

                          rounded-2xl

                          border
                          border-[color-mix(in_srgb,var(--company-primary)_30%,transparent)]

                          bg-[color-mix(in_srgb,var(--company-primary)_5%,transparent)]

                          px-4
                          py-3

                          font-semibold

                          text-[var(--company-primary)]

                          flex
                          items-center
                          justify-center

                          gap-2

                          transition-all

                          hover:bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                        "
                      >
                        <Eye
                          size={20}
                        />

                        Ver
                      </button>

                      <button
                        type="button"
                        disabled={
                          certificate.status ===
                          "revogado"
                        }
                        onClick={() =>
                          void handleDownload(
                            certificate.dbId,
                            certificate.title,
                            certificate.status,
                          )
                        }
                        className={`
                          min-h-[46px]

                          rounded-2xl

                          border

                          px-4
                          py-3

                          font-semibold

                          flex
                          items-center
                          justify-center

                          gap-2

                          transition-all

                          ${
                            certificate.status ===
                            "revogado"
                              ? `
                                  border-gray-200
                                  dark:border-white/10

                                  bg-gray-100
                                  dark:bg-white/5

                                  text-gray-400
                                  dark:text-gray-600

                                  cursor-not-allowed
                                `
                              : `
                                  border-[color-mix(in_srgb,var(--company-primary)_30%,transparent)]

                                  bg-[color-mix(in_srgb,var(--company-primary)_5%,transparent)]

                                  text-[var(--company-primary)]

                                  hover:bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
                                `
                          }
                        `}
                      >
                        <Download
                          size={20}
                        />

                        {certificate.status ===
                        "revogado"
                          ? "Indisponível"
                          : "Baixar"}
                      </button>

                      <a
                        href={`/validar/${certificate.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          min-h-[46px]

                          rounded-2xl

                          border
                          border-gray-300
                          dark:border-white/20

                          bg-white
                          dark:bg-[#0d2238]

                          px-4
                          py-3

                          font-semibold

                          text-gray-700
                          dark:text-gray-300

                          flex
                          items-center
                          justify-center

                          gap-2

                          transition-all

                          hover:bg-gray-50
                          dark:hover:bg-white/5
                        "
                      >
                        <ExternalLink
                          size={20}
                        />

                        Verificar
                      </a>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        </section>
      )}

      {/* INFORMAÇÃO */}
      {certificates.length >
        0 && (
        <div
          className="
            rounded-2xl

            border
            border-[color-mix(in_srgb,var(--company-primary)_20%,transparent)]

            bg-[color-mix(in_srgb,var(--company-primary)_5%,transparent)]

            p-4

            flex
            items-start

            gap-3

            text-sm
            sm:text-base

            text-gray-600
            dark:text-gray-400

            shadow-2xl
            dark:shadow-sm
          "
        >
          <Info
            className="
              mt-0.5

              shrink-0

              text-[var(--company-primary)]
            "
          />

          <p className="leading-relaxed">
            Os certificados emitidos
            têm validade de 1 ano a
            partir da data de emissão.
          </p>
        </div>
      )}

      <CertificateModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        certificateId={
          selectedCert?.dbId || null
        }
        certificateTitle={
          selectedCert?.title || ""
        }
        studentName={
          user?.name || "Aluno"
        }
        emitidoEm={
          selectedCert?.conclusionDate || ""
        }
        validUntil={
          selectedCert?.validUntil || ""
        }
        status={
          selectedCert?.status || "valido"
        }
        revokedAt={
          selectedCert?.revokedAt || null
        }
        revocationReason={
          selectedCert?.revocationReason || null
        }
        validationCode={
          selectedCert?.id || ""
        }
        workload={
          selectedCert?.workload || ""
        }
      />
    </main>
  );
}

function CertificateStatusBadge({
  status,
}: {
  status:
    CertificateType["status"];
}) {
  if (
    status ===
    "revogado"
  ) {
    return (
      <span
        className="
          w-fit
          shrink-0

          rounded-2xl

          bg-red-500/15

          px-4
          py-2

          text-sm
          font-semibold

          text-red-600
          dark:text-red-400
        "
      >
        Revogado
      </span>
    );
  }

  if (
    status ===
    "expirado"
  ) {
    return (
      <span
        className="
          w-fit
          shrink-0

          rounded-2xl

          bg-yellow-500/15

          px-4
          py-2

          text-sm
          font-semibold

          text-yellow-600
          dark:text-yellow-400
        "
      >
        Expirado
      </span>
    );
  }

  return (
    <span
      className="
        w-fit
        shrink-0

        rounded-2xl

        bg-green-500/15

        px-4
        py-2

        text-sm
        font-semibold

        text-green-600
        dark:text-green-400
      "
    >
      Válido
    </span>
  );
}

interface CertificateStatCardProps {
  icon: LucideIcon;
  title: string;

  value:
    | string
    | number;

  subtitle: string;
  color: string;
}

function CertificateStatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
}: CertificateStatCardProps) {
  return (
    <div
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
        sm:p-5
        lg:p-6

        shadow-2xl
        dark:shadow-sm
      "
    >
      <div
        className="
          flex
          items-center

          gap-4
          sm:gap-5
        "
      >
        <div
          className={`
            w-14
            h-14

            sm:w-16
            sm:h-16

            rounded-2xl

            flex
            items-center
            justify-center

            shrink-0

            ${color}
          `}
        >
          <Icon
            size={30}
          />
        </div>

        <div className="min-w-0">
          <p
            className="
              text-sm
              sm:text-base

              font-semibold

              text-gray-500
              dark:text-gray-400

              break-words
            "
          >
            {title}
          </p>

          <h2
            className="
              mt-1

              text-2xl
              sm:text-3xl

              font-bold

              text-[#080E2F]
              dark:text-white

              break-words
            "
          >
            {value}
          </h2>

          <p
            className="
              mt-1

              text-xs
              sm:text-sm

              text-gray-500
              dark:text-gray-400
            "
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function CertificatePreview({
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

        rounded-2xl

        border
        border-gray-200

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

      <div
        className="
          absolute

          top-[42%]
          left-[58%]

          -translate-x-1/2
          -translate-y-1/2

          w-full

          px-6
          sm:px-8

          text-center
        "
      >
        <p
          className="
            text-sm
            sm:text-lg
            lg:text-xl

            font-bold

            text-[#1C2B4B]

            line-clamp-1
          "
        >
          {studentName}
        </p>
      </div>

      <div
        className="
          absolute

          top-[65%]
          left-[58%]

          -translate-x-1/2
          -translate-y-1/2

          w-full

          px-6
          sm:px-8

          text-center
        "
      >
        <p
          className="
            text-[10px]
            sm:text-xs
            lg:text-sm

            text-[#444444]

            line-clamp-2
          "
        >
          {courseTitle}
        </p>
      </div>
    </div>
  );
}

interface CertificateInfoProps {
  icon: LucideIcon;

  title: string;
  value: string;

  success?: boolean;
}

function InfoItem({
  icon: Icon,
  title,
  value,
  success = false,
}: CertificateInfoProps) {
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
        size={22}
        className={`
          mt-0.5

          shrink-0

          ${
            success
              ? `
                  text-green-600
                  dark:text-green-400
                `
              : `
                  text-[var(--company-primary)]
                `
          }
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

            break-all

            ${
              success
                ? `
                    text-green-600
                    dark:text-green-400
                  `
                : `
                    text-[#080E2F]
                    dark:text-white
                  `
            }
          `}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function SmallInfo({
  icon: Icon,
  title,
  value,
  success = false,
}: CertificateInfoProps) {
  return (
    <div
      className="
        min-w-0

        flex
        items-start

        gap-2
      "
    >
      <Icon
        size={19}
        className={`
          mt-0.5

          shrink-0

          ${
            success
              ? `
                  text-green-600
                  dark:text-green-400
                `
              : `
                  text-[var(--company-primary)]
                `
          }
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

            text-sm
            font-semibold

            break-all

            ${
              success
                ? `
                    text-green-600
                    dark:text-green-400
                  `
                : `
                    text-[#080E2F]
                    dark:text-white
                  `
            }
          `}
        >
          {value}
        </p>
      </div>
    </div>
  );
}