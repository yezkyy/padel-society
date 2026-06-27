"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RegisterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?mode=register");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-[#506600] dark:text-[#ccff00]" />
      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans">
        Mengalihkan ke halaman pendaftaran...
      </p>
    </div>
  );
}
