"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function MemberSettingsPage() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      emailNotification: true,
      whatsappNotification: true,
    },
  });

  const onSubmit = () => {
    toast.success("Pengaturan notifikasi berhasil diperbarui!");
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
          Pengaturan Akun
        </h2>
        <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
          Ubah pengaturan notifikasi dan preferensi Anda.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50">
              Preferensi Notifikasi
            </h3>

            <div className="space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-bold text-zinc-800 dark:text-zinc-200">
                    Notifikasi Email
                  </Label>
                  <p className="text-zinc-400 mt-0.5">
                    Kirim invoice dan ringkasan konfirmasi booking ke email Anda.
                  </p>
                </div>
                <input
                  type="checkbox"
                  {...register("emailNotification")}
                  className="rounded border-zinc-300 text-[#506600] focus:ring-[#ccff00] h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <div>
                  <Label className="font-bold text-zinc-800 dark:text-zinc-200">
                    Notifikasi WhatsApp
                  </Label>
                  <p className="text-zinc-400 mt-0.5">
                    Kirim pengingat jadwal H-1 dan H-2 jam lewat pesan WhatsApp.
                  </p>
                </div>
                <input
                  type="checkbox"
                  {...register("whatsappNotification")}
                  className="rounded border-zinc-300 text-[#506600] focus:ring-[#ccff00] h-4 w-4"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full px-8 py-3.5 h-auto text-sm transition-transform hover:-translate-y-0.5"
          >
            Simpan Pengaturan
          </Button>
        </form>
      </div>
    </div>
  );
}
