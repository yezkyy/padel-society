"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Wifi, Coffee, Car, Shield, ShoppingBag, Target, Eye, Sparkles } from "lucide-react";

export default function FacilitiesSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 120, mass: 0.8 };

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [2, -2]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-2, 2]), springConfig);
  const transformX = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), springConfig);
  const transformY = useSpring(useTransform(mouseY, [-300, 300], [-8, 8]), springConfig);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const facilities = [
    { name: "WiFi Kecepatan Tinggi", icon: Wifi },
    { name: "Kafe & Lounge", icon: Coffee },
    { name: "Area Parkir Luas", icon: Car },
    { name: "Shower & Locker Room", icon: Shield },
    { name: "Rental Peralatan", icon: Sparkles },
    { name: "Pro Shop", icon: ShoppingBag },
    { name: "Coaching Area", icon: Target },
    { name: "Tribun Penonton", icon: Eye },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden py-24 md:py-32 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 border-y border-zinc-100 dark:border-zinc-900"
    >
      {/* Background design elements */}
      {/* 1. Radial Spotlights & Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.15),transparent)] pointer-events-none -z-10" />
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-[#ccff00]/4 dark:bg-[#ccff00]/2 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-zinc-100 dark:bg-zinc-800/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 2. Noise Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22><filter%20id=%22noiseFilter%22><feTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.85%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/></filter><rect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noiseFilter)%22/></svg>')] opacity-[0.008] dark:opacity-[0.012] pointer-events-none -z-10" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* Left Column: Content (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 order-2 lg:order-1">

          {/* Small badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.05] text-[10px] sm:text-[11px] font-bold text-[#506600] dark:text-[#ccff00] tracking-widest uppercase shadow-sm select-none"
          >
            Fasilitas Terintegrasi
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] font-black text-zinc-950 dark:text-zinc-50 leading-[1.1] tracking-tight max-w-xl"
          >
            Lebih Dari Sekadar <br /> Lapangan Bermain
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-sans text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-[560px] leading-relaxed"
          >
            Padel Society berkomitmen memberikan kenyamanan penuh baik bagi pemain maupun penonton dengan fasilitas penunjang yang lengkap di sekitar area club.
          </motion.p>

          {/* Highlights Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl pt-2"
          >
            {facilities.map((fac, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-black/[0.04] dark:border-white/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.015)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(204,255,0,0.08)] hover:border-[#ccff00]/30 transition-all duration-300 text-left group cursor-default"
              >
                <div className="w-9 h-9 rounded-xl bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00] group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <fac.icon className="w-5 h-5" />
                </div>
                <span className="font-sans text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  {fac.name}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>

        {/* Right Column: Visual Image Collage (7 cols on lg) */}
        <div className="lg:col-span-7 flex items-center justify-center w-full order-1 lg:order-2">

          <motion.div
            style={{
              rotateX,
              rotateY,
              x: transformX,
              y: transformY,
              transformStyle: "preserve-3d"
            }}
            animate={{
              y: [0, -8, 0]
            }}
            whileHover={{
              scale: 1.03,
              rotate: 1.5
            }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.3 },
              rotate: { duration: 0.3 }
            }}
            className="relative w-full max-w-[320px] sm:max-w-[480px] md:max-w-[650px] lg:max-w-[580px] xl:max-w-[720px] 2xl:max-w-[800px] aspect-[4/3] sm:aspect-video lg:aspect-[4/3] xl:aspect-video select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.35)] will-change-transform"
          >
            {/* Radial glow green behind collage */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ccff00]/6 dark:bg-[#ccff00]/3 rounded-full blur-[80px] -z-10 pointer-events-none" />

            <Image
              src="/images/about/fasilitas.png"
              alt="Fasilitas Terintegrasi Collage"
              fill
              unoptimized
              className="object-contain"
              priority
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
}
