import type { LucideIcon } from "lucide-react";

interface QuickSummaryProps {
  icon: LucideIcon;
  title: string;
  value: number;
  onClick: () => void;
}

export default function QuickSummary({
  icon: Icon,
  title,
  value,
  onClick,
}: QuickSummaryProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        bg-white
        dark:bg-[#091a2c]
        border
        border-gray-200
        dark:border-blue-500
        rounded-2xl
        p-5
        min-h-24
        flex
        items-center
        justify-between
        gap-4
        shadow-[0_12px_30px_rgba(15,23,42,0.08)]
        dark:shadow-none
        hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]
        hover:-translate-y-1
        transition-all
      "
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Icon size={22} />
        </div>

        <span className="font-bold text-[#080E2F] dark:text-white truncate">
          {title}
        </span>
      </div>

      <strong className="text-[#080E2F] dark:text-white shrink-0">
        {value}
      </strong>
    </button>
  );
}