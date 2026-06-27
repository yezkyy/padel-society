"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Activity,
  Award,
  Zap,
  ShoppingBag,
  ArrowRight,
  QrCode,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MemberDashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Budi Pangestu";

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
            Halo, {userName}!
          </h2>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
            Siap untuk pertandingan hari ini?
          </p>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop')",
            }}
          ></div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Booking & Recent Activity */}
        <div className="xl:col-span-2 space-y-8">
          <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800 relative overflow-hidden group">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ccff00]/25 text-black dark:text-[#ccff00] font-sans text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#506600] dark:bg-[#ccff00] animate-pulse"></span>
                  Pertandingan Mendatang
                </span>
                <h3 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Padel Indoor - Court 2
                </h3>
                <p className="font-sans text-xs text-zinc-400 dark:text-zinc-500">
                  Senayan Padel Club, Jakarta
                </p>
              </div>
              <div className="text-right">
                <div className="font-heading text-2xl font-bold text-[#506600] dark:text-[#ccff00]">
                  19:00
                </div>
                <div className="font-sans text-xs text-zinc-400 dark:text-zinc-500">
                  Hari Ini, 24 Okt
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                  B
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                  A
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                  D
                </div>
              </div>
              <span className="font-sans text-[10px] text-zinc-400">
                +1 Pemain Belum Konfirmasi
              </span>
            </div>

            <div className="flex gap-4 relative z-10 mt-auto">
              <Button
                onClick={() => toast.success("Menampilkan QR Code Akses Lapangan")}
                className="flex-1 bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full py-3 h-auto text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/10"
              >
                <QrCode className="w-4 h-4" />
                Tampilkan QR Akses
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 rounded-full px-6 text-xs h-10"
              >
                <Link href="/member/bookings">Detail</Link>
              </Button>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="space-y-4">
            <h3 className="font-heading text-lg font-bold text-zinc-950 dark:text-zinc-50">
              Aktivitas Terakhir
            </h3>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-bold text-zinc-900 dark:text-zinc-50">
                      Outdoor Padel - Court 1
                    </p>
                    <p className="font-sans text-[10px] text-zinc-400">20 Okt • Selesai</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-zinc-900 dark:text-zinc-50">+120 Poin</p>
                  <p className="text-zinc-400">Menang</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-bold text-zinc-900 dark:text-zinc-50">
                      Sesi Latihan Grup
                    </p>
                    <p className="font-sans text-[10px] text-zinc-400">18 Okt • Selesai</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-zinc-900 dark:text-zinc-50">+50 Poin</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Membership Status & Mini Stats */}
        <div className="space-y-8 flex flex-col justify-between">
          {/* Membership Card */}
          <section className="bg-zinc-950 dark:bg-zinc-900 border border-zinc-900 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#ccff00]/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-[#ccff00]" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#ccff00]">
                Status Membership
              </span>
            </div>
            <h4 className="font-heading text-3xl font-bold tracking-tight">Elite Pro</h4>
            <p className="font-sans text-xs text-zinc-400 mt-1 mb-8">Aktif hingga 24 Des 2024</p>
            <Button className="w-full bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full py-3 h-auto text-xs">
              Perpanjang Sekarang
            </Button>
          </section>

          {/* Stats Mini Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
              <Trophy className="w-5 h-5 text-[#506600] dark:text-[#ccff00] mb-3" />
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-1">
                Total Main
              </p>
              <h5 className="font-heading text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-none">
                24
              </h5>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
              <Zap className="w-5 h-5 text-[#506600] dark:text-[#ccff00] mb-3" />
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-1">
                Poin
              </p>
              <h5 className="font-heading text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-none">
                1,250
              </h5>
            </div>
          </div>

          {/* Promo Mini Card */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h5 className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Diskon 20% Pro Shop
            </h5>
            <p className="font-sans text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              Tukarkan poin loyalitas Anda untuk raket padel seri terbaru di Pro Shop terdekat.
            </p>
            <a
              href="#"
              className="text-xs font-bold text-[#506600] dark:text-[#ccff00] flex items-center gap-1 hover:underline"
            >
              Tukar Poin <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
