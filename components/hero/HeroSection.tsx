"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Trophy, Users, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  // Motion values for tracking cursor position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end Apple/Stripe-like feedback
  const springConfig = { damping: 30, stiffness: 120, mass: 0.8 };

  // Parallax calculations for the main racket (max 10px)
  const rotateX = useSpring(useTransform(mouseY, [-400, 400], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-8, 8]), springConfig);
  const transformX = useSpring(useTransform(mouseX, [-400, 400], [-10, 10]), springConfig);
  const transformY = useSpring(useTransform(mouseY, [-400, 400], [-10, 10]), springConfig);

  // Parallax calculations for balls (max 15px)
  const ball1X = useSpring(useTransform(mouseX, [-400, 400], [-15, 15]), springConfig);
  const ball1Y = useSpring(useTransform(mouseY, [-400, 400], [-15, 15]), springConfig);

  const ball2X = useSpring(useTransform(mouseX, [-400, 400], [-12, 12]), springConfig);
  const ball2Y = useSpring(useTransform(mouseY, [-400, 400], [-12, 12]), springConfig);

  const ball3X = useSpring(useTransform(mouseX, [-400, 400], [-15, 15]), springConfig);
  const ball3Y = useSpring(useTransform(mouseY, [-400, 400], [-15, 15]), springConfig);

  // Parallax calculations for stats floating cards (slower, background depth)
  const card1X = useSpring(useTransform(mouseX, [-400, 400], [-6, 6]), springConfig);
  const card1Y = useSpring(useTransform(mouseY, [-400, 400], [-6, 6]), springConfig);

  const card2X = useSpring(useTransform(mouseX, [-400, 400], [-8, 8]), springConfig);
  const card2Y = useSpring(useTransform(mouseY, [-400, 400], [-8, 8]), springConfig);

  const card3X = useSpring(useTransform(mouseX, [-400, 400], [-5, 5]), springConfig);
  const card3Y = useSpring(useTransform(mouseY, [-400, 400], [-5, 5]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX - innerWidth / 2;
      const y = e.clientY - innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Headline words for reveal animation
  const headlineWords = "Revolusi Olahraga Padel di Indonesia".split(" ");



  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24 flex flex-col items-center justify-center min-h-[90vh] md:min-h-screen">
      
      {/* Inline styles for custom shimmer animation to optimize performance without mutating global files */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-sweep::before {
          content: '';
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25) 50%, transparent);
          transform: translateX(-100%);
          animation: shimmer-sweep 3s infinite ease-in-out;
        }
        .dark .animate-shimmer-sweep::before {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1) 50%, transparent);
        }
      `}} />

      {/* 1. Spotlight from top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-gradient-to-b from-[#ccff00]/12 via-[#ccff00]/2 to-transparent blur-[120px] rounded-b-full pointer-events-none -z-10" />

      {/* 2. Soft Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10" />

      {/* 3. Noise Overlay (Grain texture) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22><filter%20id=%22noiseFilter%22><feTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.85%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/></filter><rect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noiseFilter)%22/></svg>')] opacity-[0.012] dark:opacity-[0.02] pointer-events-none -z-10" />

      {/* 4. Gradient Mesh (Soft green & indigo spots) */}
      <div className="absolute top-[20%] left-[20%] w-[320px] h-[320px] bg-[#ccff00]/6 dark:bg-[#ccff00]/3 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-zinc-200/20 dark:bg-zinc-800/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 5. Decorative circular rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] border border-black/[0.02] dark:border-white/[0.01] rounded-full pointer-events-none -z-10 hidden md:block" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] border border-dashed border-black/[0.02] dark:border-white/[0.01] rounded-full pointer-events-none -z-10 hidden md:block animate-[spin_200s_linear_infinite]" />

      {/* 6. Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ y: [0, -12, 0], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[18%] w-1.5 h-1.5 rounded-full bg-[#ccff00]/40 blur-[0.5px]"
        />
        <motion.div 
          animate={{ y: [0, 18, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[55%] right-[25%] w-2.5 h-2.5 rounded-full bg-[#ccff00]/20 blur-[1px]"
        />
      </div>

      {/* 7. Floating Padel Balls (Decorative Assets with Parallax & GPU Acceleration) */}
      
      {/* Ball 1: Left-top of headline */}
      <motion.div
        style={{ x: ball1X, y: ball1Y, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[5%] md:left-[10%] top-[10%] md:top-[12%] w-[45px] h-[45px] md:w-[60px] md:h-[60px] opacity-70 pointer-events-none z-20 will-change-transform"
      >
        <Image
          src="/images/hero/ball-1.png"
          alt="Floating Padel Ball 1"
          fill
          className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
        />
      </motion.div>

      {/* Ball 2: Main Ball near the racket head */}
      <motion.div
        style={{ x: ball2X, y: ball2Y, transformStyle: "preserve-3d" }}
        animate={{ 
          y: [-10, 10, -10], 
          rotate: [0, -8, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[8%] md:right-[16%] top-[45%] md:top-[38%] w-[68px] h-[68px] md:w-[85px] md:h-[85px] pointer-events-none z-30 will-change-transform"
      >
        <div className="absolute inset-0 bg-[#ccff00]/15 dark:bg-[#ccff00]/10 rounded-full blur-[15px] pointer-events-none -z-10" />
        <Image
          src="/images/hero/ball-2.png"
          alt="Floating Padel Ball 2"
          fill
          className="object-contain drop-shadow-[0_15px_30px_rgba(204,255,0,0.25)]"
        />
      </motion.div>

      {/* Ball 3: Right-bottom (Hidden on mobile as requested) */}
      <motion.div
        style={{ x: ball3X, y: ball3Y, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -5, 0], x: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="hidden md:block absolute right-[6%] md:right-[8%] bottom-[20%] md:bottom-[22%] w-[38px] h-[38px] md:w-[48px] md:h-[48px] opacity-60 pointer-events-none z-20 will-change-transform"
      >
        <Image
          src="/images/hero/ball-3.png"
          alt="Floating Padel Ball 3"
          fill
          className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
        />
      </motion.div>

      {/* Main Content Container */}
      <div className="relative max-w-[1280px] mx-auto px-6 flex flex-col items-center text-center z-10 pt-8">
        
        {/* Branding text */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="font-heading text-[10px] tracking-[0.3em] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase select-none">
            PADEL SOCIETY
          </span>
        </motion.div>

        {/* Small premium badge with shimmer effect */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.05] text-[10px] sm:text-[11px] font-bold text-[#506600] dark:text-[#ccff00] tracking-wider uppercase select-none shadow-sm mb-8 relative overflow-hidden animate-shimmer-sweep"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-[pulse_1.5s_infinite]"></span>
          Platform Booking Padel Premium Indonesia
        </motion.div>

        {/* Headline with Line reveal animation */}
        <motion.h1
          className="font-heading text-4.5xl sm:text-6xl md:text-7xl lg:text-[5.6rem] font-black text-zinc-950 dark:text-zinc-50 leading-[1.05] tracking-tight max-w-4xl flex flex-col items-center select-none"
        >
          <span className="relative overflow-hidden block py-1">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="block"
            >
              Revolusi Olahraga
            </motion.span>
          </span>
          <span className="relative overflow-hidden block py-1 text-center">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
              className="block text-[#506600] dark:text-[#ccff00] drop-shadow-[0_4px_20px_rgba(204,255,0,0.25)]"
            >
              Padel di Indonesia
            </motion.span>
          </span>
        </motion.h1>

        {/* Centered Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.55 }}
          className="font-sans text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-[700px] leading-relaxed mt-6"
        >
          Booking lapangan modern dengan pengalaman digital terbaik. <br className="hidden sm:inline" />
          Nikmati fasilitas premium, komunitas eksklusif, dan sistem booking real-time.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto justify-center"
        >
          <Button
            asChild
            className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full px-8 py-4 h-auto text-sm shadow-lg shadow-[#ccff00]/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(204,255,0,0.45)] active:scale-[0.98]"
          >
            <Link href="/booking">Booking Sekarang</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50 font-semibold rounded-full px-8 py-4 h-auto text-sm hover:bg-white dark:hover:bg-white hover:border-[#ccff00] hover:text-black transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] bg-transparent"
          >
            <Link href="/lapangan">Lihat Lapangan</Link>
          </Button>
        </motion.div>

        {/* Visual Central Section (Racket + Glowing Backdrop + Floating Cards) */}
        <div className="relative w-full max-w-[750px] h-[450px] md:h-[600px] mt-8 flex items-center justify-center">
          
          {/* Breathing Glow behind Racket */}
          <motion.div
            animate={{ 
              scale: [0.93, 1.07, 0.93],
              opacity: [0.65, 0.85, 0.65]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-[280px] h-[280px] md:w-[460px] md:h-[460px] bg-[#ccff00]/12 dark:bg-[#ccff00]/8 rounded-full blur-[100px] md:blur-[130px] pointer-events-none"
          />

          {/* Racket Shadow underneath */}
          <motion.div
            animate={{ 
              scale: [0.9, 1.1, 0.9],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-6 w-[200px] md:w-[320px] h-[15px] bg-black/15 dark:bg-black/50 rounded-full blur-[20px] pointer-events-none"
          />

          {/* Floating Padel Racket Image (Max 10px translate coordinates parallax) */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              x: transformX,
              y: transformY,
              transformStyle: "preserve-3d"
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [-1.5, 2, -1.5]
            }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative w-[340px] h-[340px] md:w-[560px] md:h-[560px] z-20 cursor-grab active:cursor-grabbing will-change-transform"
          >
            <Image
              src="/images/hero/padel-racket-3d.png"
              alt="Premium 3D Padel Racket"
              fill
              priority
              className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.14)] dark:drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)] select-none"
            />
          </motion.div>

          {/* Desktop/Tablet Floating Stats Cards (Hidden on mobile) */}
          {/* Card 1: 8+ Lapangan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ x: card1X, y: card1Y, transformStyle: "preserve-3d" }}
            className="hidden md:flex absolute top-[38%] left-[2%] z-30 w-[180px]"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-start gap-1 p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.05] shadow-[0_20px_45px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.2)] text-left w-full will-change-transform"
            >
              <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00]">
                <Trophy className="w-4.5 h-4.5" />
              </div>
              <span className="font-heading text-2xl font-black text-zinc-950 dark:text-zinc-50 mt-1">8+</span>
              <span className="font-sans text-[11px] uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500">Lapangan Premium</span>
            </motion.div>
          </motion.div>

          {/* Card 2: 2.500+ Members */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{ x: card2X, y: card2Y, transformStyle: "preserve-3d" }}
            className="hidden md:flex absolute top-[28%] right-[2%] z-30 w-[180px]"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="flex flex-col items-start gap-1 p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.05] shadow-[0_20px_45px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.2)] text-left w-full will-change-transform"
            >
              <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00]">
                <Users className="w-4.5 h-4.5" />
              </div>
              <span className="font-heading text-2xl font-black text-zinc-950 dark:text-zinc-50 mt-1">2.500+</span>
              <span className="font-sans text-[11px] uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500">Member Aktif</span>
            </motion.div>
          </motion.div>

          {/* Card 3: 150+ Events */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{ x: card3X, y: card3Y, transformStyle: "preserve-3d" }}
            className="hidden md:flex absolute bottom-[18%] left-[22%] z-30 w-[180px]"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="flex flex-col items-start gap-1 p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.05] shadow-[0_20px_45px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.2)] text-left w-full will-change-transform"
            >
              <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00]">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <span className="font-heading text-2xl font-black text-zinc-950 dark:text-zinc-50 mt-1">150+</span>
              <span className="font-sans text-[11px] uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500">Event Tahunan</span>
            </motion.div>
          </motion.div>

        </div>

        {/* Mobile / Tablet Stats Cards Grid (Stays centered, stacks neatly, no overflow) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl mt-6 md:hidden z-30"
        >
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/50 border border-black/[0.05] dark:border-white/[0.05] text-left">
            <div className="w-9 h-9 rounded-xl bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00] shrink-0">
              <Trophy className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="font-heading text-lg font-black text-zinc-950 dark:text-zinc-50">8+</div>
              <div className="font-sans text-[10px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500 font-bold">Lapangan Premium</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/50 border border-black/[0.05] dark:border-white/[0.05] text-left">
            <div className="w-9 h-9 rounded-xl bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00] shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="font-heading text-lg font-black text-zinc-950 dark:text-zinc-50">2.500+</div>
              <div className="font-sans text-[10px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500 font-bold">Member Aktif</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/50 border border-black/[0.05] dark:border-white/[0.05] text-left">
            <div className="w-9 h-9 rounded-xl bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00] shrink-0">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="font-heading text-lg font-black text-zinc-950 dark:text-zinc-50">150+</div>
              <div className="font-sans text-[10px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500 font-bold">Event Tahunan</div>
            </div>
          </div>
        </motion.div>

        {/* Google Reviews */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex items-center gap-2.5 mt-8 border border-zinc-200/50 dark:border-zinc-800/50 px-4 py-2 rounded-full bg-zinc-50/50 dark:bg-zinc-900/30 backdrop-blur-sm z-30"
        >
          <div className="flex text-[#ccff00] gap-0.5">
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <p className="font-sans text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
            Rating Google 5.0 (120+ Ulasan Member)
          </p>
        </motion.div>



      </div>
    </section>
  );
}
