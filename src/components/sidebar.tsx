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
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import axios from "axios";

import logo from "../assets/logo.png";

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
      name: "Configurações",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <>
      {/* Botão Mobile */}
      <button
        onClick={() => setOpen(true)}
        className="
          lg:hidden
          fixed
          top-5
          left-5
          z-[60]
          bg-[#11293D]
          border
          border-white/10
          p-3
          rounded-xl
          text-white
        "
      >
        <Menu size={24} />
      </button>

      {/* Desktop */}
      <aside
        className="
          hidden
          lg:flex
          w-72
          min-h-screen
          bg-[#11293D]
          border-r
          border-white/10
          flex-col
          justify-between
          p-5
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="
                fixed
                top-0
                left-0
                z-50
                w-72
                h-screen
                bg-[#11293D]
                border-r
                border-white/10
                p-5
                flex
                flex-col
                justify-between
                lg:hidden
              "
            >
              <button
                onClick={() => setOpen(false)}
                className="
                  absolute
                  top-5
                  right-5
                  text-white
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

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  return (
    <>
      {/* Top */}
      <div>

        {/* Logo */}
        <div className="mb-10">

          <img
            src={logo}
            alt="Sirros logo"
            className="w-40 object-contain drop-shadow-[0__0_20px_rgba(59,130,246,0.35)]"
          />

          <p className="text-gray-400 text-sm mt-1">
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
                  `w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-gray-200 hover:bg-white/5"
                  }`
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
      <div className="border-t border-white/10 pt-5">

        {/* User */}
        <div className="flex items-center gap-3 mb-5">

          <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
            {user?.name?.[0] || "U"}
          </div>

          <div>
            <h2 className="text-white font-medium">
              {user?.name || "Usuário"}
            </h2>

            <p className="text-gray-400 text-sm">
              {user?.role || "Student"}
            </p>
          </div>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            w-full
            bg-red-700
            hover:bg-red-800
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