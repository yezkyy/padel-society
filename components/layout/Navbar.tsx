"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Lapangan", href: "/lapangan" },
  { label: "Membership", href: "/membership" },
  { label: "Event", href: "/event" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();

  const userRole = session?.user ? (session.user as any).role : null;
  const isStaff = userRole === "ADMIN" || userRole === "OPERATOR";

  const ctaHref = session
    ? (isStaff ? "/admin/dashboard" : "/member/dashboard")
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

        {/* Profile Dropdown / CTA Button */}
        <div className="hidden md:block relative">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#ccff00]/10 border-2 border-[#ccff00] flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-zinc-950 dark:text-zinc-50 text-xs font-bold font-sans">
                      {session.user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2.5 w-64 bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/5 rounded-2xl shadow-xl py-2 z-50 overflow-hidden font-sans text-left"
                    >
                      <div className="px-4 py-3 border-b border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/30">
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Masuk Sebagai</p>
                        <p className="text-sm font-bold text-zinc-950 dark:text-zinc-50 truncate">{session.user.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{session.user.email}</p>
                      </div>

                      <div className="p-1 space-y-0.5">
                        <Link
                          href={ctaHref}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-[#ccff00]/10 hover:text-black dark:hover:text-[#ccff00] transition-colors"
                        >
                          Dashboard
                        </Link>
                        
                        {!isStaff && (
                          <>
                            <Link
                              href="/member/bookings"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-[#ccff00]/10 hover:text-black dark:hover:text-[#ccff00] transition-colors"
                            >
                              Booking Saya
                            </Link>
                            <Link
                              href="/member/profile"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-[#ccff00]/10 hover:text-black dark:hover:text-[#ccff00] transition-colors"
                            >
                              Profil Saya
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="border-t border-black/5 dark:border-white/5 p-1 mt-1">
                        <button
                          onClick={async () => {
                            setIsProfileOpen(false);
                            await signOut();
                            router.refresh();
                            router.push("/");
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        >
                          Keluar Akun
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button
              asChild
              className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full transition-all duration-300 px-6 py-2.5 h-auto text-xs shadow-md shadow-[#ccff00]/10 hover:shadow-lg hover:shadow-[#ccff00]/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Link href="/login">Masuk</Link>
            </Button>
          )}
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
            {session ? (
              <div className="border-t border-black/5 dark:border-white/5 pt-4 mt-2 space-y-4">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-[#ccff00]/10 border border-[#ccff00] overflow-hidden flex items-center justify-center shrink-0">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-zinc-950 dark:text-zinc-50 text-sm font-bold font-sans">
                        {session.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="font-sans text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                      {session.user.name}
                    </p>
                    <p className="font-sans text-xs text-zinc-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 px-2">
                  <Link
                    href={ctaHref}
                    onClick={() => setIsOpen(false)}
                    className="font-sans text-sm font-semibold py-2.5 px-4 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-left animate-fade-in"
                  >
                    Dashboard
                  </Link>
                  {!isStaff && (
                    <>
                      <Link
                        href="/member/bookings"
                        onClick={() => setIsOpen(false)}
                        className="font-sans text-sm font-semibold py-2.5 px-4 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-left"
                      >
                        Booking Saya
                      </Link>
                      <Link
                        href="/member/profile"
                        onClick={() => setIsOpen(false)}
                        className="font-sans text-sm font-semibold py-2.5 px-4 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-left"
                      >
                        Profil Saya
                      </Link>
                    </>
                  )}
                  <button
                    onClick={async () => {
                      setIsOpen(false);
                      await signOut();
                      router.refresh();
                      router.push("/");
                    }}
                    className="font-sans text-sm font-semibold py-2.5 px-4 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left"
                  >
                    Keluar Akun
                  </button>
                </div>
              </div>
            ) : (
              <Button
                asChild
                className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full w-full py-3 h-auto text-center mt-2 shadow-lg shadow-[#ccff00]/15"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/login">Masuk</Link>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
