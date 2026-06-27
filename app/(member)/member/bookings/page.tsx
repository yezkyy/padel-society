"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MemberBookingsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  const mockActiveBookings = [
    {
      id: "bk-12345",
      courtName: "Court 1 (Indoor)",
      date: "24 Okt 2024",
      time: "19:00 - 20:30",
      price: 300000,
      status: "CONFIRMED",
    },
  ];

  const mockHistoryBookings = [
    {
      id: "bk-09876",
      courtName: "Court 3 (Outdoor)",
      date: "20 Okt 2024",
      time: "16:30 - 18:00",
      price: 225000,
      status: "COMPLETED",
    },
    {
      id: "bk-05432",
      courtName: "Court 2 (Indoor)",
      date: "15 Okt 2024",
      time: "10:00 - 11:30",
      price: 300000,
      status: "CANCELLED",
    },
  ];

  const bookings = activeTab === "active" ? mockActiveBookings : mockHistoryBookings;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
          Booking Saya
        </h2>
        <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
          Kelola booking aktif Anda atau lihat riwayat pertandingan masa lalu.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-px">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-4 px-2 text-sm font-semibold relative ${
            activeTab === "active"
              ? "text-[#506600] dark:text-[#ccff00]"
              : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Booking Aktif
          {activeTab === "active" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#506600] dark:bg-[#ccff00]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-4 px-2 text-sm font-semibold relative ${
            activeTab === "history"
              ? "text-[#506600] dark:text-[#ccff00]"
              : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Riwayat Booking
          {activeTab === "history" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#506600] dark:bg-[#ccff00]" />
          )}
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {booking.courtName}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                      booking.status === "CONFIRMED" || booking.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400 font-sans">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-zinc-400" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span>Senayan Padel Club</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-end gap-4 w-full md:w-auto border-t border-zinc-100 dark:border-zinc-800 pt-4 md:pt-0 md:border-none justify-between md:justify-start">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold block">
                    Total Bayar
                  </span>
                  <span className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Rp {booking.price.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => toast.success("Invoice PDF sedang diunduh...")}
                    variant="outline"
                    size="sm"
                    className="border-zinc-200 dark:border-zinc-800 rounded-full px-4 h-9"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  {booking.status === "CONFIRMED" && (
                    <Button
                      onClick={() => toast.success("Menampilkan kode akses pintu lapangan")}
                      size="sm"
                      className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full px-4 h-9"
                    >
                      Akses QR
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl space-y-4">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Belum ada data booking di kategori ini.
            </p>
            <Button
              asChild
              className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full"
            >
              <Link href="/booking">Booking Lapangan Sekarang</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
