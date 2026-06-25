import {
  BookOpen,
  Save,
  Upload,
  FileText,
  Box,
  Plus,
  Trash2,
  Cpu,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { api } from "../../services/api";
import toast from "react-hot-toast";

interface DeviceType {
  id: number;
  nome: string;
  modelo?: string;
  tipo?: string;
}

interface ModuleType {
  titulo: string;
  conteudo: string;
}

export default function CreateCourse() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [nivel, setNivel] = useState("");
  const [descricao, setDescricao] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [pdfName, setPdfName] = useState("");

  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);

  const [modules, setModules] = useState<ModuleType[]>([
    {
      titulo: "",
      conteudo: "",
    },
  ]);

  const [saving, setSaving] = useState(false);

  async function getDevices() {
  try {
    const response = await api.get<DeviceType[]>(
      "/devices"
    );

    setDevices(response.data);
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar dispositivos");
  }
}

  useEffect(() => {
    getDevices();
  }, []);

  function toggleDevice(deviceId: number) {
    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(
        selectedDevices.filter((id) => id !== deviceId)
      );
    } else {
      setSelectedDevices([...selectedDevices, deviceId]);
    }
  }

  function handleAddModule() {
    setModules([
      ...modules,
      {
        titulo: "",
        conteudo: "",
      },
    ]);
  }

  function handleRemoveModule(index: number) {
    if (modules.length === 1) {
      toast.error("O curso precisa ter pelo menos um módulo");
      return;
    }

    setModules(modules.filter((_, i) => i !== index));
  }

  function handleModuleChange(
    index: number,
    field: keyof ModuleType,
    value: string
  ) {
    const updatedModules = [...modules];

    updatedModules[index][field] = value;

    setModules(updatedModules);
  }

  function handleSelectPdf() {
    fileInputRef.current?.click();
  }

  function handlePdfChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setPdfName(file.name);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!titulo.trim()) {
      toast.error("O título do curso é obrigatório");
      return;
    }

    try {
      setSaving(true);

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (!user?.id) {
        toast.error("Usuário logado não encontrado");
        return;
      }

            const response = await api.post(
        "/courses",
        {
          titulo,
          descricao,
          thumbnail,
          criado_por: user.id,
        }
      );

      const courseId =
        response.data.courseId ||
        response.data.cursoId ||
        response.data.id;

      if (courseId && selectedDevices.length > 0) {
        await Promise.all(
          selectedDevices.map((deviceId) =>
           api.post(
            `/devices/courses/${courseId}/devices/${deviceId}`
          )
           )
        );
      }

      toast.success("Curso criado com sucesso!");

      setTitulo("");
      setCategoria("");
      setNivel("");
      setDescricao("");
      setThumbnail("");
      setPdfName("");
      setSelectedDevices([]);
      setModules([
        {
          titulo: "",
          conteudo: "",
        },
      ]);
    } catch (error: any) {
      console.log(error);

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao criar curso"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071827] px-6 py-8 lg:px-12 transition-colors">
      <form
        onSubmit={handleSubmit}
        className="max-w-[1500px] mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#080E2F] dark:text-white">
              Criar Curso
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base lg:text-lg">
              Cadastre um novo treinamento
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="
              bg-blue-500
              hover:bg-blue-600
              text-white
              px-6
              py-4
              rounded-2xl
              font-semibold
              transition-all
              flex
              items-center
              justify-center
              gap-3
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            <Save size={22} />

            {saving ? "Salvando..." : "Salvar Curso"}
          </button>
        </div>

        {/* Informações do curso */}
        <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <BookOpen className="text-blue-500 dark:text-blue-400" />
            </div>

            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
              Informações do Curso
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                Título do Curso
              </label>

              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Digite o título"
                className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                Categoria
              </label>

              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ex: IoT"
                className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                Nível
              </label>

              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">Selecione</option>
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>

            <div className="lg:col-span-3 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                Descrição
              </label>

              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição do curso"
                rows={4}
                className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="lg:col-span-3 flex flex-col gap-2">
              <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
                URL da Thumbnail
              </label>

              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://imagem.com/curso.png"
                className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* PDF */}
        <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="flex items-center justify-center">
              <div className="w-44 h-44 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText size={80} className="text-blue-500 dark:text-blue-400" />
              </div>
            </div>

            <div className="lg:col-span-2 text-center lg:text-left">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto lg:mx-0 mb-4">
                <FileText className="text-blue-500 dark:text-blue-400" />
              </div>

              <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                Adicionar PDF ao treinamento
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Faça upload do material do curso SIRROS
              </p>

              {pdfName && (
                <p className="text-blue-500 dark:text-blue-400 mt-3 font-medium">
                  PDF selecionado: {pdfName}
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleSelectPdf}
                className="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-3 mx-auto lg:mx-0 transition-all"
              >
                <Upload size={20} />
                Selecionar PDF
              </button>
            </div>
          </div>
        </section>

        {/* Dispositivos relacionados */}
        <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Cpu className="text-blue-500 dark:text-blue-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                Dispositivos Relacionados
              </h2>

              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Selecione os dispositivos que fazem parte deste curso
              </p>
            </div>
          </div>

          {devices.length === 0 ? (
            <div className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-gray-500 dark:text-gray-400">
              Nenhum dispositivo cadastrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {devices.map((device) => {
                const selected = selectedDevices.includes(device.id);

                return (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => toggleDevice(device.id)}
                    className={`
                      text-left
                      rounded-2xl
                      border
                      p-4
                      transition-all
                      ${
                        selected
                          ? "bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "bg-gray-50 dark:bg-[#0d2238] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-blue-500/50"
                      }
                    `}
                  >
                    <p className="font-semibold">
                      {device.nome}
                    </p>

                    <span className="text-sm opacity-80">
                      {device.modelo || device.tipo || "Dispositivo"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Módulos */}
        <section className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-6 transition-colors">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
            <div className="flex items-center gap-3">
              <Box className="text-blue-500 dark:text-blue-400" />

              <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
                Módulos do Curso
              </h2>
            </div>

            <button
              type="button"
              onClick={handleAddModule}
              className="border border-blue-500 text-blue-500 dark:text-blue-400 px-5 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-500/10 transition-all"
            >
              <Plus size={20} />
              Adicionar Módulo
            </button>
          </div>

          <div className="space-y-4">
            {modules.map((module, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#080E2F] dark:text-white">
                    Módulo {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => handleRemoveModule(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={module.titulo}
                    onChange={(e) =>
                      handleModuleChange(
                        index,
                        "titulo",
                        e.target.value
                      )
                    }
                    placeholder="Título do módulo"
                    className="w-full bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <textarea
                    value={module.conteudo}
                    onChange={(e) =>
                      handleModuleChange(
                        index,
                        "conteudo",
                        e.target.value
                      )
                    }
                    placeholder="Conteúdo do módulo"
                    rows={3}
                    className="w-full bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </form>
    </main>
  );
}