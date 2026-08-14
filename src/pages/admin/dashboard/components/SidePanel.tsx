interface SidePanelItem {
  label: string;
  value: number;
  percentage: number;
}

interface SidePanelProps {
  title: string;
  items: SidePanelItem[];
}

export default function SidePanel({
  title,
  items,
}: SidePanelProps) {
  return (
    <aside
      className="
        w-full
        min-w-0

        bg-white
        dark:bg-[#091a2c]

        border
        border-gray-200
        dark:border-white/10

        rounded-2xl
        sm:rounded-3xl

        p-4
        sm:p-5
        lg:p-6

        shadow-2xl
        dark:shadow-sm

        transition-shadow
        duration-200

        hover:shadow-[0_22px_45px_rgba(15,23,42,0.14)]
      "
    >
      <h2
        className="
          text-lg
          sm:text-xl

          font-bold

          text-[#080E2F]
          dark:text-white

          mb-5

          leading-tight
        "
      >
        {title}
      </h2>

      <div className="space-y-5">
        {items.map((item) => {
          const percentage = Math.min(
            Math.max(item.percentage, 0),
            100,
          );

          return (
            <div
              key={item.label}
              className="min-w-0"
            >
              <div
                className="
                  flex
                  items-start
                  justify-between

                  gap-3

                  mb-2
                "
              >
                <span
                  className="
                    min-w-0

                    font-semibold

                    text-sm
                    sm:text-base

                    text-[#080E2F]
                    dark:text-white

                    leading-snug
                    break-words
                  "
                >
                  {item.label}
                </span>

                <span
                  className="
                    shrink-0

                    text-xs
                    sm:text-sm

                    text-gray-500
                    dark:text-gray-400

                    whitespace-nowrap
                  "
                >
                  {item.value} ({percentage}%)
                </span>
              </div>

              <div
                className="
                  w-full
                  h-2

                  bg-gray-200
                  dark:bg-[#132d46]

                  rounded-full

                  overflow-hidden
                "
              >
                <div
                  className="
                    h-full

                    bg-gradient-to-r
                    from-[var(--company-primary)]
                    to-[var(--company-secondary)]

                    rounded-full

                    transition-all
                    duration-500
                  "
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}