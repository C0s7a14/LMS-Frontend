import {
  Search,
  Plus,
  Trash2,
  Mail,
  Shield,
  User,
  Users as UsersIcon,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

import UserModal from "../../components/modals/UserModal";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: "student" | "client" | "admin";
  criado_em?: string;
}

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function getUsers() {
    try {
      setLoading(true);

      const response = await axios.get<UserType[]>(
        "http://localhost:3333/users"
      );

      setUsers(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar usuários");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  async function handleDeleteUser(userId: number) {
    const loggedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (loggedUser?.id === userId) {
      toast.error("Você não pode deletar o próprio usuário logado.");
      return;
    }

    const confirmDelete = confirm(
      "Tem certeza que deseja deletar este usuário?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3333/users/${userId}`
      );

      await getUsers();

      toast.success("Usuário deletado com sucesso");
    } catch (error: any) {
      console.log(error);

      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao deletar usuário"
      );
    }
  }

  function getRoleLabel(role: UserType["role"]) {
    if (role === "admin") {
      return "Administrador";
    }

    if (role === "client") {
      return "Cliente";
    }

    return "Aluno";
  }

  function getRoleStyle(role: UserType["role"]) {
    if (role === "admin") {
      return "bg-red-500/20 text-red-500 dark:text-red-400 border-red-500/20";
    }

    if (role === "client") {
      return "bg-purple-500/20 text-purple-500 dark:text-purple-400 border-purple-500/20";
    }

    return "bg-blue-500/20 text-blue-500 dark:text-blue-400 border-blue-500/20";
  }

  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071827] px-6 py-8 lg:px-12 transition-colors">
      <div className="max-w-[1500px] mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#080E2F] dark:text-white">
              Usuários
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2 text-base lg:text-lg">
              Gerencie os usuários cadastrados na plataforma
            </p>

            <div className="mt-5 inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 rounded-2xl px-5 py-2 font-medium">
              <UsersIcon size={20} />
              {filteredUsers.length} usuários encontrados
            </div>
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
                placeholder="Buscar usuários..."
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
                "
              />
            </div>

            {/* Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="
                bg-blue-500
                hover:bg-blue-600
                text-white
                px-5
                py-4
                rounded-2xl
                font-semibold
                transition-all
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <Plus size={20} />
              Novo Usuário
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-10 text-center text-gray-500 dark:text-gray-400">
            Carregando usuários...
          </div>
        )}

        {/* Empty */}
        {!loading && filteredUsers.length === 0 && (
          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <User size={36} className="text-blue-500 dark:text-blue-400" />
            </div>

            <h2 className="text-xl font-bold text-[#080E2F] dark:text-white">
              Nenhum usuário encontrado
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Cadastre usuários para eles aparecerem aqui.
            </p>
          </div>
        )}

        {/* Users List */}
        {!loading && filteredUsers.length > 0 && (
          <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden transition-colors">
            <div className="hidden lg:grid grid-cols-[1.5fr_1.5fr_1fr_120px] gap-4 px-6 py-4 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-sm font-medium">
              <span>Usuário</span>
              <span>Email</span>
              <span>Perfil</span>
              <span className="text-right">Ações</span>
            </div>

            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-[1.5fr_1.5fr_1fr_120px]
                  gap-4
                  px-6
                  py-5
                  border-b
                  border-gray-200
                  dark:border-white/10
                  last:border-b-0
                  items-center
                  hover:bg-gray-50
                  dark:hover:bg-white/5
                  transition-all
                "
              >
                {/* User */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <User className="text-blue-500 dark:text-blue-400" />
                  </div>

                  <div>
                    <h2 className="text-[#080E2F] dark:text-white font-semibold">
                      {user.name}
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      ID: {user.id}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <Mail size={20} />

                  <span className="break-all">
                    {user.email}
                  </span>
                </div>

                {/* Role */}
                <div>
                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      border
                      rounded-xl
                      px-4
                      py-2
                      text-sm
                      font-medium
                      ${getRoleStyle(user.role)}
                    `}
                  >
                    <Shield size={16} />
                    {getRoleLabel(user.role)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-start lg:justify-end gap-3">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-red-500/10
                      text-red-500
                      dark:text-red-400
                      hover:bg-red-500
                      hover:text-white
                      transition-all
                      flex
                      items-center
                      justify-center
                    "
                    title="Deletar usuário"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <UserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={getUsers}
        />

      </div>
    </main>
  );
}