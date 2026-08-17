import {
  Award,
  Ban,
  BookOpen,
  Calendar,
  Clock3,
  Download,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import StatCard from "../components/StatCard";
import StatsGrid from "../components/StatsGrid";
import TableCard from "../components/TableCard";

import type {
  AdminDashboardCertificate,
  AdminDashboardData,
} from "../types/adminDashboard.types";

interface CertificatesTabProps {
  dashboardData: AdminDashboardData | null;

  onDownload: (
    id: number,
    name: string,
  ) => void;

  onRevoke: (
    id: number,
  ) => void;
}

export default function CertificatesTab({
  dashboardData,
  onDownload,
  onRevoke,
}: CertificatesTabProps) {
  const resumo =
    dashboardData?.resumo;

  const certificates =
    dashboardData?.ultimosCertificados ??
    [];

  const lastCertificate =
    certificates[0];

  return (
    <div
      className="
        w-full
        min-w-0

        space-y-6
        sm:space-y-8
      "
    >
      {/* INDICADORES */}
      <StatsGrid>
        <StatCard
          title="Total Emitidos"
          value={
            resumo?.certificadosEmitidos ??
            0
          }
          subtitle="Histórico de emissões"
          icon={Award}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Válidos"
          value={
            resumo?.certificadosValidos ??
            0
          }
          subtitle="Dentro da validade"
          icon={ShieldCheck}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Expirados"
          value={
            resumo?.certificadosExpirados ??
            0
          }
          subtitle="Prazo encerrado"
          icon={Clock3}
          color="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
        />

        <StatCard
          title="Revogados"
          value={
            resumo?.certificadosRevogados ??
            0
          }
          subtitle="Revogados pela empresa"
          icon={Ban}
          color="bg-red-500/15 text-red-600 dark:text-red-400"
        />

        <StatCard
          title="Cursos"
          value={
            resumo?.totalCursos ?? 0
          }
          subtitle="Na plataforma"
          icon={BookOpen}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Última Emissão"
          value={
            lastCertificate?.emitido_em
              ? formatCertificateDate(
                  lastCertificate.emitido_em,
                )
              : "—"
          }
          subtitle="Mais recente"
          icon={Calendar}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />
      </StatsGrid>

      {/* CERTIFICADOS */}
      <TableCard title="Últimos Certificados Emitidos">
        {/* DESKTOP */}
        <div
          className="
            hidden
            xl:block

            min-w-[1180px]
          "
        >
          <div
            className="
              grid
              grid-cols-[70px_1.15fr_1.25fr_1fr_110px_110px_110px_120px]

              gap-4

              pb-3

              text-sm
              text-gray-500
              dark:text-gray-400

              border-b
              border-gray-200
              dark:border-white/10
            "
          >
            <span>ID</span>

            <span>
              Aluno
            </span>

            <span>
              Curso
            </span>

            <span>
              Código
            </span>

            <span>
              Status
            </span>

            <span>
              Emissão
            </span>

            <span>
              Validade
            </span>

            <span className="text-right">
              Ações
            </span>
          </div>

          {certificates.length > 0 ? (
            certificates.map(
              (certificate) => {
                const isRevoked =
                  certificate.status_certificado ===
                  "revogado";

                return (
                  <div
                    key={
                      certificate.id
                    }
                    className="
                      border-b
                      border-gray-200
                      dark:border-white/10

                      last:border-b-0
                    "
                  >
                    <div
                      className="
                        grid
                        grid-cols-[70px_1.15fr_1.25fr_1fr_110px_110px_110px_120px]

                        gap-4

                        items-center

                        py-4
                      "
                    >
                      {/* ID */}
                      <span
                        className="
                          font-semibold
                          text-[var(--company-primary)]
                        "
                      >
                        #
                        {
                          certificate.id
                        }
                      </span>

                      {/* ALUNO */}
                      <span
                        className="
                          min-w-0

                          font-semibold

                          text-[#080E2F]
                          dark:text-white

                          truncate
                        "
                        title={
                          certificate.aluno_nome
                        }
                      >
                        {
                          certificate.aluno_nome
                        }
                      </span>

                      {/* CURSO */}
                      <span
                        className="
                          min-w-0

                          text-gray-600
                          dark:text-gray-400

                          truncate
                        "
                        title={
                          certificate.curso_titulo
                        }
                      >
                        {
                          certificate.curso_titulo
                        }
                      </span>

                      {/* CÓDIGO */}
                      <span
                        className="
                          min-w-0

                          text-sm
                          font-mono

                          text-gray-600
                          dark:text-gray-400

                          truncate
                        "
                        title={
                          certificate.validation_code
                        }
                      >
                        {
                          certificate.validation_code
                        }
                      </span>

                      {/* STATUS */}
                      <CertificateStatusBadge
                        status={
                          certificate.status_certificado
                        }
                      />

                      {/* EMISSÃO */}
                      <span
                        className="
                          text-sm

                          text-gray-600
                          dark:text-gray-400

                          whitespace-nowrap
                        "
                      >
                        {formatCertificateDate(
                          certificate.emitido_em,
                        )}
                      </span>

                      {/* VALIDADE */}
                      <span
                        className="
                          text-sm

                          text-gray-600
                          dark:text-gray-400

                          whitespace-nowrap
                        "
                      >
                        {formatCertificateDate(
                          certificate.validade_ate,
                        )}
                      </span>

                      {/* AÇÕES */}
                      <div
                        className="
                          flex
                          justify-end
                          gap-2
                        "
                      >
                        <button
                          type="button"
                          disabled={
                            isRevoked
                          }
                          onClick={() => {
                            if (
                              isRevoked
                            ) {
                              return;
                            }

                            onDownload(
                              certificate.id,
                              certificate.aluno_nome,
                            );
                          }}
                          title={
                            isRevoked
                              ? "Certificados revogados não podem ser baixados"
                              : "Baixar PDF oficial"
                          }
                          className={`
                            w-10
                            h-10

                            rounded-xl

                            flex
                            items-center
                            justify-center

                            transition-all

                            ${
                              isRevoked
                                ? `
                                    bg-gray-100
                                    dark:bg-white/5

                                    text-gray-300
                                    dark:text-gray-600

                                    cursor-not-allowed
                                  `
                                : `
                                    bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                                    text-[var(--company-primary)]

                                    hover:bg-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]
                                  `
                            }
                          `}
                        >
                          <Download
                            size={
                              18
                            }
                          />
                        </button>

                        {!isRevoked ? (
                          <button
                            type="button"
                            onClick={() =>
                              onRevoke(
                                certificate.id,
                              )
                            }
                            title="Revogar certificado"
                            className="
                              w-10
                              h-10

                              rounded-xl

                              bg-red-500/10
                              text-red-500

                              flex
                              items-center
                              justify-center

                              hover:bg-red-500/20

                              transition-all
                            "
                          >
                            <Trash2
                              size={
                                18
                              }
                            />
                          </button>
                        ) : (
                          <div
                            title="Certificado revogado"
                            className="
                              w-10
                              h-10

                              rounded-xl

                              bg-red-500/10
                              text-red-500

                              flex
                              items-center
                              justify-center
                            "
                          >
                            <Ban
                              size={
                                18
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* MOTIVO DA REVOGAÇÃO */}
                    {isRevoked &&
                      certificate.motivo_revogacao && (
                        <div
                          className="
                            mb-4

                            rounded-xl

                            border
                            border-red-500/15

                            bg-red-500/10

                            px-4
                            py-3
                          "
                        >
                          <p
                            className="
                              text-xs
                              font-semibold

                              text-red-600
                              dark:text-red-400
                            "
                          >
                            Motivo da
                            revogação
                          </p>

                          <p
                            className="
                              mt-1

                              text-sm

                              text-red-600
                              dark:text-red-300

                              break-words
                            "
                          >
                            {
                              certificate.motivo_revogacao
                            }
                          </p>
                        </div>
                      )}
                  </div>
                );
              },
            )
          ) : (
            <CertificateEmptyState />
          )}
        </div>

        {/* MOBILE / TABLET */}
        <div
          className="
            xl:hidden

            grid
            grid-cols-1
            md:grid-cols-2

            gap-3
            sm:gap-4
          "
        >
          {certificates.length > 0 ? (
            certificates.map(
              (certificate) => {
                const isRevoked =
                  certificate.status_certificado ===
                  "revogado";

                return (
                  <article
                    key={
                      certificate.id
                    }
                    className="
                      w-full
                      min-w-0

                      rounded-2xl

                      border
                      border-gray-200
                      dark:border-white/10

                      bg-white
                      dark:bg-[#091a2c]

                      p-4

                      shadow-2xl
                      dark:shadow-sm
                    "
                  >
                    {/* CABEÇALHO */}
                    <div
                      className="
                        flex
                        items-start
                        justify-between

                        gap-3
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
                            w-12
                            h-12

                            rounded-2xl

                            bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                            text-[var(--company-primary)]

                            flex
                            items-center
                            justify-center

                            shrink-0
                          "
                        >
                          <Award
                            size={
                              23
                            }
                          />
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              text-xs
                              font-semibold

                              text-[var(--company-primary)]
                            "
                          >
                            Certificado #
                            {
                              certificate.id
                            }
                          </p>

                          <h3
                            className="
                              mt-1

                              font-bold

                              text-[#080E2F]
                              dark:text-white

                              leading-snug
                              break-words
                            "
                          >
                            {
                              certificate.aluno_nome
                            }
                          </h3>
                        </div>
                      </div>

                      <CertificateStatusBadge
                        status={
                          certificate.status_certificado
                        }
                      />
                    </div>

                    {/* CURSO */}
                    <div
                      className="
                        mt-4

                        rounded-xl

                        bg-gray-50
                        dark:bg-white/5

                        p-3
                      "
                    >
                      <p
                        className="
                          text-xs

                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Curso
                      </p>

                      <p
                        className="
                          mt-1

                          text-sm
                          font-semibold

                          text-[#080E2F]
                          dark:text-white

                          break-words
                        "
                      >
                        {
                          certificate.curso_titulo
                        }
                      </p>
                    </div>

                    {/* DADOS */}
                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2

                        gap-3

                        mt-3
                      "
                    >
                      <CertificateInfo
                        label="Código"
                        value={
                          certificate.validation_code ||
                          "—"
                        }
                        mono
                      />

                      <CertificateInfo
                        label="Emissão"
                        value={formatCertificateDate(
                          certificate.emitido_em,
                        )}
                      />

                      <CertificateInfo
                        label="Validade até"
                        value={formatCertificateDate(
                          certificate.validade_ate,
                        )}
                      />

                      {isRevoked && (
                        <CertificateInfo
                          label="Revogado em"
                          value={formatCertificateDate(
                            certificate.revogado_em,
                          )}
                        />
                      )}
                    </div>

                    {/* MOTIVO */}
                    {isRevoked &&
                      certificate.motivo_revogacao && (
                        <div
                          className="
                            mt-3

                            rounded-xl

                            border
                            border-red-500/15

                            bg-red-500/10

                            p-3
                          "
                        >
                          <p
                            className="
                              text-xs
                              font-semibold

                              text-red-600
                              dark:text-red-400
                            "
                          >
                            Motivo da
                            revogação
                          </p>

                          <p
                            className="
                              mt-1

                              text-sm

                              text-red-600
                              dark:text-red-300

                              leading-relaxed
                              break-words
                            "
                          >
                            {
                              certificate.motivo_revogacao
                            }
                          </p>
                        </div>
                      )}

                    {/* AÇÕES */}
                    <div
                      className="
                        grid
                        grid-cols-2

                        gap-2

                        mt-4
                        pt-4

                        border-t
                        border-gray-200
                        dark:border-white/10
                      "
                    >
                      <button
                        type="button"
                        disabled={
                          isRevoked
                        }
                        onClick={() => {
                          if (
                            isRevoked
                          ) {
                            return;
                          }

                          onDownload(
                            certificate.id,
                            certificate.aluno_nome,
                          );
                        }}
                        className={`
                          rounded-xl

                          px-3
                          py-2.5

                          text-sm
                          font-semibold

                          flex
                          items-center
                          justify-center

                          gap-2

                          transition-all

                          ${
                            isRevoked
                              ? `
                                  bg-gray-100
                                  dark:bg-white/5

                                  text-gray-400
                                  dark:text-gray-600

                                  cursor-not-allowed
                                `
                              : `
                                  bg-gradient-to-r
                                  from-[var(--company-primary)]
                                  to-[var(--company-secondary)]

                                  text-white

                                  shadow-lg

                                  active:scale-[0.98]
                                `
                          }
                        `}
                      >
                        <Download
                          size={
                            17
                          }
                        />

                        {isRevoked
                          ? "Indisponível"
                          : "Baixar"}
                      </button>

                      {!isRevoked ? (
                        <button
                          type="button"
                          onClick={() =>
                            onRevoke(
                              certificate.id,
                            )
                          }
                          className="
                            rounded-xl

                            bg-red-500/10
                            text-red-500

                            px-3
                            py-2.5

                            text-sm
                            font-semibold

                            flex
                            items-center
                            justify-center

                            gap-2

                            hover:bg-red-500/20

                            transition-all
                          "
                        >
                          <Trash2
                            size={
                              17
                            }
                          />

                          Revogar
                        </button>
                      ) : (
                        <div
                          className="
                            rounded-xl

                            bg-red-500/10
                            text-red-500

                            px-3
                            py-2.5

                            text-sm
                            font-semibold

                            flex
                            items-center
                            justify-center

                            gap-2
                          "
                        >
                          <Ban
                            size={
                              17
                            }
                          />

                          Revogado
                        </div>
                      )}
                    </div>
                  </article>
                );
              },
            )
          ) : (
            <div className="md:col-span-2">
              <CertificateEmptyState />
            </div>
          )}
        </div>
      </TableCard>
    </div>
  );
}

function CertificateStatusBadge({
  status,
}: {
  status:
    AdminDashboardCertificate["status_certificado"];
}) {
  if (status === "revogado") {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5

          w-fit

          rounded-full

          bg-red-500/15

          px-3
          py-1

          text-xs
          font-bold

          text-red-600
          dark:text-red-400

          whitespace-nowrap
        "
      >
        <Ban size={13} />

        Revogado
      </span>
    );
  }

  if (status === "expirado") {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5

          w-fit

          rounded-full

          bg-yellow-500/15

          px-3
          py-1

          text-xs
          font-bold

          text-yellow-600
          dark:text-yellow-400

          whitespace-nowrap
        "
      >
        <Clock3 size={13} />

        Expirado
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5

        w-fit

        rounded-full

        bg-green-500/15

        px-3
        py-1

        text-xs
        font-bold

        text-green-600
        dark:text-green-400

        whitespace-nowrap
      "
    >
      <ShieldCheck size={13} />

      Válido
    </span>
  );
}

function CertificateInfo({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div
      className="
        min-w-0

        rounded-xl

        bg-gray-50
        dark:bg-white/5

        p-3
      "
    >
      <p
        className="
          text-xs

          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-1

          text-sm
          font-semibold

          text-[#080E2F]
          dark:text-white

          break-all

          ${
            mono
              ? "font-mono"
              : ""
          }
        `}
      >
        {value}
      </p>
    </div>
  );
}

function CertificateEmptyState() {
  return (
    <div
      className="
        py-10
        sm:py-12

        text-center
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
        <Award size={26} />
      </div>

      <h3
        className="
          font-bold

          text-[#080E2F]
          dark:text-white
        "
      >
        Nenhum certificado emitido
      </h3>

      <p
        className="
          mt-1

          text-sm

          text-gray-500
          dark:text-gray-400
        "
      >
        Os certificados emitidos aparecerão aqui.
      </p>
    </div>
  );
}

function formatCertificateDate(
  date?: string | null,
) {
  if (!date) {
    return "—";
  }

  return new Date(
    date,
  ).toLocaleDateString(
    "pt-BR",
  );
}