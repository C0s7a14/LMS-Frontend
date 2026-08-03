import { ADMIN_TABS } from "../constants/adminDashboard.constants";

import type { AdminTab } from "../types/adminDashboard.types";

interface DashboardTabsProps {
  currentTab: AdminTab;
  onChange: (tab: AdminTab) => void;
}

export default function DashboardTabs({
  currentTab,
  onChange,
}: DashboardTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-white/10 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 cursor-pointer">
      <div className="grid grid-cols-3 gap-2 sm:gap-6 min-w-max md:grid md:grid-cols-8 cursor-pointer">
        {ADMIN_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`
                flex
                items-center
                gap-2
                pb-4
                px-2
                sm:px-3
                border-b-4
                font-semibold
                text-sm
                sm:text-base
                whitespace-nowrap
                cursor-pointer
                transition
                ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600"
                }
              `}
            >
              <Icon size={19} />

              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}