import {
  LayoutDashboard,
  Users,
  Cpu,
  BookOpen,
  Award,
  BarChart3,
  Search,
  Filter,
  Plus,
  UserPlus,
  Monitor,
  ShieldCheck,
  FileText,
  Star,
  Clock3,
  MoreVertical,
  ArrowRight,
  Download,
  Calendar,
  Activity,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import axios from "axios";

import UserModal from "../../components/modals/UserModal";
import DeviceModal from "../../components/modals/DeviceModal";

type AdminTab =
  | "overview"
  | "users"
  | "devices"
  | "courses"
  | "certificates"
  | "reports";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: "student" | "client" | "admin";
  criado_em?: string;
}

interface CourseType {
  id: number;
  titulo: string;
  descricao?: string;
  thumbnail?: string;
  criado_por?: number;
  criado_em?: string;
  criador?: string;
}

interface DeviceType {
  id: number;
  nome: string;
  modelo?: string;
  tipo?: string;
  descricao?: string;
  imagem_url?: string;
  criado_em?: string;
}

interface TabItem {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
}

const tabs: TabItem[] = [
  {
    id: "overview",
    label: "Visão Geral",
    icon: LayoutDashboard,
  },
  {
    id: "users",
    label: "Usuários",
    icon: Users,
  },
  {
    id: "devices",
    label: "Dispositivos",
    icon: Cpu,
  },
  {
    id: "courses",
    label: "Cursos",
    icon: BookOpen,
  },
  {
    id: "certificates",
    label: "Certificados",
    icon: Award,
  },
  {
    id: "reports",
    label: "Relatórios",
    icon: BarChart3,
  },
];

