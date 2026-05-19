"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.types";
import { IUserResponse } from "@/types/user.types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarContentProps {
  userInfo: IUserResponse;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardSidebarContent = ({
  navItems,
  userInfo,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();

  // Role-based dashboard title
  const roleTitle = `${(userInfo?.role?.toLowerCase().charAt(0).toUpperCase() || "") + (userInfo?.role?.toLowerCase().slice(1) || "")} Dashboard`;

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-card  overflow-y-auto">
      {/* Role-based Dashboard Heading */}
      <div className="sticky top-0 z-10 flex h-16 items-center border-b px-6 bg-gradient-to-r from-primary/10 to-transparent bg-card">
        <h2 className="text-md font-bold text-primary py-5">{roleTitle}</h2>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1.5">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                      {isActive && (
                        <div className="ml-auto h-1 w-1 rounded-full bg-primary-foreground"></div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {sectionId < navItems.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info At Bottom - with avatar image support */}
      <div className="border-t px-3 py-4 space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-accent/50">
          {/* Avatar: image if exists, else initial */}
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
            <span className="text-sm font-bold text-primary-foreground">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate text-foreground">
              {userInfo?.name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {userInfo?.role?.toLowerCase().replace("_", " ") || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebarContent;
