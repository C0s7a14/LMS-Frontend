import type{ LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: Props) {
  return (
    <div className="bg-[#091a2c] border border-white/10 rounded-3xl p-5">

      <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
        <Icon className="text-blue-400" />
      </div>

      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h2 className="text-white text-4xl font-bold mt-2">
        {value}
      </h2>

      <span className="text-gray-500 text-sm">
        {subtitle}
      </span>
    </div>
  );
}