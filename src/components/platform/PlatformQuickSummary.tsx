import type {
  LucideIcon,
} from "lucide-react";

import PlatformIconBox from "./PlatformIconBox";

interface PlatformQuickSummaryProps {
  icon: LucideIcon;

  title: string;

  value: number;

  onClick?: () => void;
}

export default function PlatformQuickSummary({
  icon,
  title,
  value,
  onClick,
}: PlatformQuickSummaryProps) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      disabled={
        !onClick
      }
      className={`
        w-full
        min-w-0
        min-h-[88px]

        bg-white
        dark:bg-[#091a2c]

        border
        border-gray-300
        dark:border-white/10

        rounded-2xl

        p-4
        sm:p-5

        flex
        items-center
        justify-between

        gap-3
        sm:gap-4

        text-left

        shadow-2xl
        dark:shadow-sm

        transition-all
        duration-200

        ${
          onClick
            ? `
                cursor-pointer

                hover:-translate-y-1

                hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]
              `
            : `
                cursor-default
              `
        }
      `}
    >
      <div
        className="
          min-w-0

          flex
          items-center
          gap-3
        "
      >
        <PlatformIconBox
          icon={icon}
          size="sm"
          variant="gradient"
        />

        <span
          className="
            min-w-0

            font-bold

            text-sm
            sm:text-base

            text-[#080E2F]
            dark:text-white

            leading-snug
            break-words
          "
        >
          {title}
        </span>
      </div>

      <strong
        className="
          shrink-0

          text-xl
          sm:text-2xl

          font-bold

          text-[#080E2F]
          dark:text-white
        "
      >
        {value}
      </strong>
    </button>
  );
}