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
  function formatAxisLabel(
    value: string,
  ) {
    if (!value) {
      return "";
    }

    if (value.length <= 12) {
      return value;
    }

    return `${value.slice(0, 11)}…`;
  }

  return (
    <div
      className="
        w-full
        min-w-0

        rounded-2xl
        sm:rounded-3xl

        border
        border-gray-200
        dark:border-white/10

        bg-white
        dark:bg-[#091a2c]

        p-4
        sm:p-5
        lg:p-7

        shadow-2xl
        dark:shadow-sm
      "
    >
      {/* HEADER */}
      <div
        className="
          mb-5
          sm:mb-6
        "
      >
        <h2
          className="
            text-xl
            sm:text-2xl

            font-bold

            text-[#080E2F]
            dark:text-white

            leading-tight
            break-words
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1

            text-sm
            sm:text-base

            text-gray-500
            dark:text-gray-400

            leading-relaxed
          "
        >
          {subtitle}
        </p>
      </div>

      {/* GRÁFICO */}
      <div
        className="
          w-full

          h-[280px]
          sm:h-[320px]

          min-w-0
        "
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 8,
              left: -15,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient
                id="metricCompanyGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--company-primary)"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="var(--company-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.20)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              minTickGap={12}
              tickMargin={10}
              tickFormatter={
                formatAxisLabel
              }
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
            />

            <Tooltip
              cursor={{
                stroke:
                  "var(--company-primary)",
                strokeOpacity: 0.2,
                strokeWidth: 1,
              }}
              formatter={(value) => [
                `${value}${suffix}`,
                title,
              ]}
              labelStyle={{
                color: "#64748b",
                fontWeight: 600,
                marginBottom: "6px",
              }}
              contentStyle={{
                borderRadius: "16px",
                border:
                  "1px solid rgba(148, 163, 184, 0.25)",
                boxShadow:
                  "0 18px 40px rgba(15, 23, 42, 0.12)",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--company-primary)"
              strokeWidth={3}
              fill="url(#metricCompanyGradient)"
              dot={{
                r: 4,
                fill:
                  "var(--company-primary)",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 7,
                fill:
                  "var(--company-primary)",
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}