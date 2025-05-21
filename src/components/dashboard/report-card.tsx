"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { mockReportStats, mockWeeklyReportData, type ReportStat, type WeeklyChartDataPoint } from "@/data/mock-data";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.highlighted && data.highlightLabel) {
      return (
        <div className="rounded-md bg-background/80 p-2 text-foreground shadow-lg backdrop-blur">
          <p className="text-sm font-semibold">{data.highlightLabel}</p>
        </div>
      );
    }
    return (
      <div className="rounded-md bg-background/80 p-2 text-foreground shadow-lg backdrop-blur">
        <p className="text-sm">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


export function ReportCard() {
  const [activeTab, setActiveTab] = useState<"thisWeek" | "lastWeek">("thisWeek");
  // TODO: Fetch different data for "lastWeek"
  const reportStats: ReportStat[] = mockReportStats; 
  const chartData: WeeklyChartDataPoint[] = mockWeeklyReportData;

  const yAxisFormatter = (value: number) => {
    if (value >= 1000) return `${value / 1000}k`;
    return value.toString();
  };
  
  const highlightedPoint = chartData.find(d => d.highlighted);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Report for this week</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs defaultValue="thisWeek" className="w-auto" onValueChange={(value) => setActiveTab(value as "thisWeek" | "lastWeek")}>
              <TabsList className="grid h-8 grid-cols-2 p-0">
                <TabsTrigger value="thisWeek" className="h-full rounded-l-md rounded-r-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">This week</TabsTrigger>
                <TabsTrigger value="lastWeek" className="h-full rounded-l-none rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Last week</TabsTrigger>
              </TabsList>
            </Tabs>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem>Download Report</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {reportStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
              <defs>
                <linearGradient id="colorReport" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} dy={10} />
              <YAxis tickFormatter={yAxisFormatter} tickLine={false} axisLine={false} dx={-5} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorReport)" />
              {highlightedPoint && (
                <ReferenceDot 
                  x={highlightedPoint.day} 
                  y={highlightedPoint.value} 
                  r={6} 
                  fill="hsl(var(--primary))" 
                  stroke="hsl(var(--background))" 
                  strokeWidth={2} 
                  isFront={true} 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
