"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#fbf8ff] dark:bg-zinc-950">
      
      {/* Left side: Hero visual (shown only on lg and above) */}
      <div className="hidden lg:flex lg:w-[45%] bg-zinc-950 relative overflow-hidden flex-col justify-between p-12 text-white border-r border-white/5">
        
        {/* Glow & Spotlight effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ccff00]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[150px] pointer-events-none" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group relative z-10">
          <Image
            src="/images/logo.png"
            alt="Padel Society Logo"
            width={36}
            height={36}
            className="w-9 h-9 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <span className="font-heading text-lg font-bold text-white tracking-tight">
            Padel Society
          </span>
        </Link>

        {/* Dynamic Interactive Visuals */}
        <div className="relative flex-1 flex flex-col justify-center items-center py-10 z-10">
          {/* Main floating racket */}
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-72 h-72 md:w-80 md:h-80 relative drop-shadow-[0_25px_40px_rgba(204,255,0,0.15)] filter"
          >
            <Image
              src="/images/hero/padel-racket-3d.png"
              alt="Padel Racket 3D"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Floating padel ball 1 */}
          <motion.div
            animate={{ y: [0, 12, 0], rotate: 360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-12 h-12 drop-shadow-[0_8px_16px_rgba(204,255,0,0.2)]"
          >
            <Image
              src="/images/hero/ball-1.png"
              alt="Padel Ball"
              width={48}
              height={48}
              className="object-contain"
            />
          </motion.div>

          {/* Floating padel ball 2 */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: -360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-10 h-10 drop-shadow-[0_8px_16px_rgba(204,255,0,0.2)]"
          >
            <Image
              src="/images/hero/ball-2.png"
              alt="Padel Ball"
              width={40}
              height={40}
              className="object-contain"
            />
          </motion.div>
        </div>

        {/* Tagline and benefits */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
              <Sparkles className="w-3 h-3" /> Komunitas Padel #1
            </span>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-white leading-tight">
              Kuasai Lapangan, Temukan Society-mu!
            </h2>
          </div>

          <div className="space-y-3.5">
            {[
              "Booking lapangan instan dalam hitungan detik",
              "Gabung turnamen seru dan temukan lawan tanding",
              "Dapatkan keuntungan membership eksklusif"
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-[#ccff00]" />
                </div>
                <p className="text-zinc-400 text-sm font-sans">{text}</p>
              </div>
            ))}
          </div>

          <p className="text-zinc-500 text-xs pt-4 border-t border-white/5 font-sans">
            &copy; {new Date().getFullYear()} Padel Society. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side: Auth Form Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 xl:px-24 bg-[#fbf8ff] dark:bg-zinc-950 relative overflow-hidden">
        
        {/* Glow & Spotlight effects for mobile/tablet background */}
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-[#ccff00]/5 dark:bg-[#ccff00]/3 rounded-full blur-[100px] pointer-events-none lg:hidden" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-zinc-200/40 dark:bg-zinc-900/10 rounded-full blur-[100px] pointer-events-none lg:hidden" />

        {/* Small Logo for mobile view */}
        <div className="lg:hidden flex flex-col items-center mb-8 z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/logo.png"
              alt="Padel Society Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
            <span className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Padel Society
            </span>
          </Link>
        </div>

        {/* Clean Container (No card background/border/shadow/padding) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px] z-10 px-4 md:px-0"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
