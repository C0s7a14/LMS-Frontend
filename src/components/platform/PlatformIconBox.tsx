import type {
  LucideIcon,
} from "lucide-react";

interface PlatformIconBoxProps {
  icon: LucideIcon;

  size?:
    | "sm"
    | "md"
    | "lg";

  variant?:
    | "gradient"
    | "soft";
}

export default function PlatformIconBox({
  icon: Icon,
  size = "md",
  variant = "gradient",
}: PlatformIconBoxProps) {
  const sizeClasses = {
    sm: `
      w-10
      h-10
      sm:w-11
      sm:h-11
    `,

    md: `
      w-12
      h-12
      sm:w-14
      sm:h-14
    `,

    lg: `
      w-14
      h-14
      sm:w-16
      sm:h-16
    `,
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28,
  };

  const variantClasses = {
    gradient: `
      bg-gradient-to-br
      from-blue-500
      to-purple-600

      text-white

      shadow-lg
    `,

    soft: `
      bg-blue-500/10

      text-blue-600
      dark:text-blue-400
    `,
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}

        ${variantClasses[variant]}

        rounded-2xl

        flex
        items-center
        justify-center

        shrink-0

        transition-colors
      `}
    >
      <Icon
        size={
          iconSizes[size]
        }
        className="shrink-0"
      />
    </div>
  );
}