interface AvatarProps {
  name: string;
}

export default function Avatar({
  name,
}: AvatarProps) {
  const initials = name
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      title={name || "Usuário"}
      className="
        w-11
        h-11

        sm:w-12
        sm:h-12

        rounded-full

        bg-gradient-to-br
        from-[var(--company-primary)]
        to-[var(--company-secondary)]

        text-white

        flex
        items-center
        justify-center

        text-sm
        font-bold

        shadow-lg

        shrink-0

        select-none
      "
    >
      {initials || "U"}
    </div>
  );
}