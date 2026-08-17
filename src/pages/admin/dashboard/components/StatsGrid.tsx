import type {
  ReactNode,
} from "react";

interface StatsGridProps {
  children: ReactNode;
  columns?: 5 | 6;
}
export default function StatsGrid({
  children,
  columns = 6,
}: StatsGridProps) {
  return (
    <div
      className={`
        w-full
        min-w-0

        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3

        ${
          columns === 5
            ? "2xl:grid-cols-5"
            : "2xl:grid-cols-6"
        }

        gap-4
        xl:gap-5
      `}
    >
      {children}
    </div>
  );
}