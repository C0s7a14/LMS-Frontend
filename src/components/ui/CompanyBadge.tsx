import type {
  LucideIcon,
} from "lucide-react";

interface CompanyBadgeProps {
  text: string;

  icon?: LucideIcon;

  className?: string;
}

export default function CompanyBadge({
  text,
  icon: Icon,
  className = "",
}: CompanyBadgeProps) {
  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        px-3
        py-1.5
        text-sm
        font-semibold

        bg-[color-mix(in_srgb,var(--company-primary)_12%,transparent)]

        text-[var(--company-primary)]

        ${className}
      `}
    >
      {Icon && (
        <Icon
          size={16}
          className="shrink-0"
        />
      )}

      <span>
        {text}
      </span>
    </div>
  );
}