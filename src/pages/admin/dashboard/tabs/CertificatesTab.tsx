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

import type { AdminDashboardData } from "../types/adminDashboard.types";

interface CertificatesTabProps {
  dashboardData: AdminDashboardData | null;
  onDownload: (id: number, name: string) => void;
  onRevoke: (id: number) => void;
}

export default function CertificatesTab({
  dashboardData,
  onDownload,
  onRevoke,
}: CertificatesTabProps) {
  const resumo = dashboardData?.resumo;
  const certificates =
    dashboardData?.ultimosCertificados ?? [];

  const lastCertificate = certificates[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      <StatsGrid>
        <StatCard
          title="Total Emitidos"
          value={resumo?.certificadosEmitidos ?? 0}
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
          value={resumo?.certificadosEmitidos ?? 0}
          subtitle="Com código"
          icon={ShieldCheck}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Cursos"
          value={resumo?.totalCursos ?? 0}
          subtitle="Na plataforma"
          icon={BookOpen}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Alunos"
          value={resumo?.totalAlunos ?? 0}
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
                ).toLocaleDateString("pt-BR")
              : "-"
          }
          subtitle="Mais recente"
          icon={Calendar}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />
      </StatsGrid>

      <TableCard title="Últimos Certificados Emitidos">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[0.8fr_1.3fr_1.5fr_1.2fr_1fr_120px] text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 pb-3">
            <span>ID</span>
            <span>Aluno</span>
            <span>Curso</span>
            <span>Código</span>
            <span>Emissão</span>
            <span className="text-right">Ações</span>
          </div>

          {certificates.length > 0 ? (
            certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="grid grid-cols-[0.8fr_1.3fr_1.5fr_1.2fr_1fr_120px] gap-4 items-center py-4 border-b border-gray-200 dark:border-white/10 last:border-b-0"
              >
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  #{certificate.id}
                </span>

                <span className="text-[#080E2F] dark:text-white font-semibold truncate">
                  {certificate.aluno_nome}
                </span>

                <span className="text-gray-600 dark:text-gray-400 truncate">
                  {certificate.curso_titulo}
                </span>

                <span className="text-gray-600 dark:text-gray-400 truncate">
                  {certificate.validation_code}
                </span>

                <span className="text-gray-600 dark:text-gray-400">
                  {certificate.emitido_em
                    ? new Date(
                        certificate.emitido_em,
                      ).toLocaleDateString("pt-BR")
                    : "-"}
                </span>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onDownload(
                        certificate.id,
                        certificate.aluno_nome,
                      )
                    }
                    title="Baixar PDF Oficial"
                    className="rounded-xl bg-blue-500/10 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all cursor-pointer"
                  >
                    <Download size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onRevoke(certificate.id)
                    }
                    title="Revogar certificado"
                    className="rounded-xl bg-red-500/10 px-3 py-2 text-red-500 hover:bg-red-500/20 transition-all cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              Nenhum certificado emitido até o momento.
            </div>
          )}
        </div>
      </TableCard>
    </div>
  );
}