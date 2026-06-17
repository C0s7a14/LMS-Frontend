import {
  X,
  Cpu,
} from "lucide-react";

import {
  useState,
  type FormEvent,
} from "react";

import axios from "axios";

interface DeviceFormData {
  nome: string;
  modelo: string;
  tipo: string;
  descricao: string;
  imagem_url: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeviceModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState<DeviceFormData>({
    nome: "",
    modelo: "",
    tipo: "",
    descricao: "",
    imagem_url: "",
  });

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(e: FormEvent) {
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

      setFormData({
        nome: "",
        modelo: "",
        tipo: "",
        descricao: "",
        imagem_url: "",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar dispositivo");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-[#091a2c] rounded-3xl border border-gray-200 dark:border-white/10 p-6">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Cpu className="text-blue-500 dark:text-blue-400" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                Novo Dispositivo
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Cadastre um novo dispositivo SIRROS
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
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
              className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
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
              className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
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
              placeholder="sensor, gateway, atuador..."
              className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
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
              placeholder="Descrição do dispositivo..."
              rows={4}
              className="bg-gray-50 dark:bg-[#0d2238] border border-gray-200 dark:border-white/10 text-[#080E2F] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
            />
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
              {creating ? "Cadastrando..." : "Cadastrar Dispositivo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}