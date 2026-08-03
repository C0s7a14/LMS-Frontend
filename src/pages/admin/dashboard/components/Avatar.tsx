interface AvatarProps {
  name: string;
}

export default function Avatar({
  name,
}: AvatarProps) {
  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
      {initials || "U"}
    </div>
  );
}