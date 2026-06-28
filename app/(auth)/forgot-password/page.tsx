"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = zod.object({
  email: zod.string().email({ message: "Email tidak valid" }),
});

type ForgotPasswordInput = zod.infer<typeof forgotPasswordSchema>;

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
};

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      // Simulate password reset request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setIsSent(true);
      toast.success("Link reset password telah dikirim ke email Anda!");
    } catch (error) {
      toast.error("Gagal mengirim email reset. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Lupa Password?
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans">
          Masukkan email Anda dan kami akan mengirimkan link untuk mengatur ulang password Anda
        </p>
      </div>

      {isSent ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 text-center"
        >
          <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-sm border border-emerald-100 dark:border-emerald-950/50 font-sans">
            Email instruksi pemulihan telah dikirim. Harap periksa folder kotak masuk dan spam Anda.
          </div>
          <Button
            asChild
            variant="ghost"
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-xl h-12 hover:bg-zinc-100 dark:hover:bg-zinc-900 w-full"
          >
            <Link href="/login" className="inline-flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Login</span>
            </Link>
          </Button>
        </motion.div>
      ) : (
        <motion.form 
          variants={formVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-5"
        >
          <motion.div variants={itemVariants} className="space-y-1.5">
            <Label 
              htmlFor="email" 
              className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
            >
              Email
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                disabled={isLoading}
                {...register("email")}
                className={cn(
                  "pl-10 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 transition-all focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/10",
                  errors.email ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""
                )}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.email.message}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2">
            <Button
              type="submit"
              className="w-full bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-xl h-12 text-sm shadow-md shadow-[#ccff00]/10 hover:shadow-lg hover:shadow-[#ccff00]/25 transition-all duration-300 flex items-center justify-center gap-2 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : (
                <>
                  <span>Kirim Link Reset</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Login</span>
            </Link>
          </motion.div>
        </motion.form>
      )}
    </div>
  );
}
