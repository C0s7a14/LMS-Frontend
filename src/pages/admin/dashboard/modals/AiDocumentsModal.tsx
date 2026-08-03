import type { ChangeEvent } from "react";
import { Plus, X } from "lucide-react";

import type { DeviceType } from "../types/adminDashboard.types";

interface AiDocument {
  id: number;
  titulo: string;
  nome_arquivo_original: string;
  total_chunks?: number | null;
  status: string;
}

interface AiDocumentsModalProps {
  device: DeviceType | null;
  documents: AiDocument[];
  loading: boolean;
  uploading: boolean;
  processingDocumentId: number | null;
  onClose: () => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onProcess: (documentId: number) => void;
  onDelete: (documentId: number) => void;
}

export default function AiDocumentsModal({
  device,
  documents,
  loading,
  uploading,
  processingDocumentId,
  onClose,
  onUpload,
  onProcess,
  onDelete,
}: AiDocumentsModalProps) {
  if (!device) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
              PDFs da IA
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Base de conhecimento do dispositivo{" "}
              <strong>{device.nome}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-all"
          >
            <X size={26} />
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-blue-400 bg-blue-500/5 p-5">
          <label className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer">
            <div>
              <h3 className="font-bold text-[#080E2F] dark:text-white">
                Adicionar PDF
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Envie manuais, fichas técnicas ou documentos do
                dispositivo.
              </p>
            </div>

            <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition-all">
              <Plus size={18} />

              {uploading
                ? "Enviando..."
                : "Selecionar PDF"}
            </span>

            <input
              type="file"
              accept="application/pdf"
              onChange={onUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        <div className="mt-6">
          <h3 className="font-bold text-[#080E2F] dark:text-white mb-4">
            Documentos cadastrados
          </h3>

          {loading ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              Carregando documentos...
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((document) => {
                const isProcessing =
                  processingDocumentId === document.id;

                return (
                  <div
                    key={document.id}
                    className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#080E2F] dark:text-white truncate">
                        {document.titulo}
                      </h4>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {document.nome_arquivo_original}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                          {document.total_chunks ?? 0} chunks
                        </span>

                        <span
                          className={`
                            px-3 py-1 rounded-xl text-sm font-semibold
                            ${
                              document.status === "processado"
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : document.status === "erro"
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                            }
                          `}
                        >
                          {document.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onProcess(document.id)
                        }
                        disabled={isProcessing}
                        className="rounded-xl bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-60"
                      >
                        {isProcessing
                          ? "Processando..."
                          : "Processar"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(document.id)
                        }
                        className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/20 transition-all"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-2xl">
              Nenhum PDF cadastrado para este dispositivo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}