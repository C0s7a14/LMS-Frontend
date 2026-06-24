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
    <div className=" bg-white dark:bg-[#091a2c]
        border border-gray-200 dark:border-white/10
        rounded-3xl
        p-5
        shadow-2xl
        dark:shadow-blue-500 dark:shadow-md
        cursor-pointer
        transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl active:scale-95 active:shadow-sm
        flex flex-col items-center text-center
        ">
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

      <p className="text-gray-500 dark:text-gray-400 text-sm pt-2">
        {title}
      </p>

      <h2 className="text-[#080E2F] dark:text-white text-4xl font-bold mt-2">
        {value}
      </h2>

      <span className="text-gray-500 text-sm ">
        {subtitle}
      </span>
    </div>
  );
}