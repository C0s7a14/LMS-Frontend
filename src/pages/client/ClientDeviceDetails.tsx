import {
  BotMessageSquare,
  Cpu,
  Download,
  FileText,
  Info,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../services/api";

type DeviceDetailTab = "overview" | "documents" | "support";

interface ClientDeviceDetailsType {
  id: number;
  nome: string;
  modelo?: string;
  tipo?: string;
  descricao?: string;
  imagem_url?: string;
  criado_em?: string;
}

interface ClientDeviceDocumentType {
  id: number;
  dispositivo_id: number;
  titulo: string;
  descricao?: string;
  nome_arquivo_original: string;
  status: string;
  total_chunks?: number;
  criado_em?: string;
}

export default function ClientDeviceDetails() {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<DeviceDetailTab>("overview");
  const [device, setDevice] = useState<ClientDeviceDetailsType | null>(null);
  const [documents, setDocuments] = useState<ClientDeviceDocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<
    number | null
  >(null);

  async function loadDeviceDetails() {
    try {
      setLoading(true);

      const [deviceResponse, documentsResponse] = await Promise.all([
        api.get<ClientDeviceDetailsType>(`/client/devices/${deviceId}`),
        api.get<ClientDeviceDocumentType[]>(
          `/client/devices/${deviceId}/documents`
        ),
      ]);

      setDevice(deviceResponse.data);
      setDocuments(documentsResponse.data);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.error || "Erro ao carregar dispositivo."
      );
      navigate("/devices");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadDocument(document: ClientDeviceDocumentType) {
    try {
      setDownloadingDocumentId(document.id);

      const response = await api.get(
        `/client/device-documents/${document.id}/download`,
        {
          responseType: "blob",
        }
      );

      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = window.document.createElement("a");

      link.href = fileUrl;
      link.setAttribute("download", document.nome_arquivo_original);
      window.document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(fileUrl);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.error || "Erro ao baixar documento."
      );
    } finally {
      setDownloadingDocumentId(null);
    }
  }

  useEffect(() => {
    loadDeviceDetails();
  }, [deviceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#06111f] flex items-center justify-center text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin mr-2" />
        Carregando dispositivo...
      </div>
    );
  }

  if (!device) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#06111f] text-[#080E2F] dark:text-white">
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <button
          type="button"
          onClick={() => navigate("/devices")}
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          ← Voltar para dispositivos
        </button>

        <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl dark:shadow-none">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr]">
            <div className="bg-gray-100 dark:bg-[#0d2238] p-8 flex items-center justify-center">
              {device.imagem_url ? (
                <img
                  src={device.imagem_url}
                  alt={device.nome}
                  className="max-h-72 object-contain"
                />
              ) : (
                <div className="w-40 h-40 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Cpu size={82} />
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  <Cpu size={18} />
                  {device.tipo || "Dispositivo Sirros"}
                </span>

                {device.modelo && (
                  <span className="inline-flex rounded-xl bg-gray-100 dark:bg-white/10 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Modelo {device.modelo}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold">
                {device.nome}
              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-3 leading-relaxed max-w-2xl">
                {device.descricao ||
                  "Consulte as informações técnicas, documentos e suporte IA deste dispositivo."}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-white/10 px-4 sm:px-8 overflow-x-auto">
            <div className="flex gap-3 min-w-max">
              <DeviceDetailTabButton
                active={activeTab === "overview"}
                icon={Info}
                label="Visão geral"
                onClick={() => setActiveTab("overview")}
              />

              <DeviceDetailTabButton
                active={activeTab === "documents"}
                icon={FileText}
                label="Documentação"
                onClick={() => setActiveTab("documents")}
              />

              <DeviceDetailTabButton
                active={activeTab === "support"}
                icon={BotMessageSquare}
                label="Suporte IA"
                onClick={() => setActiveTab("support")}
              />
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <InfoCard title="Nome" value={device.nome} />
                <InfoCard title="Modelo" value={device.modelo || "-"} />
                <InfoCard title="Categoria" value={device.tipo || "-"} />

                <div className="md:col-span-3 rounded-2xl border border-gray-200 dark:border-white/10 p-5">
                  <h2 className="font-bold text-lg mb-2">
                    Sobre o dispositivo
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    {device.descricao ||
                      "Nenhuma descrição cadastrada para este dispositivo."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-2xl font-bold">Documentação</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Manuais, fichas técnicas e documentos vinculados ao
                      dispositivo.
                    </p>
                  </div>

                  <span className="rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {documents.length} documento(s)
                  </span>
                </div>

                {documents.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 dark:border-white/10 p-8 text-center text-gray-500 dark:text-gray-400">
                    Nenhum documento cadastrado para este dispositivo.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((document) => (
                      <div
                        key={document.id}
                        className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <FileText size={24} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-bold truncate">
                              {document.titulo}
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                              {document.nome_arquivo_original}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="rounded-xl bg-gray-100 dark:bg-white/10 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                {document.status}
                              </span>

                              <span className="rounded-xl bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                                {document.total_chunks || 0} trechos IA
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownloadDocument(document)}
                          disabled={downloadingDocumentId === document.id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <Download size={18} />
                          {downloadingDocumentId === document.id
                            ? "Baixando..."
                            : "Baixar"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "support" && (
              <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6 sm:p-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5">
                  <MessageCircle size={32} />
                </div>

                <h2 className="text-2xl font-bold">Suporte IA</h2>

                <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl leading-relaxed">
                  Converse com o agente técnico da Sirros para tirar dúvidas
                  sobre instalação, configuração, operação e documentação deste
                  dispositivo.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/support")}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-all"
                >
                  <BotMessageSquare size={20} />
                  Abrir suporte IA
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function DeviceDetailTabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-4 border-b-4 font-semibold transition-all
        ${
          active
            ? "border-blue-600 text-blue-600 dark:text-blue-400"
            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-600"
        }
      `}
    >
      <Icon size={19} />
      {label}
    </button>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-5">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <strong className="block mt-2 text-lg">{value}</strong>
    </div>
  );
}