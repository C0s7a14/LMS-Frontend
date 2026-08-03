import {
  Award,
  BadgeCheck,
  Calendar,
  Clock3,
  Copy,
  ShieldAlert,
  User,
  Loader2,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";


import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { validateCertificateCode } from "../../services/certificateService"; 

interface ValidatedCertificate {
  validation_code: string;
  curso_titulo: string;
  student_name: string;
  emitido_em: string;
  workload: string;
}

export default function CertificateDetails() {
  const { certificateId } = useParams<{ certificateId: string }>();

  const [certificate, setCertificate] = useState<ValidatedCertificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchValidation() {
      if (!certificateId) return;

      try {
        setIsLoading(true);
        setError(false);
        const data = await validateCertificateCode(certificateId);

        if (data.isValid === false) {
          setError(true);
          return;
        }

        setCertificate(data);
      } catch (err) {
        console.error("Erro ao validar certificado:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchValidation();
  }, [certificateId]);

  function copyCode() {
    if (certificate) {
      navigator.clipboard.writeText(certificate.validation_code);
      alert("Código copiado com sucesso!");
    }
  }

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#071827]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">https://www.crunchyroll.com/pt-br/discover
          Verificando autenticidade no sistema...
        </p>
      </div>
    );
  }

  // 2. ERROR STATE (Invalid or Fake Certificate)
  if (error || !certificate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#071827] px-4">
        <div className="bg-white dark:bg-[#091a2c] p-8 rounded-3xl border border-red-200 dark:border-red-900/30 shadow-2xl text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Certificado Inválido</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Não conseguimos encontrar um certificado autêntico com o código fornecido. Verifique se o link está correto.
          </p>
          <div className="bg-gray-100 dark:bg-black/20 p-4 rounded-xl font-mono text-gray-500 break-all border border-gray-200 dark:border-white/10">
            Código buscado: {certificateId}
          </div>
        </div>
      </div>
    );
  }

  // Calculate Validity Date (1 year from issue)
  const issueDate = new Date(certificate.emitido_em);
  const validDate = new Date(issueDate);
  validDate.setFullYear(validDate.getFullYear() + 1);
  
  const formattedIssueDate = issueDate.toLocaleDateString('pt-BR');
  const formattedValidDate = validDate.toLocaleDateString('pt-BR');

  // 3. SUCCESS STATE
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071827] px-4 py-8 sm:px-6 lg:px-10 transition-colors flex items-center justify-center">
      <div className="max-w-[1200px] w-full mx-auto space-y-8">
        
        {/* TOP BANNER: Validation Status */}
        <div className="bg-green-600 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-white shadow-lg">
          <div className="bg-white/20 p-4 rounded-full shrink-0">
            <BadgeCheck size={40} className="text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
              CERTIFICADO VÁLIDO E AUTÊNTICO
            </h1>
            <p className="text-green-50 mt-2 text-lg">
              Este documento foi verificado eletronicamente e é oficialmente reconhecido pela SIRROS Academy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
          
          {/* LEFT COLUMN: The Actual Certificate Display */}
          <section className="space-y-6">
            <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-4 shadow-xl">
              <BigCertificatePreview
                studentName={certificate.student_name}
                courseTitle={certificate.curso_titulo}
                validationCode={certificate.validation_code}
              />
            </div>
          </section>

          {/* RIGHT COLUMN: Official Details */}
          <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col h-full">
            <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-white/10">
              Detalhes do Documento Oficial
            </h2>

            <div className="space-y-2 flex-1">
              <CertificateDetailRow icon={User} label="Aluno(a)" value={certificate.student_name} />
              <CertificateDetailRow icon={Award} label="Curso" value={certificate.curso_titulo} />
              <CertificateDetailRow icon={Calendar} label="Emitido em" value={formattedIssueDate} />
              <CertificateDetailRow icon={BadgeCheck} label="Válido até" value={formattedValidDate} />
              <CertificateDetailRow icon={Clock3} label="Carga horária" value={certificate.workload || "Não especificada"} />
            </div>

            {/* Validation Code Box */}
            <div className="mt-8 bg-gray-50 dark:bg-[#0d2238] rounded-2xl p-6 border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Código de Validação
              </p>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-[#080E2F] dark:text-white mb-6 break-all tracking-wider">
                {certificate.validation_code}
              </p>
              <button 
                onClick={copyCode}
                className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors font-semibold w-full justify-center"
              >
                <Copy size={20} /> Copiar Código
              </button>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

// Certificate Preview
function BigCertificatePreview({
  studentName,
  courseTitle,
}: {
  studentName: string;
  courseTitle: string;
  validationCode: string;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-gray-300 shadow-sm aspect-[1.414] bg-white">
      <img 
        src="/certificado_bg.png" 
        alt="Fundo do Certificado" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Student Name */}
      <div className="absolute top-[43%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-full text-center px-12">
        <p className="text-[#1C2B4B] font-bold text-2xl sm:text-3xl md:text-4xl">
          {studentName}
        </p>
      </div>

      {/* Course Title */}
      <div className="absolute top-[65%] left-[59%] -translate-x-1/2 -translate-y-1/2 w-full text-center px-12">
        <p className="text-[#444444] text-sm sm:text-lg md:text-xl line-clamp-2">
          {courseTitle}
        </p>
      </div>
    </div>
  );
}

// COMPONENT: Detail Row
interface CertificateDetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function CertificateDetailRow({
  icon: Icon,
  label,
  value,
}: CertificateDetailRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-5 py-4 border-b border-gray-50 dark:border-white/5 last:border-0">
      <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg shrink-0">
          <Icon
            className="text-blue-600 dark:text-blue-400"
            size={20}
          />
        </div>

        <span className="font-medium">{label}</span>
      </div>

      <strong className="text-[#080E2F] dark:text-white sm:text-right text-lg">
        {value}
      </strong>
    </div>
  );
}