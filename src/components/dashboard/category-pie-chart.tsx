"use client";

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
// import type { CategoryData } from "@/data/mock-data"; // Assuming CategoryData might be reused or adapted

// Placeholder type if CategoryData is removed or significantly changed
type CategoryData = {
  name: string;
  value: number;
  fill?: string;
};

type CategoryPieChartProps = {
  data: CategoryData[];
};


export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center text-muted-foreground">No data available</div>;
  }
  
  const chartConfig = data.reduce((acc, entry) => {
    acc[entry.name.toLowerCase().replace(/\s+/g, '')] = { label: entry.name, color: entry.fill };
    return acc;
  }, {} as ChartConfig);


  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || `hsl(var(--chart-${(index % 5) + 1}))`} />
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
