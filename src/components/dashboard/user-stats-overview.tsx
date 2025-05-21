import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import type { UserStats } from "@/data/mock-data"; // Assuming UserStats might change
import { Users2, TrendingUp, UserPlus, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder type if UserStats changes
type UserStats = {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  retentionRate: number;
};


type UserStatsOverviewProps = {
  stats: UserStats;
};

export function UserStatsOverview({ stats }: UserStatsOverviewProps) {
  const statItems = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users2,
      // Using Tailwind's text color utilities with theme variables is preferred if possible,
      // but direct classes are used here for simplicity matching the original.
      // For theme-based colors, you'd rely on --foreground, --primary, etc.
      textColor: "text-blue-600 dark:text-blue-400", // Example: adapt to theme
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: TrendingUp,
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "New Signups (Month)",
      value: stats.newSignups.toLocaleString(),
      icon: UserPlus,
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Retention Rate",
      value: `${stats.retentionRate.toFixed(1)}%`,
      icon: Percent,
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.title} className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            {/* For icons, rely on text-foreground or specific theme colors if not item.textColor */}
            <item.icon className={cn("h-5 w-5", item.textColor || 'text-muted-foreground')} />
          </CardHeader>
          <CardContent>
             {/* For value, rely on text-foreground or specific theme colors */}
            <div className={cn("text-3xl font-bold", item.textColor || 'text-foreground')}>{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
