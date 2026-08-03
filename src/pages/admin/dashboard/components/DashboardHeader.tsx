import {
  Download,
  Filter,
  Plus,
  Search,
} from "lucide-react";

import type { AdminTab } from "../types/adminDashboard.types";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  placeholder: string;
  actionLabel: string;
  search: string;
  currentTab: AdminTab;
  onSearchChange: (value: string) => void;
  onMainAction: () => void;
}

export default function DashboardHeader({
  title,
  subtitle,
  placeholder,
  actionLabel,
  search,
  currentTab,
  onSearchChange,
  onMainAction,
}: DashboardHeaderProps) {
  const isReportsTab = currentTab === "reports";

  return (
    <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-start 2xl:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#080E2F] dark:text-white leading-tight">
          {title}
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
          {subtitle}
        </p>
      </div>

      <div className="w-full 2xl:w-auto flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:min-w-[320px] 2xl:w-[380px]">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder={placeholder}
            className="
              w-full
              bg-white
              dark:bg-[#091a2c]
              border
              border-gray-200
              dark:border-white/10
              rounded-2xl
              py-3.5
              sm:py-4
              pl-12
              pr-4
              text-[#080E2F]
              dark:text-white
              placeholder:text-gray-400
              dark:placeholder:text-gray-500
              outline-none
              focus:border-blue-500
              transition
            "
          />
        </div>

        <div className="grid grid-cols-2 sm:flex gap-3">
          <button
            type="button"
            className="
              border
              border-gray-200
              dark:border-white/10
              bg-white
              dark:bg-[#091a2c]
              text-blue-600
              dark:text-blue-400
              px-4
              sm:px-5
              py-3.5
              sm:py-4
              rounded-2xl
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              hover:bg-blue-500/10
              transition
            "
          >
            <Filter size={20} />
            Filtros
          </button>

          <button
            type="button"
            onClick={onMainAction}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-4
              sm:px-5
              py-3.5
              sm:py-4
              rounded-2xl
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              transition
              whitespace-nowrap
            "
          >
            {isReportsTab ? (
              <Download size={20} />
            ) : (
              <Plus size={20} />
            )}

            <span className="hidden sm:inline">
              {actionLabel}
            </span>

            <span className="sm:hidden">
              {isReportsTab ? "Exportar" : "Novo"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}