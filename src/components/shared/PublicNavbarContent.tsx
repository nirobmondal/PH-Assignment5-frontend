"use client";

import Link from "next/link";
import {
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  Menu,
  User,
} from "lucide-react";
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
import Image from "next/image";

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
    <header className="sticky top-0 z-50 w-full border-b border-[#0b4f5b]/10 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm transition-all duration-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.png"
              alt="Niramoy logo"
              width={32}
              height={32}
              className="h-8 w-8 md:h-9 md:w-9"
              priority
            />
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Niramoy
            </span>
          </Link>

          <nav className="hidden items-center gap-5 md:flex lg:gap-7">
            {navItems.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-700 transition-all hover:text-[#0b4f5b] hover:underline underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Unauthenticated Buttons */}
          {!isAuthenticated && (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden text-gray-700 hover:text-[#0b4f5b] sm:inline-flex"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm transition-all hover:shadow-md"
              >
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}

          {/* Authenticated Actions */}
          {isAuthenticated && (
            <>
              {/* Cart Icon for Customers – visible on all screens */}
              {showCart && (
                <Link
                  href="/dashboard/cart"
                  className="relative transition-transform hover:scale-105"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-700 hover:text-[#0b4f5b]"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                  {cartCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-[10px] font-bold text-white ring-2 ring-white">
                      {cartCount > 9 ? "9+" : cartCount}
                    </Badge>
                  )}
                </Link>
              )}

              {/* User Dropdown Menu (Desktop only) – hidden on mobile */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full border border-gray-200 bg-gray-50 p-0 hover:bg-gray-100 focus:ring-2 focus:ring-[#0b4f5b]/20"
                    >
                      {userInfo?.image ? (
                        <img
                          src={userInfo.image}
                          alt={userInfo.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-700">
                          {userInfo?.name?.charAt(0).toUpperCase() || (
                            <User className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-64 rounded-xl border-gray-100 p-1 shadow-lg"
                  >
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {userInfo?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {userInfo?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Link
                        href={dashboardLink}
                        className="flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Logout Button – visible on tablet+ (≥640px), hidden on mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden text-red-600 hover:bg-red-50 sm:inline-flex"
              >
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </Button>
            </>
          )}

          {/* Mobile Menu Button – only visible on mobile (<768px) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] max-w-sm p-0 sm:p-4"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex h-full flex-col">
                  {/* Mobile Header inside sheet */}
                  <div className="border-b border-gray-100 p-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/logo.png"
                        alt="logo"
                        width={28}
                        height={28}
                        className="h-7 w-7"
                      />
                      <span className="text-lg font-bold">Niramoy</span>
                    </div>
                  </div>

                  {/* Nav Links */}
                  <nav className="flex-1 space-y-1 p-4">
                    {navItems.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#0b4f5b]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Bottom Actions – shows user info, cart (if customer), dashboard, logout */}
                  <div className="border-t border-gray-100 p-4">
                    {!isAuthenticated && (
                      <div className="space-y-2">
                        <Button
                          asChild
                          variant="outline"
                          className="w-full justify-start border-gray-200"
                        >
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full justify-start bg-[#0b4f5b] hover:bg-[#083f49]"
                        >
                          <Link href="/register">Register</Link>
                        </Button>
                      </div>
                    )}

                    {isAuthenticated && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                          {userInfo?.image ? (
                            <img
                              src={userInfo.image}
                              alt={userInfo.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b4f5b]/10 text-[#0b4f5b]">
                              <User className="h-5 w-5" />
                            </div>
                          )}
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">
                              {userInfo?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {userInfo?.email}
                            </p>
                          </div>
                        </div>

                        {showCart && (
                          <Button
                            asChild
                            variant="outline"
                            className="w-full justify-start gap-2 border-gray-200"
                          >
                            <Link href="/dashboard/cart">
                              <ShoppingCart className="h-4 w-4" />
                              Cart {cartCount > 0 && `(${cartCount})`}
                            </Link>
                          </Button>
                        )}

                        <Button
                          asChild
                          variant="outline"
                          className="w-full justify-start gap-2"
                        >
                          <Link href={dashboardLink}>
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        </Button>

                        <Button
                          onClick={handleLogout}
                          variant="ghost"
                          className="w-full justify-start gap-2 text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    )}
                  </div>
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
