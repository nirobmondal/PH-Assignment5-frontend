"use client";

import { LucideIcon } from "lucide-react";
import StatsCard from "./StatsCard";

export interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, columns = 4 }) => {
  const gridCols =
    {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    }[columns] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid gap-4 md:gap-6 ${gridCols}`}>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.label}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          className={stat.className}
        />
      ))}
    </div>
  );
};
