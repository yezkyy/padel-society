"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";

interface CourtFiltersProps {
  initialLocation?: string;
  initialType?: string;
  initialDate?: string;
}

export function CourtFilters({
  initialLocation = "",
  initialType = "",
  initialDate = "",
}: CourtFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [location, setLocation] = useState(initialLocation);
  const [type, setType] = useState(initialType);
  const [date, setDate] = useState(initialDate);
  const [showMap, setShowMap] = useState(false);

  const updateFilters = (key: string, value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <section className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl md:rounded-full py-4 md:py-3 px-6 flex flex-wrap gap-4 items-center justify-between shadow-xl shadow-black/5 mb-8">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center w-full md:w-auto">
        {/* Location Select */}
        <CustomSelect
          value={location}
          onValueChange={(val) => {
            setLocation(val);
            updateFilters("location", val);
          }}
          options={[
            { value: "", label: "Semua Lokasi" },
            { value: "jakarta-selatan", label: "Jakarta Selatan" },
            { value: "bali", label: "Bali" },
          ]}
          placeholder="Pilih Lokasi"
          className="h-[44px] w-full md:w-[180px] rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        />

        {/* Type Select */}
        <CustomSelect
          value={type}
          onValueChange={(val) => {
            setType(val);
            updateFilters("type", val);
          }}
          options={[
            { value: "", label: "Semua Tipe" },
            { value: "indoor", label: "Indoor" },
            { value: "outdoor", label: "Outdoor" },
          ]}
          placeholder="Pilih Tipe"
          className="h-[44px] w-full md:w-[160px] rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        />

        {/* Date Input */}
        <div className="w-full md:w-[160px]">
          <CustomDatePicker
            value={date}
            onChange={(val) => {
              setDate(val);
              updateFilters("date", val);
            }}
            placeholder="Pilih Tanggal"
            className="h-[44px] rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
          Tampilan Map
        </span>
        <button
          onClick={() => setShowMap(!showMap)}
          className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
            showMap ? "bg-[#ccff00]" : "bg-zinc-200 dark:bg-zinc-800"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              showMap ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </section>
  );
}
