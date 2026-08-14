import type {
  LucideIcon,
} from "lucide-react";

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
    <div
      className="
        w-full
        min-w-0

        flex
        flex-col
        gap-2

        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:gap-4
      "
    >
      <div
        className="
          w-full
          min-w-0

          flex
          items-center
          gap-3
        "
      >
        <div
          className={`
            w-10
            h-10

            sm:w-11
            sm:h-11

            rounded-xl

            flex
            items-center
            justify-center

            shrink-0

            ${color}
          `}
        >
          <Icon
            size={20}
            className="shrink-0"
          />
        </div>

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <h3
            className="
              font-semibold

              text-sm
              sm:text-base

              text-[#080E2F]
              dark:text-white

              leading-snug
              break-words
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-0.5

              text-xs
              sm:text-sm

              text-gray-500
              dark:text-gray-400

              leading-snug
              break-words
            "
          >
            {subtitle}
          </p>
        </div>
      </div>

      <span
        className="
          shrink-0

          pl-[52px]
          sm:pl-0

          text-xs
          sm:text-sm

          text-gray-500
          dark:text-gray-400

          whitespace-nowrap
        "
      >
        {time}
      </span>
    </div>
  );
}