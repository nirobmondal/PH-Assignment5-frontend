"use client";

import { StatsGrid, StatItem } from "@/components/shared/StatsGrid";
import { getDashboardStats } from "@/services/dashboard.services";
import { IDashboardStatsResponse } from "@/types/dashboard.types";
import { Users, Store, ShoppingCart, TrendingUp, Settings } from "lucide-react";
import { useEffect, useState } from "react";

const AdminDashboardContent = () => {
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

  if (!stats || !("totalUsersCount" in stats && "totalSellerCount" in stats)) {
    return null;
  }

  const adminStats = stats as any;

  const statsData: StatItem[] = [
    {
      label: "Total Users",
      value: adminStats.totalUsersCount,
      icon: Users,
      description: "Active users",
    },
    {
      label: "Total Sellers",
      value: adminStats.totalSellerCount,
      icon: Store,
      description: "Registered sellers",
    },
    {
      label: "Total Customers",
      value: adminStats.totalCustomerCount,
      icon: Users,
      description: "Buying customers",
    },
    {
      label: "Total Orders",
      value: adminStats.totalOrdersCount,
      icon: ShoppingCart,
      description: "Platform wide",
    },
    {
      label: "Platform Earnings",
      value: `$${adminStats.totalPlatformAmountEarned.toFixed(2)}`,
      icon: TrendingUp,
      description: "From deliveries",
    },
    {
      label: "Admins",
      value: adminStats.totalAdminCount,
      icon: Settings,
      description: "System admins",
    },
  ];

  return (
    <div className="space-y-6">
      <StatsGrid stats={statsData} columns={3} />
    </div>
  );
};

export default AdminDashboardContent;