function isValidTab(tab: string | null): tab is AdminTab {
  return (
    tab === "overview" ||
    tab === "users" ||
    tab === "devices" ||
    tab === "courses" ||
    tab === "certificates" ||
    tab === "reports"
  );
}

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");

  const currentTab: AdminTab = isValidTab(tabParam)
    ? tabParam
    : "overview";

  const [search, setSearch] = useState("");

  const [users, setUsers] = useState<UserType[]>([]);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [devices, setDevices] = useState<DeviceType[]>([]);

  const [loading, setLoading] = useState(true);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);

  const navigate = useNavigate();

  async function loadDashboardData() {
    try {
      setLoading(true);

      const [usersResponse, coursesResponse, devicesResponse] =
        await Promise.all([
          axios.get<UserType[]>("http://localhost:3333/users"),
          axios.get<CourseType[]>("http://localhost:3333/courses"),
          axios.get<DeviceType[]>("http://localhost:3333/devices"),
        ]);

      setUsers(usersResponse.data);
      setCourses(coursesResponse.data);
      setDevices(devicesResponse.data);
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar dados da dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  function changeTab(tab: AdminTab) {
    setSearch("");
    setSearchParams({
      tab,
    });
  }

  function getHeaderInfo() {
    if (currentTab === "users") {
      return {
        title: "Gerenciar Usuários",
        subtitle: "Cadastre, acompanhe e administre os usuários da plataforma.",
        placeholder: "Buscar usuários...",
        button: "Novo Usuário",
      };
    }

    if (currentTab === "devices") {
      return {
        title: "Gerenciar Dispositivos",
        subtitle:
          "Liste os dispositivos cadastrados, consulte informações e vincule cursos relacionados.",
        placeholder: "Buscar dispositivos...",
        button: "Novo Dispositivo",
      };
    }

    if (currentTab === "courses") {
      return {
        title: "Gerenciar Cursos",
        subtitle:
          "Organize, publique e acompanhe os cursos disponíveis na plataforma.",
        placeholder: "Buscar cursos...",
        button: "Novo Curso",
      };
    }

    if (currentTab === "certificates") {
      return {
        title: "Gerenciar Certificados",
        subtitle:
          "Emita, valide e acompanhe os certificados gerados na plataforma.",
        placeholder: "Buscar certificados...",
        button: "Emitir Certificado",
      };
    }

    if (currentTab === "reports") {
      return {
        title: "Relatórios e Métricas",
        subtitle:
          "Analise dados estratégicos de usuários, cursos, dispositivos e certificados.",
        placeholder: "Buscar relatórios...",
        button: "Exportar Relatório",
      };
    }

    return {
      title: "Visão Geral Administrativa",
      subtitle:
        "Acompanhe rapidamente os principais indicadores da plataforma.",
      placeholder: "Buscar usuários, cursos, dispositivos...",
      button: "Novo Usuário",
    };
  }

  function handleMainAction() {
    if (currentTab === "overview" || currentTab === "users") {
      setUserModalOpen(true);
      return;
    }

    if (currentTab === "devices") {
      setDeviceModalOpen(true);
      return;
    }

    if (currentTab === "courses") {
      navigate("/create-courses");
      return;
    }

    if (currentTab === "certificates") {
      alert("Emissão de certificado será conectada depois.");
      return;
    }

    if (currentTab === "reports") {
      alert("Exportação de relatório será conectada depois.");
    }
  }

  const header = getHeaderInfo();

  const totalStudents = users.filter(
    (user) => user.role === "student"
  ).length;

  const totalClients = users.filter(
    (user) => user.role === "client"
  ).length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-start 2xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#080E2F] dark:text-white leading-tight">
            {header.title}
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
            {header.subtitle}
          </p>
        </div>

        <div className="w-full 2xl:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:min-w-[320px] 2xl:w-[380px]">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={header.placeholder}
              className="
                w-full
                bg-white
                dark:bg-[#091a2c]
                border
                border-gray-200
                dark:border-white/10
                rounded-2xl
                py-3.5
                sm:py-4
                pl-12
                pr-4
                text-[#080E2F]
                dark:text-white
                placeholder:text-gray-400
                dark:placeholder:text-gray-500
                outline-none
                focus:border-blue-500
                transition
              "
            />
          </div>

          <div className="grid grid-cols-2 sm:flex gap-3">
            <button
              className="
                border
                border-gray-200
                dark:border-white/10
                bg-white
                dark:bg-[#091a2c]
                text-blue-600
                dark:text-blue-400
                px-4
                sm:px-5
                py-3.5
                sm:py-4
                rounded-2xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                hover:bg-blue-500/10
                transition
              "
            >
              <Filter size={20} />
              Filtros
            </button>

            <button
              onClick={handleMainAction}
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-4
                sm:px-5
                py-3.5
                sm:py-4
                rounded-2xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
                whitespace-nowrap
              "
            >
              {currentTab === "reports" ? (
                <Download size={20} />
              ) : (
                <Plus size={20} />
              )}

              <span className="hidden sm:inline">
                {header.button}
              </span>

              <span className="sm:hidden">
                Novo
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs internas */}
      <div className="border-b border-gray-200 dark:border-white/10 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="grid grid-cols-3 gap-2 sm:gap-6 min-w-max md:grid md:grid-cols-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => changeTab(tab.id)}
                className={`
                  flex
                  items-center
                  gap-2
                  pb-4
                  px-2
                  sm:px-3
                  border-b-4
                  font-semibold
                  text-sm
                  sm:text-base
                  whitespace-nowrap
                  transition
                  ${
                    isActive
                      ? "border-blue-600 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  }
                `}
              >
                <Icon size={19} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 text-center text-gray-500 dark:text-gray-400">
          Carregando dashboard...
        </div>
      ) : (
        <>
          {currentTab === "overview" && (
            <OverviewTab
              users={users}
              courses={courses}
              devices={devices}
              totalStudents={totalStudents}
              changeTab={changeTab}
              openDeviceModal={() => setDeviceModalOpen(true)}
              createCourse={() => navigate("/create-courses")}
            />
          )}

          {currentTab === "users" && (
            <UsersTab
              users={users}
              search={search}
              totalStudents={totalStudents}
              totalClients={totalClients}
              totalAdmins={totalAdmins}
            />
          )}

          {currentTab === "devices" && (
            <DevicesTab
              devices={devices}
              search={search}
            />
          )}

          {currentTab === "courses" && (
            <CoursesTab
              courses={courses}
              search={search}
              createCourse={() => navigate("/create-courses")}
            />
          )}

          {currentTab === "certificates" && (
            <CertificatesTab />
          )}

          {currentTab === "reports" && (
            <ReportsTab
              users={users}
              courses={courses}
              devices={devices}
            />
          )}
        </>
      )}

      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        onSuccess={loadDashboardData}
      />

      <DeviceModal
        isOpen={deviceModalOpen}
        onClose={() => setDeviceModalOpen(false)}
        onSuccess={loadDashboardData}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div
      className="
        bg-white
        dark:bg-[#091a2c]
        border
        border-gray-200
        dark:border-white/10
        rounded-4xl
        p-6
        sm:p-1
        min-h-55
        flex
        flex-col
        items-center
        justify-center
        text-center
        shadow-2xl
        dark:shadow-blue-500
        dark:shadow-sm
        transition-all
        hover:-translate-y-1
        hover:shadow-[0_22px_50px_rgba(15,23,42,0.14)]
        cursor-pointer
      "
    >
      <div
        className={`
          w-15
          h-15
          rounded-3xl
          flex
          items-center
          justify-center
          mb-5
          shrink-0
          ${color}
        `}
      >
        <Icon size={38} />
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-base md:text-sm font-medium">
        {title}
      </p>

      <h2 className="text-4xl sm:text-3xl font-bold text-[#080E2F] dark:text-white mt-3 leading-none">
        {value}
      </h2>

      <p className="text-gray-500 dark:text-gray-400 text-base md:text-sm mt-2">
        {subtitle}
      </p>
    </div>
  );
}
function OverviewTab({
  users,
  courses,
  devices,
  totalStudents,
  changeTab,
  openDeviceModal,
  createCourse,
}: {
  users: UserType[];
  courses: CourseType[];
  devices: DeviceType[];
  totalStudents: number;
  changeTab: (tab: AdminTab) => void;
  openDeviceModal: () => void;
  createCourse: () => void;
}) {
  return (
    <div className="space-y-6 sm:space-y-8 ">
      <StatsGrid>
        <StatCard
          title="Total de Usuários"
          value={users.length}
          subtitle="Todos os perfis"
          icon={Users}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Dispositivos Ativos"
          value={devices.length}
          subtitle="Cadastrados"
          icon={Monitor}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Cursos Publicados"
          value={courses.length}
          subtitle="Disponíveis"
          icon={BookOpen}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Certificados"
          value="56"
          subtitle="Este mês"
          icon={Award}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Alunos"
          value={totalStudents}
          subtitle="Matriculados"
          icon={UserPlus}
          color="bg-red-500/15 text-red-600 dark:text-red-400"
        />

        <StatCard
          title="Chamados IA"
          value="24"
          subtitle="Este mês"
          icon={ShieldCheck}
          color="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
        />
      </StatsGrid>

      <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.3fr)_minmax(380px,0.9fr)] gap-5 sm:gap-6  ">
        <TableCard title="Atividades Recentes">
          <div className="space-y-5">
            <ActivityItem
              icon={UserPlus}
              title="Novo usuário cadastrado"
              subtitle="Usuário criado na plataforma"
              time="09:32"
              color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
            />

            <ActivityItem
              icon={Award}
              title="Certificado emitido"
              subtitle="Novo certificado gerado"
              time="08:50"
              color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
            />

            <ActivityItem
              icon={BookOpen}
              title="Curso atualizado"
              subtitle="Conteúdo do curso alterado"
              time="Ontem"
              color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
            />

            <ActivityItem
              icon={Cpu}
              title="Dispositivo registrado"
              subtitle="Novo dispositivo adicionado"
              time="12/06"
              color="bg-green-500/15 text-green-600 dark:text-green-400"
            />
          </div>
        </TableCard>

        <div className="space-y-5 sm:space-y-6 rounded-3xl ">
          <TableCard title="Resumo por Módulo">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickSummary
                icon={Users}
                title="Usuários"
                value={users.length}
                onClick={() => changeTab("users")}
              />

              <QuickSummary
                icon={Cpu}
                title="Dispositivos"
                value={devices.length}
                onClick={() => changeTab("devices")}
              />

              <QuickSummary
                icon={BookOpen}
                title="Cursos"
                value={courses.length}
                onClick={() => changeTab("courses")}
              />

              <QuickSummary
                icon={Award}
                title="Certificados"
                value={56}
                onClick={() => changeTab("certificates")}
              />
            </div>
          </TableCard>

          <TableCard title="Ações Rápidas">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionButton
                icon={Users}
                title="Gerenciar usuários"
                subtitle="Visualizar usuários"
                onClick={() => changeTab("users")}
              />

              <ActionButton
                icon={Cpu}
                title="Cadastrar dispositivo"
                subtitle="Adicionar novo dispositivo"
                onClick={openDeviceModal}
              />

              <ActionButton
                icon={BookOpen}
                title="Criar curso"
                subtitle="Criar e publicar curso"
                onClick={createCourse}
              />

              <ActionButton
                icon={BarChart3}
                title="Ver relatórios"
                subtitle="Acessar métricas"
                onClick={() => changeTab("reports")}
              />
            </div>
          </TableCard>
        </div>
      </div>
    </div>
  );
}

