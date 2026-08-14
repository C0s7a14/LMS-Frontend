import {
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

interface PlatformDashboardHeaderProps {
  title: string;
  subtitle: string;

  placeholder?: string;

  actionLabel?: string;

  search?: string;

  actionType?:
    | "create"
    | "refresh";

  onSearchChange?: (
    value: string
  ) => void;

  onMainAction?: () => void;

  actionLoading?: boolean;
}

export default function PlatformDashboardHeader({
  title,
  subtitle,

  placeholder = "",

  actionLabel = "",

  search = "",

  actionType = "create",

  onSearchChange,
  onMainAction,

  actionLoading = false,
}: PlatformDashboardHeaderProps) {
  const hasSearch =
    Boolean(
      placeholder.trim()
    ) &&
    Boolean(
      onSearchChange
    );

  const hasAction =
    Boolean(
      actionLabel.trim()
    ) &&
    Boolean(
      onMainAction
    );

  const hasControls =
    hasSearch ||
    hasAction;

  const ActionIcon =
    actionType === "refresh"
      ? RefreshCw
      : Plus;

  return (
    <header
      className="
        w-full
        min-w-0

        flex
        flex-col

        gap-5
        xl:gap-6

        2xl:flex-row
        2xl:items-start
        2xl:justify-between
      "
    >
      {/* TÍTULO */}
      <div
        className="
          w-full
          min-w-0

          2xl:flex-1
          2xl:max-w-3xl
        "
      >
        <h1
          className="
            text-2xl
            sm:text-3xl
            lg:text-4xl

            font-bold

            text-[#080E2F]
            dark:text-white

            leading-tight
            break-words
          "
        >
          {title}
        </h1>

        <p
          className="
            mt-2

            max-w-3xl

            text-sm
            sm:text-base

            text-gray-500
            dark:text-gray-400

            leading-relaxed
          "
        >
          {subtitle}
        </p>
      </div>

      {/* CONTROLES */}
      {hasControls && (
        <div
          className="
            w-full
            min-w-0

            2xl:w-auto
            2xl:min-w-[380px]

            flex
            flex-col

            gap-3
          "
        >
          {/* BUSCA */}
          {hasSearch && (
            <div
              className="
                relative

                w-full

                2xl:w-[380px]
                2xl:self-end
              "
            >
              <Search
                size={20}
                className="
                  absolute

                  left-4
                  top-1/2

                  -translate-y-1/2

                  text-gray-400

                  pointer-events-none
                "
              />

              <input
                type="search"
                value={search}
                onChange={(
                  event
                ) =>
                  onSearchChange?.(
                    event
                      .target
                      .value
                  )
                }
                placeholder={
                  placeholder
                }
                className="
                  w-full
                  min-w-0

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

                  text-sm
                  sm:text-base

                  text-[#080E2F]
                  dark:text-white

                  placeholder:text-gray-400
                  dark:placeholder:text-gray-500

                  outline-none

                  shadow-xl
                  dark:shadow-sm

                  focus:border-blue-500

                  focus:ring-4
                  focus:ring-blue-500/10

                  transition-all
                "
              />
            </div>
          )}

          {/* AÇÃO PRINCIPAL */}
          {hasAction && (
            <div
              className="
                flex
                justify-stretch

                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={
                  onMainAction
                }
                disabled={
                  actionLoading
                }
                className="
                  w-full
                  sm:w-auto

                  min-w-0

                  px-5

                  py-3.5
                  sm:py-4

                  rounded-2xl

                  whitespace-nowrap

                  bg-gradient-to-r
                  from-blue-500
                  to-purple-600

                  hover:from-blue-600
                  hover:to-purple-700

                  text-white

                  font-semibold

                  shadow-xl

                  transition-all

                  flex
                  items-center
                  justify-center
                  gap-2

                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                <ActionIcon
                  size={20}
                  className={`
                    shrink-0

                    ${
                      actionLoading &&
                      actionType ===
                        "refresh"
                        ? "animate-spin"
                        : ""
                    }
                  `}
                />

                <span className="truncate">
                  {actionLoading
                    ? actionType ===
                      "refresh"
                      ? "Atualizando..."
                      : "Processando..."
                    : actionLabel}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}