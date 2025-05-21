"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
// import type { SalesData } from "@/data/mock-data"; // Assuming SalesData might change

// Placeholder type if SalesData changes
type SalesData = {
  month: string;
  sales: number;
  target: number;
};


type SalesBarChartProps = {
  data: SalesData[];
};

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function SalesBarChart({ data }: SalesBarChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center text-muted-foreground">No data available</div>;
  }
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
          <Bar dataKey="target" fill="var(--color-target)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
