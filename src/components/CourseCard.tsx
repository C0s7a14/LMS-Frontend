interface Props {
  title: string;
  progress: number;
  subtitle?: string;
  progressColor?: string;
}

export default function CourseCard({
  title,
  progress,
  subtitle = "SIROS Gateway IoT",
  progressColor = "bg-blue-700 dark:bg-blue-500",
}: Props) {
  return (
    <div className="bg-white dark:bg-[#0d2238] border border-gray-200 dark:border-white/5 rounded-2xl
     p-5 shadow-2xl transition-all duration-300 ease-in-out
      hover:scale-105 hover:shadow-xl 
      active:scale-95 active:shadow-sm cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[#080E2F] dark:text-white font-semibold">
            {title}
          </h3>

          <p className="text-gray-500 text-sm">
            {subtitle}
          </p>
        </div>

        <span className="text-gray-500 dark:text-gray-400 text-sm ">
          {progress}%
        </span>
      </div>

      <div className="w-full h-2 bg-gray-200 dark:bg-[#132d46] rounded-full mt-4 overflow-hidden ">
        <div
          style={{
            width: `${progress}%`,
          }}
          className={`h-full ${progressColor} rounded-full`}
        />
      </div>
    </div>
  );
}