import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);
  return [
    {
      items: [
        {
          title: "Home",
          href: "/",
          icon: "Home",
        },
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
        },
        {
          title: "My Profile",
          href: `/my-profile`,
          icon: "User",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Change Password",
          href: "change-password",
          icon: "Settings",
        },
      ],
    },
  ];
};

export const sellerNavItems: NavSection[] = [
  {
    title: "Medicine Management",
    items: [
      {
        title: "Manage Medicines",
        href: "/seller/dashboard/manage-medicine",
        icon: "Pill",
      },
    ],
  },
  {
    title: "Orders",
    items: [
      {
        title: "Get Orders",
        href: "/seller/dashboard/order",
        icon: "ClipboardList",
      },
    ],
  },
];

export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "Ban or Activate Users",
        href: "/admin/dashboard/manage-user",
        icon: "UserX",
      },
    ],
  },
  {
    title: "Category Management",
    items: [
      {
        title: "Categories",
        href: "/admin/dashboard/manage-category",
        icon: "Tag",
      },
    ],
  },
  {
    title: "Manufacturer Management",
    items: [
      {
        title: "Manufacturers",
        href: "/admin/dashboard/manage-manufacturer",
        icon: "Factory",
      },
    ],
  },
  {
    title: "Review Management",
    items: [
      {
        title: "Reviews",
        href: "/admin/dashboard/manage-review",
        icon: "Star",
      },
    ],
  },

  {
    title: "Orders",
    items: [
      {
        title: "All Orders",
        href: "/admin/dashboard/order",
        icon: "ClipboardList",
      },
    ],
  },
];

export const customerNavItems: NavSection[] = [
  {
    title: "Cart",
    items: [
      {
        title: "View Cart",
        href: "/dashboard/cart",
        icon: "ShoppingCart",
      },
    ],
  },
  {
    title: "Orders",
    items: [
      {
        title: "All Orders",
        href: "/dashboard/order",
        icon: "ClipboardList",
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];

    case "SELLER":
      return [...commonNavItems, ...sellerNavItems];

    case "CUSTOMER":
      return [...commonNavItems, ...customerNavItems];
  }
};
