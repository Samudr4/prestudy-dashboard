"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockUserActivityValue, mockUserActivityChartData, type UserActivityDataPoint } from "@/data/mock-data";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";


export function UserActivityCard() {
  const usersPerMinute: number = mockUserActivityValue;
  const chartData: UserActivityDataPoint[] = mockUserActivityChartData;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Users in last 30 minutes</CardTitle>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Refresh</DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-foreground">{usersPerMinute}</p>
        <p className="text-xs text-muted-foreground mb-3">Users per minute</p>
        <div className="h-[60px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={2} barCategoryGap="20%">
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
