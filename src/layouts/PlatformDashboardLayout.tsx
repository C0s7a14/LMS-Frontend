import {
  Outlet,
} from "react-router-dom";

import PlatformSidebar from "../pages/platform/PlatformSidebar";

export default function PlatformDashboardLayout() {
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
      <PlatformSidebar />

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