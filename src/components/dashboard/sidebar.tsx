"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Map,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Cerita Rakyat",
    icon: Map,
    href: "/explore",
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleSidebar = () => setCollapsed(!collapsed);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen flex flex-col border-r transition-all duration-300 ease-in-out",
        "bg-[#0D0A08] border-[#2E2318]",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-[#2E2318]">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-[#E8724A] tracking-wide">
              ADYATARA
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "h-8 w-8 text-[#9A8A7A] hover:text-[#F5F0EB] hover:bg-[#1A1410]",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Menu Items */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "text-sm font-medium group relative",
                active
                  ? "bg-[#E8724A]/10 text-[#E8724A] shadow-[0_0_12px_rgba(232,114,74,0.2)]"
                  : "text-[#9A8A7A] hover:bg-[#1A1410] hover:text-[#F5F0EB]",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1410] text-[#F5F0EB] text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-[#2E2318]">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="border-t border-[#2E2318] p-3 space-y-2">
        <Link
          href="/dashboard/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            "text-sm font-medium group relative",
            pathname.startsWith("/dashboard/profile")
              ? "bg-[#E8724A]/10 text-[#E8724A]"
              : "text-[#9A8A7A] hover:bg-[#1A1410] hover:text-[#F5F0EB]",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Profile" : undefined}
        >
          {session?.user?.avatarUrl || session?.user?.image ? (
            <img
              src={session.user.avatarUrl || session.user.image || ""}
              alt={session.user.name || "User"}
              className="h-5 w-5 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <User className="h-5 w-5 flex-shrink-0" />
          )}
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate">
                {session?.user?.name || "Profile"}
              </span>
              {session?.user?.email && (
                <span className="text-xs text-[#9A8A7A] truncate">
                  {session.user.email}
                </span>
              )}
            </div>
          )}

          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1410] text-[#F5F0EB] text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-[#2E2318]">
              Profile
            </div>
          )}
        </Link>

        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            "text-sm font-medium group relative",
            "text-[#9A8A7A] hover:bg-red-950/30 hover:text-red-400",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}

          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1410] text-[#F5F0EB] text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-[#2E2318]">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
