import {
  useEffect,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import Sidebar from "../components/sidebar";

import {
  registerUserActivity,
} from "../services/userActivityService";


export default function DashboardLayout() {
  useEffect(() => {
    /*
      Registra atividade assim que o usuário
      entra na área autenticada.
    */
    async function sendActivityPing() {
      try {
        await registerUserActivity();
      } catch (error) {
        /*
          Falha no monitoramento não deve
          derrubar nem incomodar o usuário.
        */
        console.log(
          "Não foi possível registrar atividade:",
          error,
        );
      }
    }

    void sendActivityPing();

    /*
      Atualiza a atividade a cada 5 minutos,
      mas somente enquanto a aba estiver visível.
    */
    const interval =
      window.setInterval(() => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          void sendActivityPing();
        }
      }, 5 * 60 * 1000);

    /*
      Quando a pessoa volta para a aba,
      registramos atividade novamente.
    */
    function handleVisibilityChange() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        void sendActivityPing();
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      window.clearInterval(
        interval,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);

  return (
   <div
  className="
    flex
    min-h-screen

    bg-gray-50
    dark:bg-[#081521]

    transition-colors
  "
>
      <Sidebar />

     <main
  className="
    flex-1
    min-w-0
    w-full

    overflow-x-hidden

    px-4
    pb-5
    pt-20

    sm:px-6
    sm:pb-6
    sm:pt-20

    lg:px-8
    lg:py-6

    xl:px-10
  "
>
        <div className="w-full max-w-[1650px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}