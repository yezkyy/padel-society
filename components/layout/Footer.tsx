import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-black/5 dark:border-white/5 py-16 mt-auto">
      <ScrollReveal>
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Padel Society Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="font-heading text-lg font-bold text-[#1a1b22] dark:text-[#fbf8ff] tracking-tight">
              Padel Society
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xs">
            Platform digital terintegrasi untuk booking lapangan padel premium dan terhubung dengan komunitas elit di Indonesia.
          </p>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-4">
            © {new Date().getFullYear()} Padel Society. All rights reserved.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading text-sm font-semibold text-zinc-950 dark:text-zinc-50 uppercase tracking-wider">
            Menu Utama
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/lapangan" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                Daftar Lapangan
              </Link>
            </li>
            <li>
              <Link href="/membership" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                Paket Membership
              </Link>
            </li>
            <li>
              <Link href="/event" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                Event & Turnamen
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading text-sm font-semibold text-zinc-950 dark:text-zinc-50 uppercase tracking-wider">
            Informasi
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/tentang-kami" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/kontak" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                Hubungi Kami
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                Blog & Artikel
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading text-sm font-semibold text-zinc-950 dark:text-zinc-50 uppercase tracking-wider">
            Hubungkan
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      </ScrollReveal>
    </footer>
  );
}
