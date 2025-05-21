"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
// import type { RevenueData } from "@/data/mock-data"; // Assuming RevenueData might change
import { format } from "date-fns";

// Placeholder type if RevenueData changes
type RevenueData = {
  date: string;
  revenue: number;
  profit?: number;
};


type RevenueLineChartProps = {
  data: RevenueData[];
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RevenueLineChart({ data }: RevenueLineChartProps) {
   if (!data || data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center text-muted-foreground">No data available</div>;
  }
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), "MMM")}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            dataKey="revenue"
            type="monotone"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            dot={true}
          />
           {data.some(d => d.profit !== undefined) && (
            <Line
              dataKey="profit"
              type="monotone"
              stroke="var(--color-profit)"
              strokeWidth={2}
              dot={true}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
