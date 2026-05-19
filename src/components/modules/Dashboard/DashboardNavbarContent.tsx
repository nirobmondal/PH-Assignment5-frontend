"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/dashboard.types";
import { IUserResponse } from "@/types/user.types";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import UserDropdown from "./UserDropdown";
import Image from "next/image";

interface DashboardNavbarProps {
  userInfo: IUserResponse;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardNavbarContent = ({
  dashboardHome,
  navItems,
  userInfo,
}: DashboardNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSmallerScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkSmallerScreen();
    window.addEventListener("resize", checkSmallerScreen);

    return () => {
      window.removeEventListener("resize", checkSmallerScreen);
    };
  }, []);

  return (
    <div className="flex items-center gap-4 w-full h-16 px-4 border-b bg-background">
      {/* Mobile Menu Toggle */}
      <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant={"outline"} size={"icon"}>
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <DashboardMobileSidebar
            userInfo={userInfo}
            dashboardHome={dashboardHome}
            navItems={navItems}
          />
        </SheetContent>
      </Sheet>

      {/* Logo + Brand Name (using actual image) */}
      <div className="flex items-center gap-2 hidden sm:flex">
        {/* <img
          src="/long.png"
          alt="Niramoy Logo"
          className="h-8 w-auto object-contain"
        /> */}
        <Image
          src="/logo.png"
          alt="Niramoy Logo"
          width={32}
          height={32}
          className="h-8 w-auto object-contain"
        />
        <span className="text-sm font-semibold text-foreground">Niramoy</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Side: User Dropdown with avatar support */}
      <div className="flex items-center gap-2">
        <UserDropdown userInfo={userInfo} />
      </div>
    </div>
  );
};

export default DashboardNavbarContent;
