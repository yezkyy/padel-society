"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

function LenisScrollHandler() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    let timeoutId: NodeJS.Timeout;

    const onScroll = () => {
      document.documentElement.classList.add("is-scrolling");
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 1000); // fade out scrollbar thumb after 1 second of inactivity
    };

    lenis.on("scroll", onScroll);

    // Global interceptor for internal anchor links (#links)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (href) {
        if (href.startsWith("#")) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element instanceof HTMLElement) {
            lenis.scrollTo(element, {
              offset: 0,
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple/Stripe-like natural easeOutExpo
            });
          }
        } else if (href.includes("#")) {
          const [urlPath, hash] = href.split("#");
          const currentPath = window.location.pathname;
          
          if (
            urlPath === "" ||
            urlPath === currentPath ||
            (urlPath === "/" && currentPath === "")
          ) {
            e.preventDefault();
            const element = document.getElementById(hash);
            if (element) {
              lenis.scrollTo(element, {
                offset: 0,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              });
            }
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      lenis.off("scroll", onScroll);
      document.removeEventListener("click", handleAnchorClick);
      clearTimeout(timeoutId);
    };
  }, [lenis]);

  return null;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 w-1 h-[180px] bg-zinc-200/20 dark:bg-zinc-800/10 rounded-full z-50 pointer-events-none hidden sm:block">
      <motion.div 
        className="w-full bg-[#ccff00] origin-top rounded-full"
        style={{ scaleY, height: "100%" }}
      />
    </div>
  );
}

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      <LenisScrollHandler />
      <ScrollProgress />
      {children}
    </ReactLenis>
  );
}