function UsersTab({
  users,
  search,
  totalStudents,
  totalClients,
  totalAdmins,
}: {
  users: UserType[];
  search: string;
  totalStudents: number;
  totalClients: number;
  totalAdmins: number;
}) {
  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <StatsGrid>
        <StatCard
          title="Total de Usuários"
          value={users.length}
          subtitle="Todos os perfis"
          icon={Users}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Alunos"
          value={totalStudents}
          subtitle="Perfil estudante"
          icon={BookOpen}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Clientes"
          value={totalClients}
          subtitle="Perfil cliente"
          icon={UserPlus}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Admins"
          value={totalAdmins}
          subtitle="Administradores"
          icon={ShieldCheck}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Ativos Hoje"
          value={users.length}
          subtitle="Usuários ativos"
          icon={Activity}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Convites"
          value="0"
          subtitle="Pendentes"
          icon={FileText}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />
      </StatsGrid>

      <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)] gap-5 sm:gap-6">
        <TableCard title="Lista de Usuários">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[1.2fr_1.4fr_1fr_80px] text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 pb-3">
              <span>Usuário</span>
              <span>Email</span>
              <span>Perfil</span>
              <span className="text-right">Ações</span>
            </div>

            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[1.2fr_1.4fr_1fr_80px] gap-4 items-center py-4 border-b border-gray-200 dark:border-white/10 last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={user.name} />

                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#080E2F] dark:text-white truncate">
                      {user.name}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {user.id}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </p>

                <RoleBadge role={user.role} />

                <button className="ml-auto text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                  <MoreVertical size={22} />
                </button>
              </div>
            ))}
          </div>
        </TableCard>

        <SidePanel
          title="Distribuição por Perfil"
          items={[
            {
              label: "Alunos",
              value: totalStudents,
              percentage: users.length
                ? Math.round((totalStudents / users.length) * 100)
                : 0,
            },
            {
              label: "Clientes",
              value: totalClients,
              percentage: users.length
                ? Math.round((totalClients / users.length) * 100)
                : 0,
            },
            {
              label: "Administradores",
              value: totalAdmins,
              percentage: users.length
                ? Math.round((totalAdmins / users.length) * 100)
                : 0,
            },
          ]}
        />
      </div>
    </div>
  );
}

