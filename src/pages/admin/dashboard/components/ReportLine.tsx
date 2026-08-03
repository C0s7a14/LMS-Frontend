interface ReportLineProps {
  label: string;
  value: string;
}

export default function ReportLine({
  label,
  value,
}: ReportLineProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-200 dark:border-white/10 last:border-b-0">
      <span className="font-semibold text-[#080E2F] dark:text-white">
        {label}
      </span>

      <span className="text-gray-500 dark:text-gray-400 text-right">
        {value}
      </span>
    </div>
  );
}