import {
  ChevronDown,
} from "lucide-react";

import {
  ADMIN_TABS,
} from "../constants/adminDashboard.constants";

import type {
  AdminTab,
} from "../types/adminDashboard.types";

interface DashboardTabsProps {
  currentTab: AdminTab;
  onChange: (tab: AdminTab) => void;
}

export default function DashboardTabs({
  currentTab,
  onChange,
}: DashboardTabsProps) {
  const activeTab =
    ADMIN_TABS.find(
      (tab) =>
        tab.id === currentTab
    ) || ADMIN_TABS[0];

  const ActiveIcon =
    activeTab.icon;

  return (
    <>
      {/* MOBILE / TABLET */}
      <div className="lg:hidden">
        <div
          className="
            relative
            w-full
            bg-white
            dark:bg-[#091a2c]
            border
            border-gray-200
            dark:border-white/10
            rounded-2xl
            shadow-sm
          "
        >
          <ActiveIcon
            size={20}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[var(--company-primary)]
              pointer-events-none
            "
          />

          <select
            value={currentTab}
            onChange={(event) =>
              onChange(
                event.target
                  .value as AdminTab
              )
            }
            className="
              w-full
              appearance-none
              bg-transparent
              text-[#080E2F]
              dark:text-white
              font-semibold
              pl-12
              pr-12
              py-4
              rounded-2xl
              outline-none
              cursor-pointer
            "
          >
            {ADMIN_TABS.map(
              (tab) => (
                <option
                  key={tab.id}
                  value={tab.id}
                  className="
                    text-gray-900
                    bg-white
                  "
                >
                  {tab.label}
                </option>
              )
            )}
          </select>

          <ChevronDown
            size={20}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-gray-500
              dark:text-gray-400
              pointer-events-none
            "
          />
        </div>
      </div>

      {/* NOTEBOOK / DESKTOP */}
      <div
        className="
          hidden
          lg:block
          border-b
          border-gray-200
          dark:border-white/10
          overflow-x-auto
          scrollbar-hide
          max-w-full
        "
      >
        <div
          className="
            flex
            items-end
            gap-1
            xl:gap-2
            min-w-max
          "
        >
          {ADMIN_TABS.map(
            (tab) => {
              const Icon =
                tab.icon;

              const isActive =
                currentTab ===
                tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    onChange(tab.id)
                  }
                  aria-current={
                    isActive
                      ? "page"
                      : undefined
                  }
                  className={`
                    shrink-0
                    flex
                    items-center
                    justify-center
                    gap-2

                    px-3
                    xl:px-4

                    pt-3
                    pb-4

                    border-b-[3px]

                    text-sm
                    xl:text-[15px]

                    font-semibold
                    whitespace-nowrap

                    cursor-pointer

                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          border-[var(--company-primary)]
                          text-[var(--company-primary)]
                        `
                        : `
                          border-transparent
                          text-gray-600
                          dark:text-gray-400
                          hover:text-[var(--company-primary)]
                        `
                    }
                  `}
                >
                  <Icon
                    size={18}
                    className="shrink-0"
                  />

                  <span>
                    {tab.label}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>
    </>
  );
}