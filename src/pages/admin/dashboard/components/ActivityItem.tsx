import type { LucideIcon } from "lucide-react";

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  time: string;
  color: string;
}

export default function ActivityItem({
  icon: Icon,
  title,
  subtitle,
  time,
  color,
}: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`
            w-10
            h-10
            rounded-xl
            flex
            items-center
            justify-center
            shrink-0
            ${color}
          `}
        >
          <Icon size={20} />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-[#080E2F] dark:text-white truncate">
            {title}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {time}
      </span>
    </div>
  );
}