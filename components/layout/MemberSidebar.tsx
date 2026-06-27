"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarRange, Award, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

// ... (skipping navItems to menuItems definition)

const menuItems = [
  { label: "Dashboard", href: "/member/dashboard", icon: LayoutDashboard },
  { label: "Booking Saya", href: "/member/bookings", icon: CalendarRange },
  { label: "Membership", href: "/member/membership", icon: Award },
  { label: "Profil", href: "/member/profile", icon: User },
  { label: "Pengaturan", href: "/member/settings", icon: Settings },
];

export function MemberSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-r border-black/5 dark:border-white/5 flex flex-col h-full shrink-0">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/logo.png"
            alt="Padel Society Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-heading text-lg font-bold text-[#1a1b22] dark:text-[#fbf8ff] tracking-tight">
            Padel Society
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl font-sans text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-[#ccff00]/10 text-[#506600] dark:text-[#ccff00]"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#506600] dark:bg-[#ccff00] rounded-r-full" />
              )}
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-black/5 dark:border-white/5 mt-auto">
        <button
          onClick={async () => {
            try {
              await signOut();
              window.location.href = "/login";
            } catch (e) {
              console.error("Gagal melakukan sign out:", e);
            }
          }}
          className="flex items-center gap-4 text-rose-600 dark:text-rose-400 font-sans text-sm font-semibold hover:opacity-80 transition-opacity w-full text-left"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
