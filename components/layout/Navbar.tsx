"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Lapangan", href: "/lapangan" },
  { label: "Membership", href: "/membership" },
  { label: "Event", href: "/event" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const ctaHref = session
    ? (session.user.role === "ADMIN" || session.user.role === "OPERATOR" ? "/admin/dashboard" : "/member/dashboard")
    : "/login";

  const ctaLabel = session ? "Dashboard" : "Masuk";

  return (
    <>
      <motion.nav 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-between items-center px-6 py-3 w-[90%] mx-auto bg-white/60 dark:bg-zinc-950/60 backdrop-blur-2xl border border-black/[0.05] dark:border-white/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-full max-w-[1280px]"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/images/logo.png"
            alt="Padel Society Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <span className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight group-hover:text-zinc-950 dark:group-hover:text-[#ccff00] transition-colors">
            Padel Society
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-sans text-xs uppercase tracking-wider font-semibold transition-all px-4 py-2.5 rounded-full relative hover:text-zinc-950 dark:hover:text-zinc-50 group",
                  isActive
                    ? "text-[#506600] dark:text-[#ccff00]"
                    : "text-zinc-500 dark:text-zinc-400"
                )}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-[#ccff00]/15 dark:bg-[#ccff00]/10 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Hover Underline Expand Effect */}
                <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-black/40 dark:bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full z-20" />
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button
            asChild
            className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full transition-all duration-300 px-6 py-2.5 h-auto text-xs shadow-md shadow-[#ccff00]/10 hover:shadow-lg hover:shadow-[#ccff00]/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-zinc-950 dark:text-zinc-50 p-2 focus:outline-none transition-transform hover:scale-105 active:scale-95"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="md:hidden fixed top-24 left-4 right-4 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.06] rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "font-sans text-sm font-semibold py-2 px-4 rounded-xl transition-all",
                    isActive
                      ? "bg-[#ccff00]/10 text-[#506600] dark:text-[#ccff00]"
                      : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button
              asChild
              className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full w-full py-3 h-auto text-center mt-2 shadow-lg shadow-[#ccff00]/15"
              onClick={() => setIsOpen(false)}
            >
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
