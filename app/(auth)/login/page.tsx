"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Schema definitions
const loginSchema = zod.object({
  email: zod.string().email({ message: "Email tidak valid" }),
  password: zod.string().min(6, { message: "Password minimal 6 karakter" }),
});

const registerSchema = zod.object({
  name: zod.string().min(2, { message: "Nama minimal 2 karakter" }),
  email: zod.string().email({ message: "Email tidak valid" }),
  phone: zod.string().min(10, { message: "Nomor telepon minimal 10 digit" }),
  password: zod.string().min(6, { message: "Password minimal 6 karakter" }),
});

type LoginInput = zod.infer<typeof loginSchema>;
type RegisterInput = zod.infer<typeof registerSchema>;

// Framer motion variants
const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
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

function LoginForm({ callbackUrl, onSwitchMode }: { callbackUrl: string; onSwitchMode: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: callbackUrl,
      });

      if (response?.error) {
        toast.error(response.error.message || "Gagal masuk. Periksa email & password Anda.");
      } else {
        toast.success("Berhasil masuk!");
        router.refresh();
        router.push(callbackUrl);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form 
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-4 text-left"
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

      <motion.div variants={itemVariants} className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label 
            htmlFor="password" 
            className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-[#506600] dark:hover:text-[#ccff00] transition-colors font-medium"
          >
            Lupa Password?
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
            <Lock className="w-4 h-4" />
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("password")}
            className={cn(
              "pl-10 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 transition-all focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/10",
              errors.password ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""
            )}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-rose-500 font-medium mt-1">{errors.password.message}</p>
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
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center text-sm text-zinc-500 dark:text-zinc-400 font-sans mt-4">
        Belum punya akun?{" "}
        <button
          type="button"
          onClick={onSwitchMode}
          className="font-semibold text-[#506600] dark:text-[#ccff00] hover:underline cursor-pointer bg-transparent border-none p-0 inline"
        >
          Daftar Sekarang
        </button>
      </motion.div>
    </motion.form>
  );
}

function RegisterForm({ onSwitchMode }: { onSwitchMode: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        callbackURL: "/member/dashboard",
      } as any);

      if (response?.error) {
        toast.error(response.error.message || "Gagal melakukan registrasi.");
      } else {
        toast.success("Registrasi berhasil!");
        router.push("/member/dashboard");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form 
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-4 text-left"
    >
      <motion.div variants={itemVariants} className="space-y-1.5">
        <Label 
          htmlFor="name" 
          className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          Nama Lengkap
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
            <User className="w-4 h-4" />
          </div>
          <Input
            id="name"
            type="text"
            placeholder="Budi Pangestu"
            disabled={isLoading}
            {...register("name")}
            className={cn(
              "pl-10 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 transition-all focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/10",
              errors.name ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""
            )}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-rose-500 font-medium mt-1">{errors.name.message}</p>
        )}
      </motion.div>

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

      <motion.div variants={itemVariants} className="space-y-1.5">
        <Label 
          htmlFor="phone" 
          className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          Nomor Telepon
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
            <Phone className="w-4 h-4" />
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="081234567890"
            disabled={isLoading}
            {...register("phone")}
            className={cn(
              "pl-10 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 transition-all focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/10",
              errors.phone ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""
            )}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-rose-500 font-medium mt-1">{errors.phone.message}</p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-1.5">
        <Label 
          htmlFor="password" 
          className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          Password
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
            <Lock className="w-4 h-4" />
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("password")}
            className={cn(
              "pl-10 h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 transition-all focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/10",
              errors.password ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10" : ""
            )}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-rose-500 font-medium mt-1">{errors.password.message}</p>
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
              <span>Daftar Akun</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center text-sm text-zinc-500 dark:text-zinc-400 font-sans mt-4">
        Sudah punya akun?{" "}
        <button
          type="button"
          onClick={onSwitchMode}
          className="font-semibold text-[#506600] dark:text-[#ccff00] hover:underline cursor-pointer bg-transparent border-none p-0 inline"
        >
          Masuk
        </button>
      </motion.div>
    </motion.form>
  );
}

function AuthTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Sync mode with state if search params change
  useEffect(() => {
    const currentMode = searchParams.get("mode") === "register" ? "register" : "login";
    setMode(currentMode);
  }, [searchParams]);

  const handleModeChange = (newMode: "login" | "register") => {
    setMode(newMode);
    const params = new URLSearchParams(window.location.search);
    if (newMode === "register") {
      params.set("mode", "register");
    } else {
      params.delete("mode");
    }
    router.replace(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Back to Home Button */}
      <div className="text-left">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors uppercase tracking-wider font-sans group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 transition-all duration-300">
          {mode === "login" ? "Selamat Datang Kembali" : "Daftar Akun"}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans transition-all duration-300">
          {mode === "login" 
            ? "Masuk ke akun Anda untuk melanjutkan aktivitas padel Anda" 
            : "Buat akun baru untuk mulai bermain padel bersama kami"}
        </p>
      </div>

      {/* Pill Toggle Switch */}
      <div className="relative w-full max-w-[280px] mx-auto bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 p-1 rounded-full flex items-center justify-between shadow-inner">
        {/* Active background slider */}
        <motion.div
          layout
          className="absolute top-1 bottom-1 left-1 bg-[#ccff00] rounded-full shadow-sm"
          animate={{
            x: mode === "login" ? 0 : "100%",
            width: "calc(50% - 4px)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        />

        <button
          onClick={() => handleModeChange("login")}
          className={cn(
            "relative z-10 w-1/2 text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors duration-300",
            mode === "login" 
              ? "text-black" 
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50"
          )}
        >
          Masuk
        </button>
        <button
          onClick={() => handleModeChange("register")}
          className={cn(
            "relative z-10 w-1/2 text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors duration-300",
            mode === "register" 
              ? "text-black" 
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50"
          )}
        >
          Daftar
        </button>
      </div>

      {/* Form Content */}
      <div className="relative pt-2">
        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <LoginForm callbackUrl={callbackUrl} onSwitchMode={() => handleModeChange("register")} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <RegisterForm onSwitchMode={() => handleModeChange("login")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-4"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#506600] dark:text-[#ccff00]" /></div>}>
      <AuthTabs />
    </Suspense>
  );
}