function DevicesTab({
  devices,
  search,
}: {
  devices: DeviceType[];
  search: string;
}) {
  const filteredDevices = devices.filter((device) => {
    const term = search.toLowerCase();

    return (
      device.nome?.toLowerCase().includes(term) ||
      device.modelo?.toLowerCase().includes(term) ||
      device.tipo?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <StatsGrid>
        <StatCard
          title="Total de Dispositivos"
          value={devices.length}
          subtitle="Cadastrados"
          icon={Cpu}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Com Ficha Técnica"
          value={devices.length}
          subtitle="Documentados"
          icon={FileText}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Cursos Vinculados"
          value="32"
          subtitle="Relacionados"
          icon={BookOpen}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Categorias"
          value="5"
          subtitle="Tipos"
          icon={Filter}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Mais acessado"
          value="S1"
          subtitle="Dispositivo"
          icon={Star}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Atualizados"
          value={devices.length}
          subtitle="Este mês"
          icon={Calendar}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />
      </StatsGrid>

      <TableCard title="Lista de Dispositivos">
        <div className="min-w-[850px]">
          <div className="grid grid-cols-[1.3fr_1fr_1fr_1.4fr_80px] text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 pb-3">
            <span>Dispositivo</span>
            <span>Modelo</span>
            <span>Categoria</span>
            <span>Descrição</span>
            <span className="text-right">Ações</span>
          </div>

          {filteredDevices.map((device) => (
            <div
              key={device.id}
              className="grid grid-cols-[1.3fr_1fr_1fr_1.4fr_80px] gap-4 items-center py-4 border-b border-gray-200 dark:border-white/10 last:border-b-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#0d2238] overflow-hidden flex items-center justify-center shrink-0">
                  {device.imagem_url ? (
                    <img
                      src={device.imagem_url}
                      className="w-full h-full object-cover"
                      alt={device.nome}
                    />
                  ) : (
                    <Cpu className="text-blue-600 dark:text-blue-400" />
                  )}
                </div>

                <h3 className="font-semibold text-[#080E2F] dark:text-white truncate">
                  {device.nome}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 truncate">
                {device.modelo || "-"}
              </p>

              <p className="text-blue-600 dark:text-blue-400 font-semibold truncate">
                {device.tipo || "Sem categoria"}
              </p>

              <p className="text-gray-600 dark:text-gray-400 truncate">
                {device.descricao || "Sem descrição"}
              </p>

              <button className="ml-auto text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                <MoreVertical size={22} />
              </button>
            </div>
          ))}
        </div>
      </TableCard>
    </div>
  );
}

function CoursesTab({
  courses,
  search,
  createCourse,
}: {
  courses: CourseType[];
  search: string;
  createCourse: () => void;
}) {
  const filteredCourses = courses.filter((course) => {
    const term = search.toLowerCase();

    return (
      course.titulo?.toLowerCase().includes(term) ||
      course.descricao?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <StatsGrid>
        <StatCard
          title="Total de Cursos"
          value={courses.length}
          subtitle="Todos os cursos"
          icon={BookOpen}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Publicados"
          value={courses.length}
          subtitle="Disponíveis"
          icon={ShieldCheck}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Rascunhos"
          value="0"
          subtitle="Não publicados"
          icon={FileText}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Alunos"
          value="318"
          subtitle="Matriculados"
          icon={Users}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Conclusão"
          value="68%"
          subtitle="Média geral"
          icon={BarChart3}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Avaliação"
          value="4,6"
          subtitle="De 5 estrelas"
          icon={Star}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />
      </StatsGrid>

      <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)] gap-5 sm:gap-6">
        <TableCard title="Lista de Cursos">
          <div className="min-w-[850px]">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_80px] text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 pb-3">
              <span>Curso</span>
              <span>Status</span>
              <span>Alunos</span>
              <span>Atualização</span>
              <span className="text-right">Ações</span>
            </div>

            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="grid grid-cols-[1.5fr_1fr_1fr_1fr_80px] gap-4 items-center py-4 border-b border-gray-200 dark:border-white/10 last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-[#0d2238] overflow-hidden flex items-center justify-center shrink-0">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        className="w-full h-full object-cover"
                        alt={course.titulo}
                      />
                    ) : (
                      <BookOpen className="text-blue-600 dark:text-blue-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#080E2F] dark:text-white truncate">
                      {course.titulo}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {course.descricao || "Sem descrição"}
                    </p>
                  </div>
                </div>

                <span className="w-fit px-3 py-1 rounded-xl bg-green-500/15 text-green-600 dark:text-green-400 font-semibold text-sm">
                  Publicado
                </span>

                <p className="text-gray-600 dark:text-gray-400">
                  0
                </p>

                <p className="text-gray-600 dark:text-gray-400">
                  {course.criado_em
                    ? new Date(course.criado_em).toLocaleDateString("pt-BR")
                    : "-"}
                </p>

                <button className="ml-auto text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                  <MoreVertical size={22} />
                </button>
              </div>
            ))}
          </div>
        </TableCard>

        <TableCard title="Ações Rápidas">
          <div className="grid grid-cols-1 gap-4">
            <ActionButton
              icon={BookOpen}
              title="Criar curso"
              subtitle="Iniciar um novo curso"
              onClick={createCourse}
            />

            <ActionButton
              icon={Award}
              title="Gerar certificado"
              subtitle="Emitir certificados"
              onClick={() => alert("Conectar emissão depois.")}
            />

            <ActionButton
              icon={Download}
              title="Exportar catálogo"
              subtitle="Exportar lista de cursos"
              onClick={() => alert("Conectar exportação depois.")}
            />
          </div>
        </TableCard>
      </div>
    </div>
  );
}

