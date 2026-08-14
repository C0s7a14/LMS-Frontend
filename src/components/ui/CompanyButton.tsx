import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

interface CompanyButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  variant?:
    | "gradient"
    | "solid"
    | "outline";

  fullWidth?: boolean;
}

export default function CompanyButton({
  children,
  variant = "gradient",
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: CompanyButtonProps) {
  const baseClasses = `
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-2xl
    px-5
    py-3
    font-semibold
    transition-all
    duration-200
    disabled:opacity-50
    disabled:cursor-not-allowed
    active:scale-[0.98]
  `;

  const variantClasses = {
    gradient: `
      bg-gradient-to-r
      from-[var(--company-primary)]
      to-[var(--company-secondary)]
      text-white
      shadow-lg
      hover:brightness-105
    `,

    solid: `
      bg-[var(--company-primary)]
      text-white
      shadow-md
      hover:brightness-105
    `,

    outline: `
      bg-transparent
      border
      border-[var(--company-primary)]
      text-[var(--company-primary)]
      hover:bg-[color-mix(in_srgb,var(--company-primary)_10%,transparent)]
    `,
  };

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}