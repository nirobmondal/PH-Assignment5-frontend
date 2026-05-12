export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

interface UserStats {
  totalOrderCount: number;
  totalAmountSpent: number;
  totalMedicineBought: number;
}

interface SellerStats {
  totalOrderCount: number;
  totalSales: number;
  totalAmountEarned: number;
  totalRevenue: number;
  totalMedicineSold: number;
}

interface AdminStats {
  totalUsersCount: number;
  totalSellerCount: number;
  totalCustomerCount: number;
  totalAdminCount: number;
  totalOrdersCount: number;
  totalPlatformAmountEarned: number;
}

export type IDashboardStatsResponse = UserStats | SellerStats | AdminStats;
