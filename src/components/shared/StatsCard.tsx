import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
  iconClassName?: string;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  className,
  iconClassName,
}: StatsCardProps) => {
  return (
    <Card
      className={cn("hover:shadow-lg transition-all duration-200", className)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary",
            iconClassName,
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground font-medium">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
