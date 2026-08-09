import {
  CheckCircle2,
  Clock3,
  Eye,
  Mail,
  XCircle,
} from "lucide-react";

import type { FreelancerInviteSummaryType } from "../types/freelancerInvite.types";

interface FreelancerInvitePipelineProps {
  summary: FreelancerInviteSummaryType | null;
}

export default function FreelancerInvitePipeline({
  summary,
}: FreelancerInvitePipelineProps) {
  const items = [
    {
      label: "Rascunhos",
      value: Number(summary?.rascunhos ?? 0),
      icon: Clock3,
      color:
        "bg-gray-500/10 text-gray-600 dark:text-gray-300",
    },
    {
      label: "Enviados",
      value: Number(summary?.enviados ?? 0),
      icon: Mail,
      color:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Visualizados",
      value: Number(summary?.visualizados ?? 0),
      icon: Eye,
      color:
        "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
    {
      label: "Aceitos",
      value: Number(summary?.aceitos ?? 0),
      icon: CheckCircle2,
      color:
        "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      label: "Recusados",
      value: Number(summary?.recusados ?? 0),
      icon: XCircle,
      color:
        "bg-red-500/10 text-red-500",
    },
    {
      label: "Expirados",
      value: Number(summary?.expirados ?? 0),
      icon: Clock3,
      color:
        "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-2
        md:grid-cols-3
        xl:grid-cols-6
        gap-3
        sm:gap-4
      "
    >
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="
              rounded-2xl
              border
              border-gray-200
              dark:border-white/10
              bg-white
              dark:bg-[#0d2238]
              p-4
            "
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className="
                  text-sm
                  font-medium
                  text-gray-500
                  dark:text-gray-400
                "
              >
                {item.label}
              </span>

              <div
                className={`
                  w-9
                  h-9
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  ${item.color}
                `}
              >
                <Icon size={18} />
              </div>
            </div>

            <p
              className="
                mt-3
                text-2xl
                font-bold
                text-[#080E2F]
                dark:text-white
              "
            >
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}