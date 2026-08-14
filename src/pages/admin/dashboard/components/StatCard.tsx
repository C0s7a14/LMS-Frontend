import type {
  LucideIcon,
} from "lucide-react";

interface StatCardProps {
  title: string;

  value:
    | string
    | number;

  subtitle: string;

  icon: LucideIcon;

  color: string;

  onClick?: () => void;

  active?: boolean;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  onClick,
  active = false,
}: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full
        min-w-0
        min-h-[180px]

        bg-white
        dark:bg-[#091a2c]

        border

        rounded-3xl

        p-4
        sm:p-5

        flex
        flex-col
        items-center
        justify-center

        text-center

        shadow-2xl
        dark:shadow-sm

        transition-all
        duration-200

        ${
          active
            ? `
                border-[var(--company-primary)]

                ring-2
                ring-[color-mix(in_srgb,var(--company-primary)_18%,transparent)]
              `
            : `
                border-gray-300
                dark:border-white/10
              `
        }

        ${
          onClick
            ? `
                cursor-pointer
                hover:-translate-y-1
                hover:shadow-[0_22px_50px_rgba(15,23,42,0.16)]
              `
            : `
                cursor-default
              `
        }
      `}
    >
      <div
        className={`
          w-12
          h-12

          sm:w-14
          sm:h-14

          rounded-2xl

          flex
          items-center
          justify-center

          mb-4

          shrink-0

          ${color}
        `}
      >
        <Icon
          size={26}
          className="
            sm:w-7
            sm:h-7
          "
        />
      </div>

      <p
        className="
          w-full

          text-gray-500
          dark:text-gray-400

          text-sm
          sm:text-base

          font-medium

          leading-snug
          break-words
        "
      >
        {title}
      </p>

      <h2
        className="
          max-w-full

          text-2xl
          sm:text-3xl

          font-bold

          text-[#080E2F]
          dark:text-white

          mt-2

          leading-none

          break-words
        "
      >
        {value}
      </h2>

      <p
        className="
          w-full

          text-gray-500
          dark:text-gray-400

          text-sm
          sm:text-base

          mt-2

          leading-snug
          break-words
        "
      >
        {subtitle}
      </p>
    </button>
  );
}