import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MetricChartData {
  label: string;
  value: number;
}

interface MetricChartProps {
  title: string;
  subtitle: string;
  data: MetricChartData[];
  suffix?: string;
}

export default function MetricChart({
  title,
  subtitle,
  data,
  suffix = "",
}: MetricChartProps) {
  return (
    <div className="bg-white dark:bg-[#091a2c] border border-gray-200 dark:border-white/10 rounded-3xl p-5 sm:p-7 shadow-[0_18px_40px_rgba(15,23,42,0.10)] dark:shadow-none">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#080E2F] dark:text-white">
          {title}
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      </div>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="metricGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 13,
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 13,
              }}
            />

            <Tooltip
              formatter={(value) => [
                `${value}${suffix}`,
                title,
              ]}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#metricGradient)"
              dot={{
                r: 5,
                fill: "#2563eb",
              }}
              activeDot={{
                r: 7,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}