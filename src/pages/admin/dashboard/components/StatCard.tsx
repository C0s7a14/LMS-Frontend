import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
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
        bg-white
        dark:bg-[#091a2c]
        border
        rounded-4xl
        p-5
        sm:p-5
        min-h-55
        flex
        flex-col
        items-center
        justify-center
        text-center
        shadow-2xl
        dark:shadow-sm
        dark:shadow-blue-500
        cursor-pointer
        transition-all
        hover:-translate-y-1
        hover:shadow-[0_22px_50px_rgba(15,23,42,0.14)]
        ${
          active
            ? "border-blue-500 ring-2 ring-blue-500/20"
            : "border-gray-200 dark:border-white/10"
        }
        ${onClick ? "cursor-pointer" : "cursor-default"}
      `}
    >
      <div
        className={`
          w-7
          h-5
          rounded-3xl
          flex
          items-center
          justify-center
          mb-5
          shrink-0
          ${color}
        `}
      >
        <Icon size={38} />
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
        {title}
      </p>

      <h2 className="text-2xl sm:text-3xl font-bold text-[#080E2F] dark:text-white mt-3 leading-none">
        {value}
      </h2>

      <p className="text-gray-500 dark:text-gray-400 text-base mt-2">
        {subtitle}
      </p>
    </button>
  );
}