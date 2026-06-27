"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { Trophy, Users, Sparkles, Zap, Star } from "lucide-react";

interface CounterProps {
  value: number;
  duration?: number;
}

function Counter({ value, duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMilliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMilliseconds / end), 10);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMilliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString("id-ID")}</span>;
}

export default function AboutSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 120, mass: 0.8 };
  
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), springConfig);
  const transformX = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), springConfig);
  const transformY = useSpring(useTransform(mouseY, [-300, 300], [-10, 10]), springConfig);

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

  const highlights = [
    { name: "Fasilitas Premium", icon: Trophy },
    { name: "Booking Real-time", icon: Zap },
    { name: "Komunitas Aktif", icon: Users },
    { name: "Event Rutin", icon: Sparkles },
  ];

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden py-24 md:py-32 flex flex-col items-center justify-center -mt-10"
    >
      {/* Background design elements */}
      {/* 1. Spotlight from top-middle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[350px] bg-gradient-to-b from-[#ccff00]/6 via-[#ccff00]/1 to-transparent blur-[110px] rounded-full pointer-events-none -z-10" />

      {/* 2. Soft blur circle green */}
      <div className="absolute top-[35%] left-[12%] w-[280px] h-[280px] bg-[#ccff00]/5 dark:bg-[#ccff00]/3 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[15%] w-[320px] h-[320px] bg-zinc-200/10 dark:bg-zinc-800/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 3. Noise Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22><filter%20id=%22noiseFilter%22><feTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.85%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/></filter><rect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noiseFilter)%22/></svg>')] opacity-[0.01] dark:opacity-[0.015] pointer-events-none -z-10" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Visual (6 cols on lg) */}
        <div className="lg:col-span-6 flex items-center justify-center w-full relative">
          
          {/* Radial glow green behind image */}
          <div className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] bg-[#ccff00]/10 dark:bg-[#ccff00]/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none -z-10" />
          
          {/* Background gradient blur */}
          <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-[#ccff00]/4 to-zinc-200/5 dark:to-zinc-800/5 rounded-full blur-[110px] pointer-events-none -z-10" />
          
          {/* Decorative dashed rings */}
          <div className="absolute -inset-4 border border-dashed border-black/[0.04] dark:border-white/[0.03] rounded-[2.5rem] pointer-events-none -z-10 animate-[spin_180s_linear_infinite]" />
          <div className="absolute -inset-8 border border-black/[0.02] dark:border-white/[0.01] rounded-[3rem] pointer-events-none -z-10" />

          {/* Main Visual Image Card with Mouse Parallax & Soft Floating animation */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              x: transformX,
              y: transformY,
              transformStyle: "preserve-3d"
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [0.5, -0.5, 0.5]
            }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative w-[260px] sm:w-[320px] md:w-[380px] lg:w-[360px] xl:w-[400px] aspect-[4/5] p-2 bg-gradient-to-b from-black/[0.02] to-black/[0.05] dark:from-white/10 dark:to-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-[2.5rem] shadow-2xl shadow-black/5 dark:shadow-black/40 overflow-hidden group select-none will-change-transform"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent pointer-events-none z-10" />
            
            {/* The Image inside the card */}
            <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              <Image
                src="/images/about/about-player.png"
                alt="Padel Player Visual"
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>

            {/* Floating Badges with hover micro-interaction */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.2 }}
              className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] text-[10px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-50 shadow-lg cursor-default select-none"
            >
              <Trophy className="w-3.5 h-3.5 text-[#506600] dark:text-[#ccff00]" />
              <span>Premium Club</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] text-[10px] sm:text-xs font-bold text-zinc-900 dark:text-zinc-50 shadow-lg cursor-default select-none"
            >
              <Star className="w-3.5 h-3.5 text-[#506600] dark:text-[#ccff00] fill-current" />
              <span>Top Community</span>
            </motion.div>

          </motion.div>

        </div>

        {/* Right Column: Content (6 cols on lg) */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          
          {/* Small badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-zinc-900/40 border border-black/[0.04] dark:border-white/[0.04] text-[10px] sm:text-[11px] font-bold text-[#506600] dark:text-[#ccff00] tracking-widest uppercase select-none"
          >
            Tentang Padel Society
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[2.65rem] xl:text-[2.85rem] font-black text-zinc-950 dark:text-zinc-50 leading-[1.12] tracking-tight max-w-xl"
          >
            Membangun Standar Baru Olahraga Padel di Indonesia
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed"
          >
            Padel Society lahir dari kecintaan kami terhadap olahraga padel. Kami berdedikasi untuk mempopulerkan olahraga raket dengan pertumbuhan tercepat di dunia ini di Indonesia dengan menyediakan fasilitas standar turnamen internasional dan sistem booking digital yang modern.
          </motion.p>

          {/* Highlights point grid */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-3 w-full max-w-xl pt-2"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-black/[0.015] dark:bg-white/[0.015] border border-black/[0.03] dark:border-white/[0.03] hover:border-[#ccff00]/25 transition-all text-left animate-none"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00] shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-sans text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 select-none">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </motion.div>

          {/* Stats Cards (Counter Animations inside) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl pt-4"
          >
            {/* Stats Card 1 */}
            <div className="flex flex-col items-center lg:items-start p-5 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.05] shadow-[0_15px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.15)] text-center lg:text-left transition-all duration-300 hover:border-[#ccff00]/30 hover:scale-[1.02] group">
              <span className="font-heading text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50 group-hover:text-[#506600] dark:group-hover:text-[#ccff00] transition-colors">
                <Counter value={4} />+
              </span>
              <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500 mt-1">Lapangan</span>
            </div>

            {/* Stats Card 2 */}
            <div className="flex flex-col items-center lg:items-start p-5 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.05] shadow-[0_15px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.15)] text-center lg:text-left transition-all duration-300 hover:border-[#ccff00]/30 hover:scale-[1.02] group">
              <span className="font-heading text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50 group-hover:text-[#506600] dark:group-hover:text-[#ccff00] transition-colors">
                <Counter value={2500} />+
              </span>
              <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500 mt-1">Member</span>
            </div>

            {/* Stats Card 3 */}
            <div className="flex flex-col items-center lg:items-start p-5 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.05] shadow-[0_15px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.15)] text-center lg:text-left col-span-2 md:col-span-1 transition-all duration-300 hover:border-[#ccff00]/30 hover:scale-[1.02] group">
              <span className="font-heading text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50 group-hover:text-[#506600] dark:group-hover:text-[#ccff00] transition-colors">
                <Counter value={150} />+
              </span>
              <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-zinc-400 dark:text-zinc-500 mt-1">Event</span>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
