import { Outlet } from "react-router-dom";

import Sidebar from "../components/sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#081521]">

      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo das páginas */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}