"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MemberMembershipPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
          Status Membership
        </h2>
        <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
          Lihat benefit aktif Anda atau perbarui masa keanggotaan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-zinc-950 text-white rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden shadow-xl">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-2">
            <span className="text-[10px] text-[#ccff00] uppercase font-bold tracking-widest block">
              Paket Aktif
            </span>
            <h3 className="font-heading text-4xl font-bold">Elite Pro</h3>
            <p className="text-zinc-400 text-xs mt-1">Berlaku sampai dengan 24 Desember 2024</p>
          </div>

          <div className="border-t border-zinc-900 pt-6 space-y-4">
            <h4 className="text-[#ccff00] text-xs font-bold uppercase tracking-wider">
              Benefit Utama Anda:
            </h4>
            <ul className="space-y-3 font-sans text-xs text-zinc-300">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#ccff00]" />
                <span>Diskon booking 20% otomatis di checkout</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#ccff00]" />
                <span>Membuka slot booking hingga H-7 lebih cepat</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#ccff00]" />
                <span>Undangan event & turnamen eksklusif</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Perpanjang Paket
            </h4>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed">
              Dapatkan perpanjangan 30 hari otomatis dengan metode pembayaran instan.
            </p>
          </div>
          <Button
            onClick={() => toast.success("Mengarahkan ke pembayaran perpanjangan...")}
            className="w-full bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-xl py-3.5 h-auto text-xs mt-6"
          >
            Perpanjang Rp 500.000
          </Button>
        </div>
      </div>
    </div>
  );
}
