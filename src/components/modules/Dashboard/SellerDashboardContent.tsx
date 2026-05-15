"use client";

import { StatsGrid, StatItem } from "@/components/shared/StatsGrid";
import { getDashboardStats } from "@/services/dashboard.services";
import { IDashboardStatsResponse } from "@/types/dashboard.types";
import { BarChart3, TrendingUp, Package, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

const SellerDashboardContent = () => {
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

  if (!stats || !("totalOrderCount" in stats && "totalSales" in stats)) {
    return null;
  }

  const sellerStats = stats as any;

  const statsData: StatItem[] = [
    {
      label: "Total Orders",
      value: sellerStats.totalOrderCount,
      icon: BarChart3,
      description: "All orders",
    },
    {
      label: "Delivered Sales",
      value: sellerStats.totalSales,
      icon: TrendingUp,
      description: "Successful deliveries",
    },
    {
      label: "Medicines Sold",
      value: sellerStats.totalMedicineSold,
      icon: Package,
      description: "Total quantity",
    },
    {
      label: "Total Earned",
      value: `$${sellerStats.totalAmountEarned.toFixed(2)}`,
      icon: DollarSign,
      description: "From deliveries",
    },
  ];

  return (
    <div className="space-y-6">
      <StatsGrid stats={statsData} columns={4} />
    </div>
  );
};

export default SellerDashboardContent;
