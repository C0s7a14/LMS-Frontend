import {
  Home,
  Cpu,
  BookOpen,
  Award,
  Settings,
  LogOut,
  Lock,
  Menu,
  X,
  Moon,
  Sun,
  BotMessageSquare,
  Brain,
   Building2,
   LibraryBig,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { motion, AnimatePresence } from "framer-motion";

import axios from "axios";
import { api } from "../services/api";


import { useTheme } from "../contexts/ThemeContext";
import {
  useCompany,
} from "../contexts/CompanyContext";

type UserRole = "student" | "client" | "admin";

interface MenuItem {
  name: string;
  icon: LucideIcon;
  path: string;
  allowedRoles: UserRole[];
}

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  foto_url?: string | null;
  conta_verificada?: boolean | number;
  idioma_preferido?: string | null;
}

function getUserFromStorage(): UserData {
  return JSON.parse(
    localStorage.getItem("user") || "{}"
  );
}

function normalizeRole(role?: string): UserRole {
  if (role === "admin") {
    return "admin";
  }

  if (role === "client" || role === "cliente") {
    return "client";
  }

  return "student";
}

function getRoleLabel(role: UserRole) {
  if (role === "admin") {
    return "Administrador";
  }

  if (role === "client") {
    return "Cliente";
  }

  return "Aluno";
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const {
  clearCompany,
} = useCompany();

 const [user, setUser] = useState<UserData>(getUserFromStorage());

useEffect(() => {
  function syncUser() {
    setUser(getUserFromStorage());
  }

  async function loadProfile() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await api.get("/users/me/profile");

      const profile = response.data;

      const updatedUser = {
        ...getUserFromStorage(),
        name: profile.name,
        email: profile.email,
        role: profile.role,
        foto_url: profile.foto_url,
        conta_verificada: Boolean(profile.conta_verificada),
        idioma_preferido: profile.idioma_preferido,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.log(error);
    }
  }

  loadProfile();

    window.addEventListener("user-profile-updated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("user-profile-updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const role = normalizeRole(user?.role);
  const isVerified = Boolean(user?.conta_verificada);

  async function handleLogout() {
    try {
      const refreshToken =
        localStorage.getItem("refreshToken");

      await axios.post(
        "http://localhost:3333/auth/logout",
        {
          refreshToken,
        }
      );
    } catch (error) {
      console.log(error);
    }finally {
  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "refreshToken"
  );

  localStorage.removeItem(
    "user"
  );

  clearCompany();

  navigate("/");
}
  }

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: Brain,
    path: "/Dashboard",
    allowedRoles: ["admin"],
  },
  {
    name: "Home",
    icon: Home,
    path: "/home",
    allowedRoles: ["student"],
  },
  {
    name: "Cursos Disponíveis",
    icon: LibraryBig,
    path: "/catalog",
    allowedRoles: ["student"],
  },
  {
    name: "Dispositivos",
    icon: Cpu,
    path: "/devices",
    allowedRoles: ["client"],
  },
  {
    name: "Meus Cursos",
    icon: BookOpen,
    path: "/courses",
    allowedRoles: ["student"],
  },
  {
    name: "Suporte IA",
    icon: BotMessageSquare,
    path: "/support",
    allowedRoles: ["client"],
  },
  {
    name: "Certificados",
    icon: Award,
    path: "/certificate",
    allowedRoles: ["student"],
  },
  {
    name: "Configurações",
    icon: Settings,
    path: "/settings",
    allowedRoles: ["student", "client", "admin"],
  },
];

  const visibleMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(role)
  );

  return (
    <>
      {!open && (
    <button
      onClick={() => setOpen(true)}
      className="
        lg:hidden
        fixed
        top-4
        left-4
        sm:top-5
        sm:left-5
        z-[60]
        bg-white
        dark:bg-[#11293D]
        border
        border-gray-200
        dark:border-white/10
        p-3
        rounded-xl
        shadow-md
        dark:shadow-none
        transition-all
        hover:scale-105
      "
      aria-label="Abrir menu"
    >
      <Menu
        size={24}
        className="text-[var(--company-primary)]"
      />
    </button>
  )}

      {/* Desktop */}
      <aside
        className="
          hidden
          lg:flex
          sticky
          top-0
          self-start
          shrink-0
           w-[270px]
          xl:w-72
          2xl:w-[300px]
          h-screen
          bg-white
          dark:bg-[#11293D]
          border-r
          border-gray-200
          dark:border-white/10
          flex-col
          justify-between
          p-5
          transition-colors
          overflow-y-auto
          scrollbar-hide
        "
      >
        <SidebarContent
          menuItems={visibleMenuItems}
          handleLogout={handleLogout}
          user={user}
          role={role}
          isVerified={isVerified}
        />
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() => setOpen(false)}
              className="
                fixed
                inset-0
                bg-black/50
                z-40
                lg:hidden
              "
            />

           <motion.aside
              initial={{
                x: -320,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: -320,
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                fixed
                top-0
                left-0
                z-50
                w-[min(290px,calc(100vw-24px))]
                h-[100dvh]
                bg-white
                dark:bg-[#11293D]
                border-r
                border-gray-200
                dark:border-white/10
                p-4
                sm:p-5
                flex
                flex-col
                justify-between
                lg:hidden
                transition-colors
                overflow-y-auto
                scrollbar-hide
              "
            >
              <button
                onClick={() => setOpen(false)}
                className="
                  absolute
                  top-5
                  right-5
                  text-[#080E2F]
                  dark:text-white
                "
              >
                <X size={24} />
              </button>

             <SidebarContent
              menuItems={visibleMenuItems}
              handleLogout={handleLogout}
              user={user}
              role={role}
              isVerified={isVerified}
            />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface SidebarContentProps {
  menuItems: MenuItem[];
  handleLogout: () => void;
  user: UserData;
  role: UserRole;
  isVerified: boolean;
}

function SidebarContent({
  menuItems,
  handleLogout,
  user,
  role,
  isVerified,
}: SidebarContentProps) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const {
  company,
  loading: companyLoading,
} = useCompany();

const companyLogo =
  isDark
    ? company?.configuracao?.logoDarkUrl ||
      company?.configuracao?.logoUrl
    : company?.configuracao?.logoUrl ||
      company?.configuracao?.logoDarkUrl;


const companyName =
  company?.nomeFantasia ||
  "Empresa";


const environmentName =
  company?.configuracao?.nomeAmbiente ||
  "Plataforma de Treinamento";

  function isBlockedItem(item: MenuItem) {
  if (role !== "student") {
    return false;
  }

  if (isVerified) {
    return false;
  }

return (
  item.path === "/courses" ||
  item.path === "/certificate"
);
}

  return (
    <>
      {/* Top */}
      <div>
        {/* Identidade da empresa */}
<div className="mb-6">
  <div
    className="
      flex
      items-center
      gap-3
      min-h-[64px]
    "
  >
    {companyLoading ? (
      <>
        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-gray-200
            dark:bg-white/10
            animate-pulse
            shrink-0
          "
        />

        <div className="flex-1">
          <div
            className="
              h-5
              w-32
              rounded
              bg-gray-200
              dark:bg-white/10
              animate-pulse
            "
          />

          <div
            className="
              h-3
              w-24
              mt-2
              rounded
              bg-gray-200
              dark:bg-white/10
              animate-pulse
            "
          />
        </div>
      </>
    ) : (
      <>
        {companyLogo ? (
          <div
            className="
              w-16
              h-16
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <img
              src={companyLogo}
              alt={`Logo ${companyName}`}
              className="
              max-w-full
              max-h-[56px]
              object-contain
            "
            />
          </div>
        ) : (
          <div
            className="
              w-14
              h-14
              rounded-2xl
             bg-[var(--company-primary)]
              flex
              items-center
              justify-center
              text-white
              shrink-0
            "
          >
            <Building2
              size={28}
            />
          </div>
        )}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <h1
            className="
              font-bold
              text-xl
              text-[#080E2F]
              dark:text-white
              truncate
            "
            title={companyName}
          >
            {companyName}
          </h1>

          <p
            className="
              text-gray-500
              dark:text-gray-400
              text-xs
              mt-1
              line-clamp-2
            "
          >
            {environmentName}
          </p>
        </div>
      </>
    )}
  </div>
</div>

        {/* Menu */}
      <nav className="space-y-3">
 {menuItems.map((item) => {
    const Icon = item.icon;
    const blocked = isBlockedItem(item);

  

    if (blocked) {
      return (
        <button
          key={item.path}
          type="button"
          onClick={() =>
            toast.error(
              "Complete a verificação da sua conta em Configurações para acessar esta área."
            )
          }
          className="
            w-full
            flex
            items-center
            gap-4
            px-4
            py-4
            rounded-2xl
            transition-all
            text-gray-400
            dark:text-gray-500
            bg-gray-100/70
            dark:bg-white/5
            cursor-not-allowed
          "
        >
          <Icon size={22} />

          <span className="font-medium">
            {item.name}
          </span>

          <Lock size={18} className="ml-auto" />
        </button>
      );
    }

          return (
          <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `
            w-full
            flex
            items-center
            gap-3
            xl:gap-4
            px-3
            xl:px-4
            py-3
            xl:py-4
            rounded-2xl
            transition-all
            duration-200

            ${
              isActive
                ? `
              bg-gradient-to-r
              from-[var(--company-primary)]
              to-[var(--company-secondary)]
              text-white
              shadow-lg
            `
          : `
              text-gray-700
              dark:text-gray-200
              hover:bg-gray-100
              dark:hover:bg-white/5
            `
                  }
                `
              }
            >
              <Icon
                size={22}
                className="shrink-0"
              />

              <span
                className="
                  font-medium
                  truncate
                "
              >
                {item.name}
              </span>
            </NavLink>
                );
              })}
            </nav>
      </div>

      {/* Bottom */}
      <div
        className="
          border-t
          border-gray-200
          dark:border-white/10
          pt-5
          transition-colors
        "
      >
        {/* Alternar tema */}
        <button
          onClick={toggleTheme}
          className="
            w-full
            mb-5
            bg-gray-100
            hover:bg-gray-200
            dark:bg-white/5
            dark:hover:bg-white/10
            border
            border-gray-200
            dark:border-white/10
            transition-all
            text-gray-700
            dark:text-gray-200
            rounded-2xl
            py-4
            flex
            items-center
            justify-center
            gap-3
            font-medium
            shadow-2xl
           dark:shadow-sm
            cursor-pointer
            
          "
        >
          {isDark ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}

          {isDark ? "Modo Claro" : "Modo Escuro"}
        </button>

        {/* User */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="
              w-12
              h-12
              rounded-full
             bg-[var(--company-primary)]
              flex
              items-center
              justify-center
              text-white
              font-bold
            "
          >
            {user?.name?.[0] || "U"}
          </div>

      <div className="min-w-0 flex-1">
            <h2
          className="
            text-[#080E2F]
            dark:text-white
            font-medium
            truncate
          "
          title={user?.name || "Usuário"}
        >
          {user?.name || "Usuário"}
        </h2>

            <p
              className="
                text-gray-500
                dark:text-gray-400
                text-sm
              "
            >
              {getRoleLabel(role)}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            w-full
            bg-red-600
            hover:bg-red-700
            dark:bg-red-700
            dark:hover:bg-red-800
            transition-all
            text-white
            rounded-2xl
            py-4
            flex
            items-center
            justify-center
            gap-3
            font-medium
            shadow-2xl
            dark:shadow-sm
            cursor-pointer
          "
        >
          <LogOut size={20} />

          Sair da Conta
        </button>
      </div>
    </>
  );
}