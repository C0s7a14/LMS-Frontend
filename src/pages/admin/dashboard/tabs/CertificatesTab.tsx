import {
  Award,
  BookOpen,
  Calendar,
  Clock3,
  Download,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";

import StatCard from "../components/StatCard";
import StatsGrid from "../components/StatsGrid";
import TableCard from "../components/TableCard";

import type {
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
      <StatsGrid>
        <StatCard
          title="Total Emitidos"
          value={
            resumo?.certificadosEmitidos ??
            0
          }
          subtitle="Todos os certificados"
          icon={Award}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Últimos"
          value={certificates.length}
          subtitle="Listados"
          icon={Clock3}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Válidos"
          value={
            resumo?.certificadosEmitidos ??
            0
          }
          subtitle="Com código"
          icon={ShieldCheck}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
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
          title="Alunos"
          value={
            resumo?.totalAlunos ?? 0
          }
          subtitle="Podem certificar"
          icon={Users}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Última Emissão"
          value={
            lastCertificate?.emitido_em
              ? new Date(
                  lastCertificate.emitido_em,
                ).toLocaleDateString(
                  "pt-BR",
                )
              : "—"
          }
          subtitle="Mais recente"
          icon={Calendar}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />
      </StatsGrid>

      <TableCard title="Últimos Certificados Emitidos">
        {/* DESKTOP */}
        <div
          className="
            hidden
            xl:block

            min-w-[900px]
          "
        >
          <div
            className="
              grid
              grid-cols-[80px_1.2fr_1.4fr_1.2fr_110px_120px]

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
            <span>Aluno</span>
            <span>Curso</span>
            <span>Código</span>
            <span>Emissão</span>

            <span className="text-right">
              Ações
            </span>
          </div>

          {certificates.length > 0 ? (
            certificates.map(
              (certificate) => (
                <div
                  key={certificate.id}
                  className="
                    grid
                    grid-cols-[80px_1.2fr_1.4fr_1.2fr_110px_120px]

                    gap-4

                    items-center

                    py-4

                    border-b
                    border-gray-200
                    dark:border-white/10

                    last:border-b-0
                  "
                >
                  <span
                    className="
                      font-semibold

                      text-[var(--company-primary)]
                    "
                  >
                    #{certificate.id}
                  </span>

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
                    {certificate.aluno_nome}
                  </span>

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

                  <span
                    className="
                      text-sm

                      text-gray-600
                      dark:text-gray-400

                      whitespace-nowrap
                    "
                  >
                    {certificate.emitido_em
                      ? new Date(
                          certificate.emitido_em,
                        ).toLocaleDateString(
                          "pt-BR",
                        )
                      : "—"}
                  </span>

                  <div
                    className="
                      flex
                      justify-end
                      gap-2
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onDownload(
                          certificate.id,
                          certificate.aluno_nome,
                        )
                      }
                      title="Baixar PDF Oficial"
                      className="
                        w-10
                        h-10

                        rounded-xl

                        bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]

                        text-[var(--company-primary)]

                        flex
                        items-center
                        justify-center

                        hover:bg-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]

                        transition-all
                      "
                    >
                      <Download size={18} />
                    </button>

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
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ),
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
              (certificate) => (
                <article
                  key={certificate.id}
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

                    shadow-lg
                    dark:shadow-none
                  "
                >
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
                        <Award size={23} />
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
                          {certificate.id}
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

                    <ShieldCheck
                      size={20}
                      className="
                        text-green-500
                        shrink-0
                      "
                    />
                  </div>

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
                      value={
                        certificate.emitido_em
                          ? new Date(
                              certificate.emitido_em,
                            ).toLocaleDateString(
                              "pt-BR",
                            )
                          : "—"
                      }
                    />
                  </div>

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
                      onClick={() =>
                        onDownload(
                          certificate.id,
                          certificate.aluno_nome,
                        )
                      }
                      className="
                        rounded-xl

                        bg-gradient-to-r
                        from-[var(--company-primary)]
                        to-[var(--company-secondary)]

                        px-3
                        py-2.5

                        text-sm
                        font-semibold
                        text-white

                        flex
                        items-center
                        justify-center

                        gap-2

                        shadow-lg

                        transition-all

                        active:scale-[0.98]
                      "
                    >
                      <Download size={17} />

                      Baixar
                    </button>

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
                      <Trash2 size={17} />

                      Revogar
                    </button>
                  </div>
                </article>
              ),
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