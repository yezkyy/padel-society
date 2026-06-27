"use client";

import { useSession } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const profileSchema = zod.object({
  name: zod.string().min(2, { message: "Nama minimal 2 karakter" }),
  email: zod.string().email({ message: "Email tidak valid" }),
  phone: zod.string().min(10, { message: "Nomor telepon minimal 10 digit" }),
});

type ProfileInput = zod.infer<typeof profileSchema>;

export default function MemberProfilePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "Budi Pangestu",
      email: session?.user?.email || "member@padelsociety.com",
      phone: (session?.user as any)?.phone || "081234567890",
    },
  });

  const onSubmit = async (data: ProfileInput) => {
    setIsLoading(true);
    try {
      // Simulate profile updating
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profil Anda berhasil diperbarui!");
    } catch (e) {
      toast.error("Gagal memperbarui profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
          Profil Saya
        </h2>
        <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
          Ubah informasi kontak personal Anda di sini.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              type="text"
              disabled={isLoading}
              {...register("name")}
              className={errors.name ? "border-rose-500" : ""}
            />
            {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled={isLoading}
              {...register("email")}
              className={errors.email ? "border-rose-500" : ""}
            />
            {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              type="tel"
              disabled={isLoading}
              {...register("phone")}
              className={errors.phone ? "border-rose-500" : ""}
            />
            {errors.phone && <p className="text-xs text-rose-500">{errors.phone.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full px-8 py-3.5 h-auto text-sm transition-transform hover:-translate-y-0.5"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Simpan Perubahan"}
          </Button>
        </form>
      </div>
    </div>
  );
}
