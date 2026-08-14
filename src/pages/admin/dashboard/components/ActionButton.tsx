import {
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

import CompanyIconBox from "../../../../components/ui/CompanyIconBox";

interface ActionButtonProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}

export default function ActionButton({
  icon,
  title,
  subtitle,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        min-w-0
        min-h-[104px]

        bg-white
        dark:bg-[#091a2c]

        border
        border-gray-300
        dark:border-white/10

        rounded-2xl

        p-4

        grid
        grid-cols-[auto_minmax(0,1fr)_auto]

        items-center

        gap-3

        text-left

        shadow-2xl
        dark:shadow-sm

        hover:bg-gray-50
        dark:hover:bg-white/5

        hover:-translate-y-1
        hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]

        transition-all
        duration-200

        cursor-pointer
      "
    >
      <CompanyIconBox
        icon={icon}
        size="sm"
        variant="gradient"
      />

      <div
        className="
          min-w-0
          min-h-[58px]

          flex
          flex-col
          justify-center
        "
      >
        <h3
          className="
            font-bold

            text-sm
            sm:text-base

            text-[#080E2F]
            dark:text-white

            leading-snug
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1

            text-xs
            sm:text-sm

            text-gray-500
            dark:text-gray-400

            leading-snug
          "
        >
          {subtitle}
        </p>
      </div>

      <ArrowRight
        size={20}
        className="
          shrink-0
          text-[var(--company-primary)]
        "
      />
    </button>
  );
}