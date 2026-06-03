interface Props {
  title: string;
  progress: number;
}

export default function CourseCard({
  title,
  progress,
}: Props) {
  return (
    <div className="bg-[#0d2238] border border-white/5 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-white font-semibold">
            {title}
          </h3>

          <p className="text-gray-500 text-sm">
            SIROS Gateway IoT
          </p>
        </div>

        <span className="text-gray-400 text-sm">
          {progress}%
        </span>
      </div>

      <div className="w-full h-2 bg-[#132d46] rounded-full mt-4 overflow-hidden">

        <div
          style={{
            width: `${progress}%`,
          }}
          className="h-full bg-blue-500 rounded-full"
        />

      </div>
    </div>
  );
}