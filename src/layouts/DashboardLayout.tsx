import { Outlet } from "react-router-dom";

import Sidebar from "../components/sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#081521] transition-colors">
      <Sidebar />

      <main
        className="
          flex-1
          min-w-0
          w-full
          overflow-x-hidden
          px-4
          py-5
          sm:px-6
          sm:py-6
          lg:px-8
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