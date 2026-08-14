interface ReportLineProps {
  label: string;
  value: string;
}

export default function ReportLine({
  label,
  value,
}: ReportLineProps) {
  return (
    <div
      className="
        flex
        flex-col

        sm:flex-row
        sm:items-center
        sm:justify-between

        gap-1
        sm:gap-4

        py-4

        border-b
        border-gray-200
        dark:border-white/10

        last:border-b-0
      "
    >
      <span
        className="
          min-w-0

          font-semibold

          text-[#080E2F]
          dark:text-white

          break-words
        "
      >
        {label}
      </span>

      <span
        className="
          shrink-0

          text-sm
          sm:text-base

          font-medium

          text-gray-500
          dark:text-gray-400

          sm:text-right

          break-words
        "
      >
        {value}
      </span>
    </div>
  );
}