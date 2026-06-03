import {
  Home,
  Cpu,
  BookOpen,
  MessageSquare,
  Award,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
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
    <aside className="w-72 min-h-screen bg-[#11293D] border-r border-white/10 flex flex-col justify-between p-5">

      {/* Top */}
      <div>

        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-white text-2xl font-bold">
            Sirros
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Plataforma de Treinamento
          </p>
        </div>

        {/* Menu */}
        <nav className="space-y-3">
          {menuItems.map((item, index) => {
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
            LS
          </div>

          <div>
            <h2 className="text-white font-medium">
              Lucas
            </h2>

            <p className="text-gray-400 text-sm">
              CEO
            </p>
          </div>
        </div>

        {/* Logout */}
        <button className="w-full bg-red-700 hover:bg-red-800 transition-all text-white rounded-2xl py-4 flex items-center justify-center gap-3 font-medium">
          <LogOut size={20} />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}