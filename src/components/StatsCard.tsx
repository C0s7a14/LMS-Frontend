import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-blue-500",
  iconBg = "bg-blue-500/20",
}: Props) {
  return (
    <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-5 shadow-2xl">
      <div
        className={`
          w-14
          h-14
          rounded-2xl
          ${iconBg}
          flex
          items-center
          justify-center
          
        `}
      >
        <Icon className={iconColor} size={26} />
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {title}
      </p>

      <h2 className="text-[#080E2F] dark:text-white text-4xl font-bold mt-2">
        {value}
      </h2>

      <span className="text-gray-500 text-sm">
        {subtitle}
      </span>
    </div>
  );
}