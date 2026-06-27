"use client";

import { Menu, Search, Bell, HelpCircle } from "lucide-react";

interface AdminTopbarProps {
  onToggleSidebar?: () => void;
}

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  return (
    <header className="bg-white/70 dark:bg-zinc-950/70 text-zinc-950 dark:text-zinc-50 fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shadow-sm h-16">
      <div className="flex justify-between items-center h-full px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="md:hidden text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Cari..."
              className="bg-zinc-50 dark:bg-zinc-900 border-none rounded-full pl-10 pr-4 py-2 font-sans text-xs focus:ring-1 focus:ring-[#ccff00] focus:outline-none w-64 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-600 rounded-full"></span>
          </button>
          <button className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 hidden sm:block">
            <HelpCircle className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-black/5 dark:border-white/5 ml-2 cursor-pointer">
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop')" }}></div>
          </div>
        </div>
      </div>
    </header>
  );
}
