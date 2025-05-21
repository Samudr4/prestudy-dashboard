import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // Corrected import

type ChartCardProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
};

export function ChartCard({
  title,
  description,
  icon: Icon,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn("shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
