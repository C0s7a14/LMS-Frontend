import {
  Award,
  Calendar,
  Download,
  Eye,
  Grid3X3,
  Info,
  List,
  Monitor,
  Search,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CertificateType {
  id: string;
  title: string;
  academy: string;
  conclusionDate: string;
  validUntil: string;
  score: string;
  workload: string;
  icon: "monitor" | "wrench" | "award";
}

const certificates: CertificateType[] = [
  {
    id: "CERT-2026-0148",
    title: "Instalação e Configuração do SIRROS LogiTrack",
    academy: "SIRROS Academy",
    conclusionDate: "24 de maio de 2026",
    validUntil: "24/05/2027",
    score: "96%",
    workload: "8h",
    icon: "award",
  },
  {
    id: "CERT-2026-0122",
    title: "Operação e Monitoramento de Dispositivos",
    academy: "SIRROS Academy",
    conclusionDate: "12/03/2026",
    validUntil: "12/03/2027",
    score: "92%",
    workload: "6h",
    icon: "monitor",
  },
  {
    id: "CERT-2026-0109",
    title: "Manutenção Preventiva de Dispositivos",
    academy: "SIRROS Academy",
    conclusionDate: "05/02/2026",
    validUntil: "05/02/2027",
    score: "94%",
    workload: "5h",
    icon: "wrench",
  },
];

function getUserFromStorage() {
  return JSON.parse(localStorage.getItem("user") || "{}");
}

export default function Certificates() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const navigate = useNavigate();

  const user = getUserFromStorage();

  const filteredCertificates = useMemo(() => {
    const term = search.toLowerCase();

    return certificates.filter((certificate) =>
      certificate.title.toLowerCase().includes(term) ||
      certificate.id.toLowerCase().includes(term)
    );
  }, [search]);

  const featuredCertificate = filteredCertificates[0];

  const otherCertificates = filteredCertificates.slice(1);

  function getCertificateIcon(type: CertificateType["icon"]) {
    if (type === "monitor") {
      return Monitor;
    }

    if (type === "wrench") {
      return Wrench;
    }

    return Award;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071827] px-4 py-6 sm:px-6 lg:px-10 transition-colors">
      <div className="max-w-[1500px] mx-auto space-y-7">

        {/* Header */}
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between ">
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex w-20 h-20 rounded-3xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 items-center justify-center shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
              <Award className="text-blue-600 dark:text-blue-400" size={38} />
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#080E2F] dark:text-white">
                Meus Certificados
              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Veja seus certificados conquistados e acompanhe seu desempenho.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-[360px]">
              <Search
                size={22}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Buscar certificados..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="
                  w-full
                  bg-white
                  dark:bg-[#091a2c]
                  border
                  border-gray-200
                  dark:border-white/10
                  rounded-2xl
                  py-4
                  pl-12
                  pr-4
                  text-[#080E2F]
                  dark:text-white
                  placeholder:text-gray-400
                  outline-none
                  focus:border-blue-500
                  transition
                "
              />
            </div>

            <div className="hidden sm:flex bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-2xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`
                  w-12
                  h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  transition
                  ${
                    viewMode === "grid"
                      ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                  }
                `}
              >
                <Grid3X3 size={22} />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`
                  w-12
                  h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  transition
                  ${
                    viewMode === "list"
                      ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                  }
                `}
              >
                <List size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <CertificateStatCard
            icon={Award}
            title="Total de Certificados"
            value={certificates.length}
            subtitle="Certificados emitidos"
            color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
          />

          <CertificateStatCard
            icon={TrendingUp}
            title="Média de Notas"
            value="96%"
            subtitle="Desempenho geral"
            color="bg-green-500/15 text-green-600 dark:text-green-400"
          />

          <CertificateStatCard
            icon={Calendar}
            title="Último Certificado"
            value="24/05/2026"
            subtitle="Data de emissão"
            color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
          />
        </div>

        {/* Featured certificate */}
        {featuredCertificate && (
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 ease-in-out
      hover:scale-105 dark:shadow-blue-500 dark:shadow-xs cursor-pointer">
            <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">

              {/* Preview */}
              <CertificatePreview
                studentName={user?.name || "Aluno"}
                courseTitle={featuredCertificate.title}
              />

              {/* Details */}
              <div className="flex flex-col justify-center ">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                      Certificado de Conclusão
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      {featuredCertificate.academy}
                    </p>

                    <h3 className="text-xl font-bold text-[#080E2F] dark:text-white mt-4">
                      {featuredCertificate.title}
                    </h3>
                  </div>

                  <span className="w-fit rounded-2xl bg-green-500/15 text-green-600 dark:text-green-400 px-5 py-2 font-semibold">
                    Nota: {featuredCertificate.score}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-y border-gray-200 dark:border-white/10 py-5 mt-5">
                  <InfoItem
                    icon={Calendar}
                    title="Data de Conclusão:"
                    value={featuredCertificate.conclusionDate}
                  />

                  <InfoItem
                    icon={Award}
                    title="ID do Certificado:"
                    value={featuredCertificate.id}
                  />

                  <InfoItem
                    icon={ShieldCheck}
                    title="Validade: 1 ano"
                    value={`Válido até ${featuredCertificate.validUntil}`}
                    success
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <button
                    onClick={() => navigate(`/certificate/${featuredCertificate.id}`)}
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      rounded-2xl
                      py-4
                      font-semibold
                      flex
                      items-center
                      justify-center
                      gap-3
                      transition
                      shadow-2xl
                      cursor-pointer
                    "
                  >
                    <Eye size={22} />
                    Ver certificado
                  </button>

                  <button
                    className="
                      border
                      border-blue-500/40
                      text-blue-600
                      dark:text-blue-400
                      rounded-2xl
                      py-4
                      font-semibold
                      flex
                      items-center
                      justify-center
                      gap-3
                      hover:bg-blue-500/10
                      transition
                      shadow-2xl
                      cursor-pointer
        
                    "
                  >
                    <Download size={22} />
                    Baixar PDF
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other certificates */}
        <section>
          <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white mb-5">
            Outros certificados emitidos
          </h2>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 xl:grid-cols-2 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {otherCertificates.map((certificate) => {
              const Icon = getCertificateIcon(certificate.icon);

              return (
                <article
                  key={certificate.id}
                  className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 ease-in-out
      hover:scale-105 dark:shadow-blue-500 dark:shadow-sm cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 ">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Icon size={34} />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-[#080E2F] dark:text-white">
                          {certificate.title}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                          <SmallInfo
                            icon={Calendar}
                            title="Data de Conclusão:"
                            value={certificate.conclusionDate}
                          />

                          <SmallInfo
                            icon={ShieldCheck}
                            title="Validade: 1 ano"
                            value={`Válido até ${certificate.validUntil}`}
                            success
                          />
                        </div>
                      </div>
                    </div>

                    <span className="w-fit rounded-2xl bg-green-500/15 text-green-600 dark:text-green-400 px-5 py-2 font-semibold text-sm">
                      Emitido
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <button
                      onClick={() => navigate(`/certificate/${certificate.id}`)}
                      className="
                        border
                        border-blue-500/40
                        text-blue-600
                        dark:text-blue-400
                        rounded-2xl
                        py-3
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-3
                        hover:bg-blue-500/10
                        transition
                        cursor-pointer
                      "
                    >
                      <Eye size={21} />
                      Ver certificado
                    </button>

                    <button
                      className="
                        border
                        border-blue-500/40
                        text-blue-600
                        dark:text-blue-400
                        rounded-2xl
                        py-3
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-3
                        hover:bg-blue-500/10
                        transition
                        cursor-pointer
                      "
                    >
                      <Download size={21} />
                      Baixar PDF
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="bg-white dark:bg-[#091a2c] border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3 text-gray-600 dark:text-gray-400 shadow-2xl dark:shadow-blue-500 dark:shadow-sm">
          <Info className="text-blue-600 dark:text-blue-400 shrink-0" />
          <p>
            Os certificados emitidos têm validade de 1 ano a partir da data de emissão.
          </p>
        </div>
      </div>
    </main>
  );
}

function CertificateStatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-sm dark:shadow-blue-500 cursor-pointer transition-all duration-300 ease-in-out
      hover:scale-105">
      <div className="flex items-center gap-5">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon size={34} />
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400 font-semibold">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-[#080E2F] dark:text-white mt-1">
            {value}
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
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
    <div className="relative bg-white border border-gray-300 rounded-2xl overflow-hidden h-[250px] shadow-2xl">
      <div className="absolute top-0 left-0 w-9 h-9 bg-blue-600 rounded-br-[2rem]" />
      <div className="absolute top-0 right-0 w-9 h-9 bg-blue-600 rounded-bl-[2rem]" />
      <div className="absolute bottom-0 left-0 w-9 h-9 bg-blue-600 rounded-tr-[2rem]" />
      <div className="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 rounded-tl-[2rem]" />

      <div className="h-full flex flex-col items-center justify-center text-center px-8">
        <h3 className="text-[#080E2F] font-bold text-sm mb-3">
          SIRROS
        </h3>

        <h2 className="text-[#080E2F] font-serif font-bold text-2xl">
          CERTIFICADO
        </h2>

        <p className="text-[#080E2F] font-serif font-bold text-sm">
          DE CONCLUSÃO
        </p>

        <p className="text-gray-500 text-xs mt-4">
          Certificamos que
        </p>

        <p className="font-serif text-2xl text-[#080E2F] mt-1">
          {studentName}
        </p>

        <div className="w-44 h-px bg-gray-300 my-2" />

        <p className="text-xs text-gray-500">
          concluiu com êxito o curso
        </p>

        <p className="text-[#080E2F] font-bold text-sm mt-1 line-clamp-2">
          {courseTitle}
        </p>

        <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center mt-4">
          <Award size={28} />
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  title,
  value,
  success = false,
}: {
  icon: any;
  title: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" size={24} />

      <div>
        <p className="text-gray-500 dark:text-gray-400">
          {title}
        </p>

        <p
          className={`font-semibold mt-1 ${
            success
              ? "text-green-600 dark:text-green-400"
              : "text-[#080E2F] dark:text-white"
          }`}
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
}: {
  icon: any;
  title: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 ">
      <Icon className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" size={20} />

      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {title}
        </p>

        <p
          className={`text-sm font-semibold mt-1 ${
            success
              ? "text-green-600 dark:text-green-400"
              : "text-[#080E2F] dark:text-white"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}