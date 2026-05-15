"use client";

import Link from "next/link";
import { ShoppingCart, LogOut, LayoutDashboard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserRole, getDefaultDashboardRoute } from "@/lib/authUtils";
import { IUserResponse } from "@/types/user.types";
import { logoutUser } from "@/services/auth.services";
import { useRouter } from "next/navigation";

interface PublicNavbarContentProps {
  userInfo: IUserResponse | null;
  cartCount: number;
}

const PublicNavbarContent = ({
  userInfo,
  cartCount,
}: PublicNavbarContentProps) => {
  const router = useRouter();
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/medicine", label: "Medicine" },
  ];

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  const isAuthenticated = Boolean(userInfo);
  const showCart = userInfo?.role === UserRole.CUSTOMER;
  const dashboardLink = userInfo
    ? getDefaultDashboardRoute(userInfo.role)
    : "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#0b4f5b]/15 bg-white/90 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Niramoy Logo"
              className="h-14 w-14 rounded-full border border-[#0b4f5b]/20 bg-white"
            />
            <span className="text-lg font-semibold tracking-wide text-[#0b4f5b]">
              Niramoy
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            {navItems.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[#0b4f5b]/80 transition-colors hover:text-[#0b4f5b]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <Button
                asChild
                variant="outline"
                className="border-[#0b4f5b]/20 text-[#0b4f5b]"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-[#0b4f5b] hover:bg-[#083f49]">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}

          {isAuthenticated && (
            <>
              {showCart && (
                <Link href="/dashboard/cart" className="relative">
                  <Button variant="outline" size="icon" aria-label="Cart">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  {cartCount > 0 && (
                    <Badge className="absolute -right-2 -top-2 h-5 min-w-5 justify-center rounded-full px-1 text-[10px]">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              )}

              {userInfo && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      {userInfo.image ? (
                        <img
                          src={userInfo.image}
                          alt={userInfo.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold">
                          {userInfo.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{userInfo.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {userInfo.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href={dashboardLink} className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button
                type="button"
                variant="outline"
                className="hidden sm:block"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-4">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav className="mt-8 flex flex-col space-y-4">
                  {navItems.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-8 space-y-4">
                  {!isAuthenticated && (
                    <>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/register">Register</Link>
                      </Button>
                    </>
                  )}

                  {isAuthenticated && userInfo && (
                    <div className="space-y-3 rounded-lg border p-4">
                      <div>
                        <p className="text-sm font-semibold">{userInfo.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {userInfo.email}
                        </p>
                      </div>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={dashboardLink}>Dashboard</Link>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  )}

                  {showCart && (
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/cart">
                        Cart{cartCount > 0 ? ` (${cartCount})` : ""}
                      </Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbarContent;
