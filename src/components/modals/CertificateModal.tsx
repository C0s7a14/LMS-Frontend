import { X, Award, Download, Calendar, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { downloadCertificatePdf } from "../../services/certificateService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  certificateId: number | null;
  certificateTitle: string;
  studentName: string;
  emitidoEm: string;
}

export default function CertificateModal({
  isOpen,
  onClose,
  certificateId,
  certificateTitle,
  studentName,
  emitidoEm,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [validUntil, setValidUntil] = useState("");

  useEffect(() => {
    if (emitidoEm) {
      // Calculate 1 year validity to match your UI logic
      const issueDate = new Date(emitidoEm.split('/').reverse().join('-')); // Basic string to Date handling
      const validDate = new Date(issueDate);
      validDate.setFullYear(validDate.getFullYear() + 1);
      setValidUntil(validDate.toLocaleDateString('pt-BR'));
    }
  }, [emitidoEm]);

  if (!isOpen) {
    return null;
  }

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
      <div className="w-full max-w-3xl bg-white dark:bg-[#091a2c] rounded-3xl border border-gray-200 dark:border-white/10 p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
        
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
          {/* Visual Preview */}
          <div className="relative bg-white border border-gray-300 rounded-2xl overflow-hidden h-[300px] shadow-sm flex flex-col items-center justify-center text-center px-8">
            <div className="absolute top-0 left-0 w-9 h-9 bg-blue-600 rounded-br-[2rem]" />
            <div className="absolute top-0 right-0 w-9 h-9 bg-blue-600 rounded-bl-[2rem]" />
            <div className="absolute bottom-0 left-0 w-9 h-9 bg-blue-600 rounded-tr-[2rem]" />
            <div className="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 rounded-tl-[2rem]" />

            <h3 className="text-[#080E2F] font-bold text-sm mb-3">SIRROS</h3>
            <h2 className="text-[#080E2F] font-serif font-bold text-3xl">CERTIFICADO</h2>
            <p className="text-[#080E2F] font-serif font-bold text-md">DE CONCLUSÃO</p>
            
            <p className="text-gray-500 text-sm mt-5">Certificamos que</p>
            <p className="font-serif text-3xl text-[#080E2F] mt-1">{studentName}</p>
            
            <div className="w-64 h-px bg-gray-300 my-3" />
            
            <p className="text-sm text-gray-500">concluiu com êxito o curso</p>
            <p className="text-[#080E2F] font-bold text-lg mt-1 line-clamp-2">{certificateTitle}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-[#0d2238] rounded-2xl p-5 border border-gray-200 dark:border-white/5">
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
          </div>
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
            {isDownloading ? "Baixando..." : "Baixar PDF Oficial"}
          </button>
        </div>

      </div>
    </div>
  );
}