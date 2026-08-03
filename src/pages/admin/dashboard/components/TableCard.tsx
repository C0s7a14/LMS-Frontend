import type { ReactNode } from "react";

interface TableCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function TableCard({
  title,
  children,
  className = "",
  contentClassName = "",
}: TableCardProps) {
  return (
    <div
      className={`
        bg-white
        dark:bg-[#091a2c]
        border
        border-gray-200
        dark:border-white/10
        rounded-3xl
        p-4
        sm:p-6
        overflow-hidden
        shadow-2xl
        dark:shadow-none
        transition-all
        hover:shadow-[0_22px_45px_rgba(15,23,42,0.12)]
        ${className}
      `}
    >
      <h2 className="text-lg sm:text-xl font-bold text-[#080E2F] dark:text-white mb-5">
        {title}
      </h2>

      <div
        className={`overflow-x-auto scrollbar-hide ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
}