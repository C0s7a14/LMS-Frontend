interface SidePanelItem {
  label: string;
  value: number;
  percentage: number;
}

interface SidePanelProps {
  title: string;
  items: SidePanelItem[];
}

export default function SidePanel({
  title,
  items,
}: SidePanelProps) {
  return (
    <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl">
      <h2 className="text-lg sm:text-xl font-bold text-[#080E2F] dark:text-white mb-5">
        {title}
      </h2>

      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2 gap-4">
              <span className="font-semibold text-[#080E2F] dark:text-white">
                {item.label}
              </span>

              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {item.value} ({item.percentage}%)
              </span>
            </div>

            <div className="w-full h-2 bg-gray-200 dark:bg-[#132d46] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${item.percentage}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}