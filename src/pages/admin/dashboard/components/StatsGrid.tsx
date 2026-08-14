import type {
  ReactNode,
} from "react";

interface StatsGridProps {
  children: ReactNode;
}

export default function StatsGrid({
  children,
}: StatsGridProps) {
  return (
    <div
      className="
        w-full
        min-w-0

        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        2xl:grid-cols-6

        gap-4
        xl:gap-5
      "
    >
      {children}
    </div>
  );
}