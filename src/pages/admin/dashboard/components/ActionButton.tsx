import { ArrowRight, type LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}

export default function ActionButton({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        border
        border-gray-200
        dark:border-blue-500
        dark:shadow-none
        rounded-2xl
        p-4
        flex
        items-center
        justify-between
        hover:bg-gray-50
        dark:hover:bg-white/5
        text-left
        gap-4
        cursor-pointer
        shadow-xl
        hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]
        hover:-translate-y-1
        transition-all
      "
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Icon size={22} />
        </div>

        <div className="min-w-0">
          <h3 className="font-bold text-[#080E2F] dark:text-white truncate">
            {title}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      <ArrowRight
        size={20}
        className="text-gray-500 shrink-0"
      />
    </button>
  );
}