import { Outlet } from "react-router-dom";

import Sidebar from "../components/sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#081521] transition-colors">
      <Sidebar />

      <main className="flex-1 min-w-0 p-6">
        <Outlet />
      </main>
    </div>
  );
}