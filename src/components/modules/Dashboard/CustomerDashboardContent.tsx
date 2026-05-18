"use client";

import { StatsGrid, StatItem } from "@/components/shared/StatsGrid";
import { getDashboardStats } from "@/services/dashboard.services";
import { IDashboardStatsResponse } from "@/types/dashboard.types";
import { ShoppingCart, Package, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const CustomerDashboardContent = () => {
  const [stats, setStats] = useState<IDashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.success && response.data) {
          setStats(response.data as IDashboardStatsResponse);
        } else {
          setError("Failed to fetch stats");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!stats || !("totalOrderCount" in stats)) {
    return null;
  }

  const customerStats = stats as any;

  const statsData: StatItem[] = [
    {
      label: "Total Orders",
      value: customerStats.totalOrderCount,
      icon: ShoppingCart,
      description: "All orders placed",
    },
    {
      label: "Total Spent",
      value: `BDT ${customerStats.totalAmountSpent.toFixed(2)}`,
      icon: TrendingUp,
      description: "Successful orders",
    },
    {
      label: "Medicines Bought",
      value: customerStats.totalMedicineBought,
      icon: Package,
      description: "Total quantity",
    },
  ];

  return (
    <div className="space-y-6">
      <StatsGrid stats={statsData} columns={3} />
    </div>
  );
};

export default CustomerDashboardContent;
