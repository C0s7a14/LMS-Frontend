import {
  X,
  BookOpen,
  Cpu,
} from "lucide-react";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import axios from "axios";

interface DeviceType {
  id: number;
  nome: string;
  modelo?: string;
  tipo?: string;
}

interface CourseFormData {
  titulo: string;
  descricao: string;
  thumbnail: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CourseModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [creating, setCreating] = useState(false);
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);

  const [formData, setFormData] = useState<CourseFormData>({
    titulo: "",
    descricao: "",
    thumbnail: "",
  });

  async function getDevices() {
    try {
      const response = await axios.get<DeviceType[]>(
        "http://localhost:3333/devices"
      );

      setDevices(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isOpen) {
      getDevices();
    }
  }, [isOpen]);

  function toggleDevice(deviceId: number) {
    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(
        selectedDevices.filter((id) => id !== deviceId)
      );
    } else {
      setSelectedDevices([...selectedDevices, deviceId]);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      alert("O título do curso é obrigatório");
      return;
    }

    try {
      setCreating(true);

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (!user?.id) {
        alert("Usuário logado não encontrado");
        return;
      }

      const response = await axios.post(
        "http://localhost:3333/courses",
        {
          titulo: formData.titulo,
          descricao: formData.descricao,
          thumbnail: formData.thumbnail,
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
            axios.post(
              `http://localhost:3333/devices/courses/${courseId}/devices/${deviceId}`
            )
          )
        );
      }

      setFormData({
        titulo: "",
        descricao: "",
        thumbnail: "",
      });

      setSelectedDevices([]);

      onSuccess();
      onClose();
    } catch (error: any) {
      console.log(error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao cadastrar curso"
      );
    } finally {
      setCreating(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-[#091a2c] rounded-3xl border border-gray-200 dark:border-white/10 p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <BookOpen className="text-blue-500 dark:text-blue-400" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                Novo Curso
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Cadastre um curso e associe dispositivos
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

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
              Título do Curso
            </label>

            <input
              type="text"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  titulo: e.target.value,
                })
              }
              placeholder="Instalação Gateway IoT"
              className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
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
              placeholder="Descrição do curso..."
              rows={4}
              className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
              URL da Thumbnail
            </label>

            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  thumbnail: e.target.value,
                })
              }
              placeholder="https://imagem.com/curso.png"
              className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2 mt-2">
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={20} className="text-blue-500 dark:text-blue-400" />

              <h3 className="text-[#080E2F] dark:text-white font-semibold">
                Dispositivos relacionados
              </h3>
            </div>

            {devices.length === 0 ? (
              <div className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-gray-500 dark:text-gray-400">
                Nenhum dispositivo cadastrado.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={creating}
              className="px-6 py-3 rounded-2xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {creating ? "Cadastrando..." : "Cadastrar Curso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}