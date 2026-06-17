import {
  X,
  UserPlus,
} from "lucide-react";

import {
  useState,
  type FormEvent,
} from "react";

import axios from "axios";

interface UserFormData {
  name: string;
  email: string;
  senha: string;
  role: "student" | "client" | "admin";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    senha: "",
    role: "student",
  });

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("O nome do usuário é obrigatório");
      return;
    }

    if (!formData.email.trim()) {
      alert("O email do usuário é obrigatório");
      return;
    }

    if (!formData.senha.trim()) {
      alert("A senha do usuário é obrigatória");
      return;
    }

    try {
      setCreating(true);

      await axios.post(
        "http://localhost:3333/auth/register",
        {
          name: formData.name,
          email: formData.email,
          senha: formData.senha,
          role: formData.role,
        }
      );

      setFormData({
        name: "",
        email: "",
        senha: "",
        role: "student",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.log(error);

      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao cadastrar usuário"
      );
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
              <UserPlus className="text-blue-500 dark:text-blue-400" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
                Novo Usuário
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Cadastre um novo usuário na plataforma
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
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="Nome do usuário"
              className="
                bg-gray-50
                dark:bg-[#0d2238]
                border
                border-gray-200
                dark:border-white/10
                text-[#080E2F]
                dark:text-white
                placeholder:text-gray-400
                dark:placeholder:text-gray-500
                rounded-2xl
                px-4
                py-3
                outline-none
                focus:border-blue-500
              "
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              placeholder="usuario@email.com"
              className="
                bg-gray-50
                dark:bg-[#0d2238]
                border
                border-gray-200
                dark:border-white/10
                text-[#080E2F]
                dark:text-white
                placeholder:text-gray-400
                dark:placeholder:text-gray-500
                rounded-2xl
                px-4
                py-3
                outline-none
                focus:border-blue-500
              "
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
              Senha
            </label>

            <input
              type="password"
              value={formData.senha}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  senha: e.target.value,
                })
              }
              placeholder="Digite a senha"
              className="
                bg-gray-50
                dark:bg-[#0d2238]
                border
                border-gray-200
                dark:border-white/10
                text-[#080E2F]
                dark:text-white
                placeholder:text-gray-400
                dark:placeholder:text-gray-500
                rounded-2xl
                px-4
                py-3
                outline-none
                focus:border-blue-500
              "
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#080E2F] dark:text-gray-300">
              Perfil
            </label>

            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as UserFormData["role"],
                })
              }
              className="
                bg-gray-50
                dark:bg-[#0d2238]
                border
                border-gray-200
                dark:border-white/10
                text-[#080E2F]
                dark:text-white
                rounded-2xl
                px-4
                py-3
                outline-none
                focus:border-blue-500
              "
            >
              <option value="student">
                Aluno
              </option>

              <option value="client">
                Cliente
              </option>

              <option value="admin">
                Administrador
              </option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="
                px-5
                py-3
                rounded-2xl
                border
                border-gray-200
                dark:border-white/10
                text-gray-600
                dark:text-gray-300
                font-medium
                hover:bg-gray-100
                dark:hover:bg-white/5
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
              {creating ? "Cadastrando..." : "Cadastrar Usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}