function CertificatesTab() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <StatsGrid>
        <StatCard
          title="Total Emitidos"
          value="284"
          subtitle="Todos os certificados"
          icon={Award}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Pendentes"
          value="18"
          subtitle="Aguardando emissão"
          icon={Clock3}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Verificados"
          value="231"
          subtitle="Certificados válidos"
          icon={ShieldCheck}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Compartilhados"
          value="146"
          subtitle="Por link ou email"
          icon={ArrowRight}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Média de Notas"
          value="8,7"
          subtitle="De 0 a 10"
          icon={Star}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Última Emissão"
          value="14/06"
          subtitle="09:32"
          icon={Calendar}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />
      </StatsGrid>

      <TableCard title="Lista de Certificados">
        <div className="min-w-[780px]">
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr_0.8fr_1fr_80px] text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 pb-3">
            <span>ID</span>
            <span>Aluno</span>
            <span>Curso</span>
            <span>Nota</span>
            <span>Status</span>
            <span className="text-right">Ações</span>
          </div>

          {[
            {
              id: "CERT-2026-0284",
              aluno: "Mariana Rocha",
              curso: "SIRROS Data Tag",
              nota: "9,5",
              status: "Verificado",
            },
            {
              id: "CERT-2026-0283",
              aluno: "Carlos Silva",
              curso: "RTU Industrial",
              nota: "8,0",
              status: "Verificado",
            },
            {
              id: "CERT-2026-0282",
              aluno: "Amanda Ferreira",
              curso: "Semáforo IoT",
              nota: "9,0",
              status: "Emitido",
            },
          ].map((certificate) => (
            <div
              key={certificate.id}
              className="grid grid-cols-[1fr_1.2fr_1.2fr_0.8fr_1fr_80px] gap-4 items-center py-4 border-b border-gray-200 dark:border-white/10 last:border-b-0"
            >
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {certificate.id}
              </span>

              <span className="text-[#080E2F] dark:text-white font-semibold">
                {certificate.aluno}
              </span>

              <span className="text-gray-600 dark:text-gray-400">
                {certificate.curso}
              </span>

              <span className="text-gray-600 dark:text-gray-400">
                {certificate.nota}
              </span>

              <span className="w-fit px-3 py-1 rounded-xl bg-green-500/15 text-green-600 dark:text-green-400 font-semibold text-sm">
                {certificate.status}
              </span>

              <button className="ml-auto text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                <MoreVertical size={22} />
              </button>
            </div>
          ))}
        </div>
      </TableCard>
    </div>
  );
}

