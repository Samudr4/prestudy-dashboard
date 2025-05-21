"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUp, ArrowDown, MoreVertical, Users, ShoppingCart } from "lucide-react";
import type { TopStatCardData } from "@/data/mock-data";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  data: TopStatCardData;
}

export function SummaryCard({ data }: SummaryCardProps) {
  const TrendIcon = data.isPositiveChange ? ArrowUp : ArrowDown;
  const trendColor = data.isPositiveChange ? "text-green-500" : "text-red-500";

  const CompleteTrendIcon = data.isCompletePositiveChange === undefined ? null : (data.isCompletePositiveChange ? ArrowUp : ArrowDown);
  const completeTrendColor = data.isCompletePositiveChange === undefined ? "" : (data.isCompletePositiveChange ? "text-green-500" : "text-red-500");


  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-muted-foreground">{data.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {data.additionalCompleteInfo ? (
          // Special layout for "Purchase & Complete Quizzes"
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Purchase</p>
              <div className="text-2xl font-bold">{data.amount}</div>
              {data.additionalPurchaseInfo && (
                 <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="mr-1 h-3 w-3"/> 
                    {data.additionalPurchaseInfo}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Complete</p>
              <div className="text-2xl font-bold">{data.additionalCompleteInfo}</div>
              {CompleteTrendIcon && data.completePercentageChange !== undefined && (
                <div className={cn("flex items-center text-xs", completeTrendColor)}>
                  <CompleteTrendIcon className="mr-1 h-3 w-3" />
                  {Math.abs(data.completePercentageChange)}%
                </div>
              )}
            </div>
          </div>
        ) : (
          // Standard layout
          <>
            <div className="text-3xl font-bold">{data.amount}</div>
            {data.percentageChange !== undefined && (
              <div className={cn("flex items-center text-sm mt-1", trendColor)}>
                <TrendIcon className="mr-1 h-4 w-4" />
                {Math.abs(data.percentageChange)}%
                {data.trendLabel && <span className="ml-1 text-muted-foreground text-xs">{data.trendLabel}</span>}
              </div>
            )}
          </>
        )}
        <CardDescription className="text-xs mt-2">{data.previousPeriodValue}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">Details</Button>
      </CardFooter>
    </Card>
  );
}
