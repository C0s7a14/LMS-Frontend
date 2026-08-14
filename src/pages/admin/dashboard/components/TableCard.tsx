import type {
  ReactNode,
} from "react";

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
    <section
      className={`
        w-full
        min-w-0

        bg-white
        dark:bg-[#091a2c]

        border
        border-gray-300
        dark:border-white/10

        rounded-2xl
        sm:rounded-3xl

        p-4
        sm:p-5
        lg:p-6

        overflow-hidden

        shadow-2xl
        dark:shadow-sm

        transition-shadow
        duration-200

        hover:shadow-[0_22px_45px_rgba(15,23,42,0.14)]

        ${className}
      `}
    >
      <h2
        className="
          text-lg
          sm:text-xl

          font-bold

          text-[#080E2F]
          dark:text-white

          mb-4
          sm:mb-5

          leading-tight
        "
      >
        {title}
      </h2>

      <div
        className={`
          w-full
          min-w-0

          overflow-x-auto
          scrollbar-hide

          ${contentClassName}
        `}
      >
        {children}
      </div>
    </section>
  );
}