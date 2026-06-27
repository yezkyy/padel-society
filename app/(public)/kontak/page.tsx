"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";

const contactSchema = zod.object({
  name: zod.string().min(2, { message: "Nama minimal 2 karakter" }),
  email: zod.string().email({ message: "Email tidak valid" }),
  message: zod.string().min(10, { message: "Pesan minimal 10 karakter" }),
});

type ContactInput = zod.infer<typeof contactSchema>;

export default function KontakPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Pesan Anda telah berhasil terkirim!");
      reset();
    } catch (e) {
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-16">
      {/* Header */}
      <section className="space-y-4">
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-none">
          Hubungi Kami
        </h1>
        <p className="font-sans text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Punya pertanyaan tentang sewa lapangan, membership, atau event? Tim kami siap membantu Anda.
        </p>
      </section>

      {/* Grid Content */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2rem] p-8 shadow-sm space-y-8">
            <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Informasi Kontak
            </h3>

            <div className="space-y-6 font-sans text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Alamat</h4>
                  <p className="mt-1">Jl. Pintu Satu Senayan, Gelora, Tanah Abang, Jakarta Pusat, 10270</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Telepon / WhatsApp</h4>
                  <p className="mt-1">+62 812-3456-7890</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Email</h4>
                  <p className="mt-1">hello@padelsociety.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Jam Operasional</h4>
                  <p className="mt-1">Setiap Hari: 06:00 - 22:00 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2rem] p-8 shadow-xl">
            <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
              Kirim Pesan
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Budi Pangestu"
                  disabled={isLoading}
                  {...register("name")}
                  className={errors.name ? "border-rose-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  disabled={isLoading}
                  {...register("email")}
                  className={errors.email ? "border-rose-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-rose-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Pesan Anda</Label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                  disabled={isLoading}
                  {...register("message")}
                  className={`w-full rounded-2xl bg-transparent border border-zinc-200 dark:border-zinc-800 focus:border-[#ccff00] focus:ring-0 p-4 text-sm outline-none text-zinc-800 dark:text-zinc-200 disabled:opacity-50 ${
                    errors.message ? "border-rose-500" : ""
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-rose-500">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-xl py-3 h-auto text-sm transition-transform hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-black" />
                ) : (
                  "Kirim Pesan"
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
