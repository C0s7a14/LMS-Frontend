import type {
  LucideIcon,
} from "lucide-react";

interface CompanyIconBoxProps {
  icon: LucideIcon;

  size?: "sm" | "md" | "lg";

  variant?:
    | "primary"
    | "gradient";

  className?: string;
}

export default function CompanyIconBox({
  icon: Icon,
  size = "md",
  variant = "gradient",
  className = "",
}: CompanyIconBoxProps) {
  const sizes = {
    sm: {
      container:
        "w-9 h-9 rounded-xl",
      icon: 18,
    },

    md: {
      container:
        "w-12 h-12 rounded-2xl",
      icon: 23,
    },

    lg: {
      container:
        "w-14 h-14 rounded-2xl",
      icon: 28,
    },
  };

  const variantClasses = {
    primary: `
      bg-[var(--company-primary)]
    `,

    gradient: `
      bg-gradient-to-br
      from-[var(--company-primary)]
      to-[var(--company-secondary)]
    `,
  };

  return (
    <div
      className={`
        ${sizes[size].container}
        ${variantClasses[variant]}
        flex
        items-center
        justify-center
        shrink-0
        text-white
        shadow-md
        ${className}
      `}
    >
      <Icon
        size={sizes[size].icon}
      />
    </div>
  );
}