function ReportsTab({
  users,
  courses,
  devices,
}: {
  users: UserType[];
  courses: CourseType[];
  devices: DeviceType[];
}) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <StatsGrid>
        <StatCard
          title="Usuários Ativos"
          value={users.length}
          subtitle="Total atual"
          icon={Users}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Cursos"
          value={courses.length}
          subtitle="Publicados"
          icon={BookOpen}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Dispositivos"
          value={devices.length}
          subtitle="Online"
          icon={Cpu}
          color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Certificados"
          value="56"
          subtitle="Emitidos"
          icon={Award}
          color="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Conclusão"
          value="76%"
          subtitle="Taxa média"
          icon={BarChart3}
          color="bg-green-500/15 text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Satisfação"
          value="4,6"
          subtitle="De 5"
          icon={Star}
          color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />
      </StatsGrid>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5 sm:gap-6">
        <TableCard title="Indicadores por Módulo">
          <ReportLine
            label="Usuários"
            value={`${users.length} ativos`}
          />

          <ReportLine
            label="Dispositivos"
            value={`${devices.length} cadastrados`}
          />

          <ReportLine
            label="Cursos"
            value={`${courses.length} disponíveis`}
          />

          <ReportLine
            label="Certificados"
            value="56 emitidos"
          />
        </TableCard>

        <TableCard title="Insights Rápidos">
          <div className="space-y-5">
            <ActivityItem
              icon={BarChart3}
              title="A taxa de conclusão aumentou"
              subtitle="Mais usuários estão concluindo os cursos."
              time="Positivo"
              color="bg-green-500/15 text-green-600 dark:text-green-400"
            />

            <ActivityItem
              icon={BookOpen}
              title="Curso mais acessado"
              subtitle="Instalação e Configuração SIRROS."
              time="Destaque"
              color="bg-orange-500/15 text-orange-600 dark:text-orange-400"
            />

            <ActivityItem
              icon={Cpu}
              title="Dispositivos cadastrados"
              subtitle="Monitoramento ativo dos dispositivos."
              time="Estável"
              color="bg-blue-500/15 text-blue-600 dark:text-blue-400"
            />
          </div>
        </TableCard>
      </div>
    </div>
  );
}

