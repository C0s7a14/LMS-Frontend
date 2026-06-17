import {
  Home,
  Cpu,
  BookOpen,
  MessageSquare,
  Award,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Users,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import axios from "axios";

import logo from "../assets/logo-preto.png";

import { useTheme } from "../contexts/ThemeContext";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

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
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      navigate("/");
    }
  }

  const menuItems = [
    {
      name: "Home",
      icon: Home,
      path: "/home",
    },
    {
      name: "Dispositivos",
      icon: Cpu,
      path: "/devices",
    },
    {
      name: "Meus Cursos",
      icon: BookOpen,
      path: "/courses",
    },
    {
      name: "Suporte IA",
      icon: MessageSquare,
      path: "/support",
    },
    {
      name: "Certificados",
      icon: Award,
      path: "/certificate",
    },
    {
      name: "Criar Curso",
      icon: PlusCircle,
      path: "/create-courses",
    },
    {
      name: "Usuários",
      icon: Users,
      path: "/users",
    },
    {
      name: "Configurações",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <>
      {/* Botão Mobile */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            lg:hidden
            fixed
            top-5
            left-5
            z-[60]
            bg-white
            dark:bg-[#11293D]
            border
            border-gray-200
            dark:border-white/10
            p-3
            rounded-xl
            text-[#080E2F]
            dark:text-white
            shadow-md
            dark:shadow-none
            transition-colors
          "
        >
          <Menu size={24} />
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
    w-72
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
    menuItems={menuItems}
    handleLogout={handleLogout}
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
                x: -300,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: -300,
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                fixed
                top-0
                left-0
                z-50
                w-72
                h-screen
                bg-white
                dark:bg-[#11293D]
                border-r
                border-gray-200
                dark:border-white/10
                p-5
                flex
                flex-col
                justify-between
                lg:hidden
                transition-colors
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
                menuItems={menuItems}
                handleLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({
  menuItems,
  handleLogout,
}: any) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  return (
    <>
      {/* Top */}
      <div>
        {/* Logo */}
    
          
      
        <div className="mb-5">

          <div className="flex">
          <img
            src={logo}
            alt="Sirros logo"
            className="
              w-20
              ml-8
              object-contain
              drop-shadow-[0_0_20px_rgba(59,130,246,0.35)]
            "
          />

          <h1 className="font-bold pt-6 text-2xl dark:text-white ">SIRROS</h1>
          </div>
          <p
            className="
              text-gray-500
              dark:text-gray-400
              text-sm
              mt-1
              flex
              text-center
              justify-center
            "
          >
            Plataforma de Treinamento
          </p>
        </div>

        {/* Menu */}
        <nav className="space-y-3">
          {menuItems.map((item: any, index: number) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `
                  w-full
                  flex
                  items-center
                  gap-4
                  px-4
                  py-4
                  rounded-2xl
                  transition-all
                  ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
                  }
                  `
                }
              >
                <Icon size={22} />

                <span className="font-medium">
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
              bg-blue-500
              flex
              items-center
              justify-center
              text-white
              font-bold
            "
          >
            {user?.name?.[0] || "U"}
          </div>

          <div>
            <h2
              className="
                text-[#080E2F]
                dark:text-white
                font-medium
              "
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
              {user?.role || "Student"}
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
          "
        >
          <LogOut size={20} />

          Sair da Conta
        </button>
      </div>
    </>
  );
}