import {
  Brain,
  Building2,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  ShieldCheck,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useTheme,
} from "../../contexts/ThemeContext";

import {
  usePlatformAuth,
} from "../../contexts/PlatformAuthContext";

interface MenuItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: Brain,
    path: "/platform/dashboard",
  },
  {
    name: "Empresas",
    icon: Building2,
    path: "/platform/companies",
  },
];

export default function PlatformSidebar() {
  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  const navigate =
    useNavigate();

  const {
    logout,
    user,
  } = usePlatformAuth();

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      await logout();

      navigate(
        "/",
        {
          replace: true,
        }
      );
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      {/* BOTÃO MOBILE */}
      {!open && (
        <button
          type="button"
          onClick={() =>
            setOpen(true)
          }
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
            className="text-blue-600 dark:text-blue-400"
          />
        </button>
      )}

      {/* DESKTOP */}
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
        <PlatformSidebarContent
          menuItems={
            menuItems
          }
          handleLogout={
            handleLogout
          }
          loggingOut={
            loggingOut
          }
          userName={
            user?.name
          }
        />
      </aside>

      {/* MOBILE */}
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
              onClick={() =>
                setOpen(false)
              }
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
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  absolute
                  top-5
                  right-5

                  text-[#080E2F]
                  dark:text-white
                "
                aria-label="Fechar menu"
              >
                <X
                  size={24}
                />
              </button>

              <PlatformSidebarContent
                menuItems={
                  menuItems
                }
                handleLogout={
                  handleLogout
                }
                loggingOut={
                  loggingOut
                }
                userName={
                  user?.name
                }
                onNavigate={() =>
                  setOpen(false)
                }
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface PlatformSidebarContentProps {
  menuItems: MenuItem[];

  handleLogout:
    () => void;

  loggingOut:
    boolean;

  userName?:
    string;

  onNavigate?:
    () => void;
}

function PlatformSidebarContent({
  menuItems,
  handleLogout,
  loggingOut,
  userName,
  onNavigate,
}: PlatformSidebarContentProps) {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const isDark =
    theme === "dark";

  const displayName =
    userName?.trim() ||
    "SuperAdmin";

  return (
    <>
      {/* TOPO */}
      <div>
        {/* IDENTIDADE DA PLATAFORMA */}
        <div className="mb-6">
          <div
            className="
              flex
              items-center
              gap-3
              min-h-[64px]
            "
          >
            <div
              className="
                w-14
                h-14

                rounded-2xl

                bg-gradient-to-br
                from-blue-500
                to-purple-600

                flex
                items-center
                justify-center

                text-white

                shrink-0

                shadow-lg
              "
            >
              <ShieldCheck
                size={28}
              />
            </div>

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
              >
                Plataforma
              </h1>

              <p
                className="
                  text-gray-500
                  dark:text-gray-400

                  text-xs
                  mt-1
                "
              >
                Console SuperAdmin
              </p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="space-y-3">
          {menuItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={
                    item.path
                  }
                  to={
                    item.path
                  }
                  onClick={
                    onNavigate
                  }
                  className={({
                    isActive,
                  }) =>
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
                            from-blue-500
                            to-purple-600

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
                    {
                      item.name
                    }
                  </span>
                </NavLink>
              );
            }
          )}
        </nav>
      </div>

      {/* RODAPÉ */}
      <div
        className="
          border-t
          border-gray-200
          dark:border-white/10

          pt-5

          transition-colors
        "
      >
        {/* TEMA */}
        <button
          type="button"
          onClick={
            toggleTheme
          }
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
            <Sun
              size={20}
            />
          ) : (
            <Moon
              size={20}
            />
          )}

          {isDark
            ? "Modo Claro"
            : "Modo Escuro"}
        </button>

        {/* SUPERADMIN */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="
              w-12
              h-12

              rounded-full

              bg-gradient-to-br
              from-blue-500
              to-purple-600

              flex
              items-center
              justify-center

              text-white
              font-bold

              shrink-0
            "
          >
            {displayName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <h2
              className="
                text-[#080E2F]
                dark:text-white

                font-medium
                truncate
              "
              title={
                displayName
              }
            >
              {displayName}
            </h2>

            <p
              className="
                text-gray-500
                dark:text-gray-400

                text-sm
              "
            >
              SuperAdministrador
            </p>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          type="button"
          onClick={
            handleLogout
          }
          disabled={
            loggingOut
          }
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

            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          <LogOut
            size={20}
          />

          {loggingOut
            ? "Saindo..."
            : "Sair da Conta"}
        </button>
      </div>
    </>
  );
}