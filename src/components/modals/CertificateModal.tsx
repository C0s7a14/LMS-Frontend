import { X, Award, Download, Calendar, ShieldCheck, ExternalLink, Clock3 } from "lucide-react"; 
import { useState, useEffect } from "react";
import { downloadCertificatePdf } from "../../services/certificateService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  certificateId: number | null;
  certificateTitle: string;
  studentName: string;
  emitidoEm: string;
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
  validationCode,
  workload, 
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [validUntil, setValidUntil] = useState("");

  useEffect(() => {
    if (emitidoEm) {
      const issueDate = new Date(emitidoEm.split('/').reverse().join('-')); 
      const validDate = new Date(issueDate);
      validDate.setFullYear(validDate.getFullYear() + 1);
      setValidUntil(validDate.toLocaleDateString('pt-BR'));
    }
  }, [emitidoEm]);

  if (!isOpen) {
    return null;
  }

  // Generate QR Code URL
  const qrCodeData = validationCode 
    ? `${window.location.origin}/validar/${validationCode}`
    : String(certificateId);
    
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeData)}`;

  async function handleDownload() {
    if (!certificateId) return;
    
    try {
      setIsDownloading(true);
      const blob = await downloadCertificatePdf(certificateId);
      
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificado-${certificateTitle.replace(/\s+/g, '-')}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Erro ao baixar o certificado.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 transition-opacity">
      <div className="w-full max-w-5xl bg-white dark:bg-[#091a2c] rounded-3xl border border-gray-200 dark:border-white/10 p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Award className="text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                Detalhes do Certificado
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Visualize e baixe seu documento oficial
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6">
          
          {/* Anchored Absolute Positioning */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-gray-300 shadow-sm aspect-[1.414] bg-white">
            <img 
              src="/certificado_bg.png" 
              alt="Fundo do Certificado" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Student Name */}
            <div className="absolute top-[43%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-full text-center px-12">
              <p className="text-[#1C2B4B] font-bold text-3xl sm:text-4xl">
                {studentName}
              </p>
            </div>

            {/* Course Title */}
            <div className="absolute top-[65%] left-[59%] -translate-x-1/2 -translate-y-1/2 w-full text-center px-12">
              <p className="text-[#444444] text-lg sm:text-xl line-clamp-2">
                {certificateTitle}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-[#0d2238] rounded-2xl p-5 border border-gray-200 dark:border-white/5">
            <div className="flex items-start gap-3">
              <Calendar className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" size={20} />
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Data de Conclusão</p>
                <p className="font-semibold text-[#080E2F] dark:text-white mt-1">{emitidoEm}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-green-600 dark:text-green-400 shrink-0 mt-1" size={20} />
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Validade</p>
                <p className="font-semibold text-green-600 dark:text-green-400 mt-1">Até {validUntil}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock3 className="text-purple-600 dark:text-purple-400 shrink-0 mt-1" size={20} />
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Carga Horária</p>
                <p className="font-semibold text-[#080E2F] dark:text-white mt-1">{workload}</p>
              </div>
            </div>
          </div>

          {/* Validation Code & QR Code Block */}
          {validationCode && (
            <div className="p-5 bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código de Validação</p>
                    <p className="text-sm font-bold text-[#080E2F] dark:text-white font-mono">{validationCode}</p>
                  </div>
                </div>
                
                <a 
                  href={`/validar/${validationCode}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-transparent border border-gray-200 dark:border-white/20 text-sm font-medium text-blue-600 dark:text-blue-400 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all w-fit"
                >
                  Verificar Autenticidade
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-2 bg-white dark:bg-[#091a2c] rounded-xl border border-gray-200 dark:border-white/10 shrink-0">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code de Validação" 
                  className="w-24 h-24 object-contain rounded-lg"
                />
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            Fechar
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            {isDownloading ? "Baixando..." : "Baixar PDF"}
          </button>
        </div>

      </div>
    </div>
  );
}