function StatsGrid({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-3
        xl:grid-cols-2
        2xl:grid-cols-6
        gap-5
        sm:gap-4
      "
    >
      {children}
    </div>
  );
}

function TableCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        bg-white
        dark:bg-[#091a2c]
        border
        border-gray-200
        dark:border-white/10
        rounded-3xl
        p-4
        sm:p-6
        overflow-hidden
        shadow-2xl
        dark:shadow-none
        transition-all
        hover:shadow-[0_22px_45px_rgba(15,23,42,0.12)]
        ${className}
      `}
    >
      <h2 className="text-lg sm:text-xl font-bold text-[#080E2F] dark:text-white mb-5">
        {title}
      </h2>

      <div className="overflow-x-auto scrollbar-hide ">
        {children}
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        border
        border-gray-200
        dark:border-blue-500
        dark:shadow-none
        rounded-2xl
        p-4
        flex
        items-center
        justify-between
        hover:bg-gray-50
        dark:hover:bg-white/5
        text-left
        gap-4
        cursor-pointer
        shadow-xl
        hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]
        hover:-translate-y-1
        transition-all
      "
    >
      <div className="flex items-center gap-3 min-w-0 ">
        <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Icon size={22} />
        </div>

        <div className="min-w-0">
          <h3 className="font-bold text-[#080E2F] dark:text-white truncate">
            {title}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      <ArrowRight
        size={20}
        className="text-gray-500 shrink-0"
      />
    </button>
  );
}

function QuickSummary({
  icon: Icon,
  title,
  value,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
 bg-white
        dark:bg-[#091a2c]
        border
        border-gray-200
        dark:border-blue-500
        rounded-2xl
        p-5
        min-h-24
        flex
        items-center
        justify-between
        gap-4
        shadow-[0_12px_30px_rgba(15,23,42,0.08)]
        dark:shadow-none
        hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]
        hover:-translate-y-1
        transition-all
        
      "
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Icon size={22} />
        </div>

        <span className="font-bold text-[#080E2F] dark:text-white truncate">
          {title}
        </span>
      </div>

      <strong className="text-[#080E2F] dark:text-white shrink-0">
        {value}
      </strong>
    </button>
  );
}

function ActivityItem({
  icon: Icon,
  title,
  subtitle,
  time,
  color,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  time: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`
            w-10
            h-10
            rounded-xl
            flex
            items-center
            justify-center
            shrink-0
            ${color}
          `}
        >
          <Icon size={20} />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-[#080E2F] dark:text-white truncate">
            {title}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {time}
      </span>
    </div>
  );
}

function Avatar({
  name,
}: {
  name: string;
}) {
  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
      {initials || "U"}
    </div>
  );
}

function RoleBadge({
  role,
}: {
  role: UserType["role"];
}) {
  const label =
    role === "admin"
      ? "Administrador"
      : role === "client"
      ? "Cliente"
      : "Aluno";

  const style =
    role === "admin"
      ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
      : role === "client"
      ? "bg-orange-500/15 text-orange-600 dark:text-orange-400"
      : "bg-purple-500/15 text-purple-600 dark:text-purple-400";

  return (
    <span
      className={`
        w-fit
        px-3
        py-1
        rounded-xl
        text-sm
        font-semibold
        whitespace-nowrap
        ${style}
      `}
    >
      {label}
    </span>
  );
}

function SidePanel({
  title,
  items,
}: {
  title: string;
  items: {
    label: string;
    value: number;
    percentage: number;
  }[];
}) {
  return (
    <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl">
      <h2 className="text-lg sm:text-xl font-bold text-[#080E2F] dark:text-white mb-5">
        {title}
      </h2>

      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2 gap-4">
              <span className="font-semibold text-[#080E2F] dark:text-white">
                {item.label}
              </span>

              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {item.value} ({item.percentage}%)
              </span>
            </div>

            <div className="w-full h-2 bg-gray-200 dark:bg-[#132d46] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${item.percentage}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-200 dark:border-white/10 last:border-b-0">
      <span className="font-semibold text-[#080E2F] dark:text-white">
        {label}
      </span>

      <span className="text-gray-500 dark:text-gray-400 text-right">
        {value}
      </span>
    </div>
  );
}