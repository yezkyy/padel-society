"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fbf8ff] dark:bg-zinc-950 px-6 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ccff00]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="space-y-6 max-w-md z-10">
        <h1 className="font-heading text-9xl font-bold text-rose-600 leading-none">
          500
        </h1>
        <h2 className="font-heading text-2xl font-bold text-[#1a1b22] dark:text-[#fbf8ff]">
          Terjadi Kesalahan Sistem
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Ada masalah internal di server kami. Silakan coba memuat ulang halaman.
        </p>
        <div className="pt-4 flex gap-4 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full px-8 py-3 h-auto"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  );
}
