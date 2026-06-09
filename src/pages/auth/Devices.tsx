import {
  Search,
  Grid3X3,
  List,
  Star,
  BookOpen,
  ArrowRight,
  Cpu,
  Plus,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

interface DeviceType {
  id: number;
  nome: string;
  modelo?: string;
  tipo?: string;
  descricao?: string;
  imagem_url?: string;
  criado_em?: string;
}

interface DeviceFormData {
  nome: string;
  modelo: string;
  tipo: string;
  descricao: string;
  imagem_url: string;
}

export default function Device() {
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState<DeviceFormData>({
    nome: "",
    modelo: "",
    tipo: "",
    descricao: "",
    imagem_url: "",
  });

  const navigate = useNavigate();

  async function getDevices() {
    try {
      setLoading(true);

      const response = await axios.get<DeviceType[]>(
        "http://localhost:3333/devices"
      );

      setDevices(response.data);
    } catch (error) {
      console.log(error);
      alert("Erro ao buscar dispositivos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDevices();
  }, []);

  async function handleCreateDevice(e: FormEvent) {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert("O nome do dispositivo é obrigatório");
      return;
    }

    try {
      setCreating(true);

      await axios.post(
        "http://localhost:3333/devices",
        formData
      );

      setModalOpen(false);

      setFormData({
        nome: "",
        modelo: "",
        tipo: "",
        descricao: "",
        imagem_url: "",
      });

      await getDevices();
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar dispositivo");
    } finally {
      setCreating(false);
    }
  }

  const filteredDevices = devices.filter((device) => {
    const searchLower = search.toLowerCase();

    return (
      device.nome?.toLowerCase().includes(searchLower) ||
      device.modelo?.toLowerCase().includes(searchLower) ||
      device.tipo?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <main className="min-h-screen bg-[#071827] px-6 py-8 lg:px-12">
      <div className="max-w-[1500px] mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              Dispositivos SIRROS
            </h1>

            <p className="text-gray-400 mt-2 text-base lg:text-lg">
              Selecione um dispositivo para acessar os cursos
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
                  bg-[#091a2c]
                  border
                  border-white/10
                  rounded-2xl
                  py-4
                  pl-12
                  pr-4
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  focus:border-blue-500
                  transition-all
                "
              />
            </div>

            {/* Botão Novo Dispositivo */}
            <button
              onClick={() => setModalOpen(true)}
              className="
                bg-blue-500
                hover:bg-blue-600
                text-white
                w-30
                h-16
                px-5
                py-4
                rounded-2xl
                font-semibold
                transition-all
                flex
                items-center
                justify-center
                gap-1
              "
            >
              <Plus size={20} />
              Novo Dispositivo
            </button>

            {/* View buttons */}
            <div className="hidden sm:flex bg-[#091a2c] border border-white/10 rounded-2xl p-1">
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
                  ${
                    viewMode === "grid"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:bg-white/5"
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
                  ${
                    viewMode === "list"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:bg-white/5"
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
          <div className="bg-[#091a2c] border border-white/10 rounded-3xl p-10 text-center text-gray-400">
            Carregando dispositivos...
          </div>
        )}

        {/* Empty */}
        {!loading && filteredDevices.length === 0 && (
          <div className="bg-[#091a2c] border border-white/10 rounded-3xl p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Cpu size={36} className="text-blue-400" />
            </div>

            <h2 className="text-xl font-bold text-white">
              Nenhum dispositivo encontrado
            </h2>

            <p className="text-gray-400 mt-2">
              Cadastre dispositivos para eles aparecerem aqui.
            </p>
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
                  bg-[#091a2c]
                  border
                  border-white/10
                  rounded-3xl
                  hover:border-blue-500/40
                  hover:-translate-y-1
                  transition-all
                  overflow-hidden
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
                    bg-[#0d2238]
                    ${
                      viewMode === "list"
                        ? "md:w-72 h-56 md:h-48"
                        : "h-64"
                    }
                  `}
                >
                  <div className="absolute top-5 left-5 z-10 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
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
                          className="text-blue-400"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {device.nome}
                  </h2>

                  <p className="text-gray-400 leading-relaxed min-h-[52px]">
                    {device.descricao ||
                      "Dispositivo SIRROS para treinamentos e cursos da plataforma."}
                  </p>

                  {device.modelo && (
                    <p className="text-sm text-blue-400 font-medium mt-3">
                      Modelo: {device.modelo}
                    </p>
                  )}

                  <div className="border-t border-white/10 mt-5 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-blue-400">
                      <BookOpen size={24} />

                      <span className="text-gray-400 font-medium">
                        Ver cursos
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/devices/${device.id}/courses`)
                      }
                      className="
                        w-12
                        h-12
                        rounded-xl
                        bg-blue-500/20
                        text-blue-400
                        flex
                        items-center
                        justify-center
                        hover:bg-blue-500
                        hover:text-white
                        transition-all
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

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-2xl bg-[#091a2c] rounded-3xl border border-white/10 p-6">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Novo Dispositivo
                  </h2>

                  <p className="text-gray-400 mt-1">
                    Cadastre um novo dispositivo SIRROS
                  </p>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={handleCreateDevice}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    Nome
                  </label>

                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nome: e.target.value,
                      })
                    }
                    placeholder="Sensor de Temperatura"
                    className="bg-[#0d2238] border border-white/10 text-white placeholder:text-gray-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    Modelo
                  </label>

                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        modelo: e.target.value,
                      })
                    }
                    placeholder="SIRROS-TEMP-01"
                    className="bg-[#0d2238] border border-white/10 text-white placeholder:text-gray-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    Tipo
                  </label>

                  <input
                    type="text"
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipo: e.target.value,
                      })
                    }
                    placeholder="sensor, contador, rastreador..."
                    className="bg-[#0d2238] border border-white/10 text-white placeholder:text-gray-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    URL da Imagem
                  </label>

                  <input
                    type="text"
                    value={formData.imagem_url}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        imagem_url: e.target.value,
                      })
                    }
                    placeholder="https://imagem.com/sensor.png"
                    className="bg-[#0d2238] border border-white/10 text-white placeholder:text-gray-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    Descrição
                  </label>

                  <textarea
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descricao: e.target.value,
                      })
                    }
                    placeholder="Descrição do dispositivo..."
                    rows={4}
                    className="bg-[#0d2238] border border-white/10 text-white placeholder:text-gray-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="
                      px-5
                      py-3
                      rounded-2xl
                      border
                      border-white/10
                      text-gray-300
                      font-medium
                      hover:bg-white/5
                      transition-all
                    "
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="
                      px-6
                      py-3
                      rounded-2xl
                      bg-blue-500
                      text-white
                      font-semibold
                      hover:bg-blue-600
                      transition-all
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  >
                    {creating
                      ? "Cadastrando..."
                      : "Cadastrar Dispositivo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}