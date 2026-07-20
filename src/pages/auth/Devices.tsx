import {
  Search,
  Grid3X3,
  List,
  Star,
  BookOpen,
  ArrowRight,
  Cpu,
  Plus,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import toast from "react-hot-toast";

import DeviceModal from "../../components/modals/DeviceModal";

interface DeviceType {
  id: number;
  nome: string;
  modelo?: string;
  tipo?: string;
  descricao?: string;
  imagem_url?: string;
  criado_em?: string;
}

export default function Device() {
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userRole = user?.role;
  const isAdmin = userRole === "admin";
  const isClient = userRole === "client";


 async function getDevices() {
  try {
    setLoading(true);

    const endpoint = isClient ? "/client/devices" : "/devices";

    const response = await api.get<DeviceType[]>(endpoint);

    setDevices(response.data);
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar dispositivos");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    getDevices();
  }, []);

  const filteredDevices = devices.filter((device) => {
    const searchLower = search.toLowerCase();

    return (
      device.nome?.toLowerCase().includes(searchLower) ||
      device.modelo?.toLowerCase().includes(searchLower) ||
      device.tipo?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071827] px-6 py-8 lg:px-12 transition-colors">
      <div className="max-w-[1500px] mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between mb-10">
          <div>
           <h1 className="text-3xl lg:text-4xl font-bold text-[#080E2F] dark:text-white">
            {isClient ? "Meus Dispositivos SIRROS" : "Dispositivos SIRROS"}
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2 text-base lg:text-lg">
            {isClient
              ? "Acesse os dispositivos vinculados à sua empresa."
              : "Selecione um dispositivo para acessar os cursos"}
          </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

            {/* Search */}
            <div className="relative w-full sm:w-[360px]">
              <Search
                size={22}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Buscar dispositivos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                  dark:placeholder:text-gray-500
                  outline-none
                  focus:border-blue-500
                  transition-all
                  shadow-2xl
                  dark:shadow-sm dark:shadow-blue-500
                "
              />
            </div>

            {/* Botão Novo Dispositivo */}
           {isAdmin && (
            <button
              onClick={() => setModalOpen(true)}
              className="
                bg-blue-500
                hover:bg-blue-600
                text-white
                h-16
                px-5
                py-4
                rounded-2xl
                font-semibold
                transition-all
                flex
                items-center
                justify-center
                gap-2
                shadow-2xl
                dark:shadow-sm
                dark:shadow-blue-500
              "
            >
              <Plus size={20} />
              Novo Dispositivo
            </button>
          )}
            {/* View buttons */}
            <div className="hidden sm:flex bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-2xl p-1 shadow-2xl  dark:shadow-sm dark:shadow-blue-500">
              <button
                onClick={() => setViewMode("grid")}
                className={`
                  w-12
                  h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  transition-all
                  cursor-pointer
                  ${
                    viewMode === "grid"
                      ? "bg-blue-500/20 text-blue-500 dark:text-blue-400"
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
                  transition-all
                  cursor-pointer
                  ${
                    viewMode === "list"
                      ? "bg-blue-500/20 text-blue-500 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                  }
                `}
              >
                <List size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-10 text-center text-gray-500 dark:text-gray-400 ">
            Carregando dispositivos...
          </div>
        )}

        {/* Empty */}
        {!loading && filteredDevices.length === 0 && (
          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-10 text-center ">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Cpu size={36} className="text-blue-500 dark:text-blue-400" />
            </div>

            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
              Nenhum dispositivo encontrado
            </h2>

            {isClient
              ? "Nenhum dispositivo foi vinculado à sua conta ainda."
              : "Cadastre dispositivos para eles aparecerem aqui."}
          </div>
        )}

        {/* Devices */}
        {!loading && filteredDevices.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7"
                : "flex flex-col gap-5"
            }
          >
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                className={`
                  bg-white
                  dark:bg-[#091a2c]
                  border
                  border-gray-200
                  dark:border-white/10
                  rounded-3xl
                  hover:border-blue-500/40
                  hover:-translate-y-1
                  transition-all
                  overflow-hidden
                  shadow-2xl dark:shadow-sm dark:shadow-blue-500
                  ${
                    viewMode === "list"
                      ? "flex flex-col md:flex-row md:items-center"
                      : ""
                  }
                `}
              >
                {/* Área da imagem */}
                <div
                  className={`
                    relative
                    p-6
                    bg-gray-100
                    dark:bg-[#0d2238]
                    ${
                      viewMode === "list"
                        ? "md:w-72 h-56 md:h-48"
                        : "h-64"
                    }
                  `}
                >
                  <div className="absolute top-5 left-5 z-10 bg-blue-500/20 text-blue-500 dark:text-blue-400 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium ">
                    <Star size={16} fill="currentColor" />
                    {device.tipo || "Dispositivo"}
                  </div>

                  <button className="absolute top-5 right-5 z-10 text-gray-400 hover:text-blue-400 transition-all">
                    <Star size={24} />
                  </button>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-44 h-44 rounded-full bg-blue-500/10 blur-sm" />
                  </div>

                  <div className="relative z-10 h-full flex items-center justify-center">
                    {device.imagem_url ? (
                      <img
                        src={device.imagem_url}
                        alt={device.nome}
                        className="max-h-44 max-w-[85%] object-contain drop-shadow-xl"
                      />
                    ) : (
                      <div className="w-36 h-36 rounded-3xl bg-blue-500/20 flex items-center justify-center">
                        <Cpu
                          size={70}
                          className="text-blue-500 dark:text-blue-400"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 flex-1">
                  <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white mb-2">
                    {device.nome}
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed min-h-[52px]">
                    {device.descricao ||
                      "Dispositivo SIRROS para treinamentos e cursos da plataforma."}
                  </p>

                  {device.modelo && (
                    <p className="text-sm text-blue-500 dark:text-blue-400 font-medium mt-3">
                      Modelo: {device.modelo}
                    </p>
                  )}

                  <div className="border-t border-gray-200 dark:border-white/10 mt-5 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-blue-500 dark:text-blue-400">
                      <BookOpen size={24} />

                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        {isClient ? "Abrir suporte IA" : "Ver cursos"}
                      </span>
                    </div>

                    <button
                     onClick={() => {
                      if (isClient) {
                        navigate("/support");
                        return;
                      }

                      navigate(`/devices/${device.id}/courses`);
                    }}
                        className="
                        w-12
                        h-12
                        rounded-xl
                        bg-blue-500/20
                        text-blue-500
                        dark:text-blue-400
                        flex
                        items-center
                        justify-center
                        hover:bg-blue-500
                        hover:text-white
                        transition-all
                        cursor-pointer
                      "
                    >
                      <ArrowRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isAdmin && (
        <DeviceModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={getDevices}
        />
      )}
      </div>
    </main>
  );
}