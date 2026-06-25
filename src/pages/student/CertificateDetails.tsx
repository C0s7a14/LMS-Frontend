import {
  Award,
  BadgeCheck,
  Calendar,
  Clock3,
  Copy,
  Download,
  Eye,
  Info,
  Search,
  Share2,
  ShieldCheck,
  User,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

interface CertificateType {
  id: string;
  title: string;
  academy: string;
  student: string;
  issuedAt: string;
  workload: string;
  validUntil: string;
  status: string;
}

const certificates: CertificateType[] = [
  {
    id: "CERT-2026-0148",
    title: "Instalação e Configuração do SIRROS LogiTrack",
    academy: "SIRROS Academy",
    student: "Lucas Silva",
    issuedAt: "24/05/2026",
    workload: "8h",
    validUntil: "24/05/2027",
    status: "Emitido",
  },
  {
    id: "CERT-2026-0122",
    title: "Operação e Monitoramento de Dispositivos",
    academy: "SIRROS Academy",
    student: "Lucas Silva",
    issuedAt: "12/03/2026",
    workload: "6h",
    validUntil: "12/03/2027",
    status: "Emitido",
  },
  {
    id: "CERT-2026-0109",
    title: "Manutenção Preventiva de Dispositivos",
    academy: "SIRROS Academy",
    student: "Lucas Silva",
    issuedAt: "05/02/2026",
    workload: "5h",
    validUntil: "05/02/2027",
    status: "Emitido",
  },
];

function getUserFromStorage() {
  return JSON.parse(localStorage.getItem("user") || "{}");
}

export default function CertificateDetails() {
  const { certificateId } = useParams();

  const user = getUserFromStorage();

  const certificate =
    certificates.find((item) => item.id === certificateId) ||
    certificates[0];

  const studentName = user?.name || certificate.student;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    certificate.id
  )}`;

  function copyCode() {
    navigator.clipboard.writeText(certificate.id);
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071827] px-4 py-6 sm:px-6 lg:px-10 transition-colors">
      <div className="max-w-[1500px] mx-auto space-y-7">

        {/* Top */}
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold mb-5">
              <Link
                to="/certificate"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Meus Certificados
              </Link>

              <span className="text-gray-400">›</span>

              <span className="text-gray-600 dark:text-gray-400">
                Certificado
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-[#080E2F] dark:text-white">
              Certificado de Conclusão
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-3">
              Visualize, baixe e valide seu certificado.
            </p>
          </div>

          <div className="relative w-full xl:w-[420px]">
            <Search
              size={22}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Buscar certificado..."
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
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] gap-6">

          {/* Left */}
          <section className="space-y-6">
            <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-4 sm:p-6 shadow-[0_16px_35px_rgba(15,23,42,0.08)] dark:shadow-none">
              <BigCertificatePreview
                studentName={studentName}
                courseTitle={certificate.title}
                workload={certificate.workload}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
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
                "
              >
                <Eye size={22} />
                Visualizar PDF
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
                "
              >
                <Download size={22} />
                Baixar PDF
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
                "
              >
                <Share2 size={22} />
                Compartilhar
              </button>
            </div>
          </section>

          {/* Right */}
          <section className="space-y-6">

            {/* Info card */}
            <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-5 sm:p-7 shadow-[0_16px_35px_rgba(15,23,42,0.08)] dark:shadow-none">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                  {certificate.title}
                </h2>

                <span className="w-fit bg-green-500/15 text-green-600 dark:text-green-400 rounded-2xl px-5 py-2 font-semibold flex items-center gap-2">
                  <BadgeCheck size={18} />
                  {certificate.status}
                </span>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-white/10">
                <CertificateDetailRow
                  icon={User}
                  label="Aluno:"
                  value={studentName}
                />

                <CertificateDetailRow
                  icon={Calendar}
                  label="Emitido em:"
                  value={certificate.issuedAt}
                />

                <CertificateDetailRow
                  icon={Award}
                  label="Código do certificado:"
                  value={certificate.id}
                />

                <CertificateDetailRow
                  icon={Clock3}
                  label="Carga horária:"
                  value={certificate.workload}
                />
              </div>
            </div>

            {/* Validation card */}
            <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-5 sm:p-7 shadow-[0_16px_35px_rgba(15,23,42,0.08)] dark:shadow-none">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_190px] gap-6 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                    Validar certificado
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                    Use o código ou QR Code para validar a autenticidade do certificado.
                  </p>

                  <div className="mt-5">
                    <label className="text-gray-500 dark:text-gray-400 font-medium">
                      Código de validação
                    </label>

                    <div className="mt-2 flex items-center gap-3 bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3">
                      <span className="text-[#080E2F] dark:text-white text-lg font-semibold flex-1">
                        {certificate.id}
                      </span>

                      <button
                        onClick={copyCode}
                        className="text-blue-600 dark:text-blue-400 hover:scale-110 transition"
                        title="Copiar código"
                      >
                        <Copy size={22} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 bg-green-500/15 text-green-600 dark:text-green-400 rounded-2xl px-4 py-3 font-semibold flex items-center gap-3">
                    <ShieldCheck size={24} />
                    Certificado válido
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-[0_12px_25px_rgba(15,23,42,0.10)] mx-auto">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code do certificado"
                    className="w-40 h-40 object-contain"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-white dark:bg-[#091a2c] border border-blue-500/20 rounded-2xl p-5 flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Info className="text-blue-600 dark:text-blue-400 shrink-0" />
          <p>
            Este certificado é único e pode ser validado pelo código ou QR Code.
          </p>
        </div>
      </div>
    </main>
  );
}

function BigCertificatePreview({
  studentName,
  courseTitle,
  workload,
}: {
  studentName: string;
  courseTitle: string;
  workload: string;
}) {
  return (
    <div className="relative bg-white rounded-3xl overflow-hidden min-h-[420px] sm:min-h-[520px] border border-gray-200 shadow-2xl">
      <div className="absolute top-0 left-0 w-20 h-20 bg-blue-600 rounded-br-[2.5rem]" />
      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600 rounded-bl-[2.5rem]" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-600 rounded-tr-[2.5rem]" />
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-600 rounded-tl-[2.5rem]" />

      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_center,#2563eb_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="relative h-full min-h-[420px] sm:min-h-[520px] flex flex-col items-center justify-center text-center px-6 sm:px-12">
        <h3 className="text-[#080E2F] font-bold text-xl mb-8">
          SIRROS
        </h3>

        <h2 className="text-[#080E2F] font-serif font-bold text-4xl sm:text-5xl"> 
          CERTIFICADO
        </h2>

        <p className="text-[#080E2F] font-serif font-bold text-2xl mt-1">
          DE CONCLUSÃO
        </p>

        <p className="text-gray-500 mt-8">
          Certificamos que
        </p>

        <p className="font-serif text-4xl sm:text-5xl text-[#080E2F] mt-3">
          {studentName}
        </p>

        <div className="w-64 h-px bg-gray-300 my-4" />

        <p className="text-gray-500">
          concluiu com êxito o curso
        </p>

        <p className="text-[#080E2F] font-bold text-xl sm:text-2xl mt-3 max-w-2xl">
          {courseTitle}
        </p>

        <p className="text-gray-500 mt-5">
          com carga horária de {workload}.
        </p>

        <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center mt-8 shadow-xl">
          <Award size={42} />
        </div>
      </div>
    </div>
  );
}

function CertificateDetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-5">
      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
        <Icon className="text-blue-600 dark:text-blue-400" size={26} />

        <span className="font-medium">
          {label}
        </span>
      </div>

      <strong className="text-[#080E2F] dark:text-white text-right">
        {value}
      </strong>
    </div>
  );
}