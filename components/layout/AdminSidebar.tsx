"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, KeyRound, LineChart, Users2, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const adminMenuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Court Management", href: "/admin/courts", icon: KeyRound },
  { label: "Analytics", href: "/admin/analytics", icon: LineChart },
  { label: "Customers", href: "/admin/customers", icon: Users2 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-r border-black/5 dark:border-white/5 flex flex-col h-full shrink-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Padel Society Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="font-heading text-base font-bold text-black dark:text-white leading-none tracking-tight">
              Padel Society
            </h1>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-semibold font-sans">
              Admin Console
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#ccff00] text-black font-semibold shadow-md shadow-[#ccff00]/10"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white"
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-black/5 dark:border-white/5 mt-auto">
        <Button
          asChild
          className="w-full bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-xl py-5 h-auto transition-colors flex items-center justify-center gap-2"
        >
          <Link href="/admin/bookings/new">
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </Link>
        </Button>
      </div>
    </aside>
  );
}
