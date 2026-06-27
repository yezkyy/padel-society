"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Timer,
  ChevronLeft,
  ChevronRight,
  Check,
  CreditCard,
  Percent,
  Lock,
  Loader2,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { cn } from "@/lib/utils";

interface Court {
  id: string;
  name: string;
  description: string | null;
  pricePerHour: number;
}

interface BookingWizardProps {
  courts: Court[];
  initialCourtId?: string;
}

const defaultTimeSlots = [
  { start: "07:00", end: "08:30", label: "Pagi" },
  { start: "08:30", end: "10:00", label: "Pagi" },
  { start: "10:00", end: "11:30", label: "Siang" },
  { start: "11:30", end: "13:00", label: "Siang" },
  { start: "13:00", end: "14:30", label: "Siang" },
  { start: "14:30", end: "16:00", label: "Sore" },
  { start: "16:00", end: "17:30", label: "Sore" },
  { start: "17:30", end: "19:00", label: "Malam" },
  { start: "19:00", end: "20:30", label: "Malam" },
  { start: "20:30", end: "22:00", label: "Malam" },
];

export function BookingWizard({ courts, initialCourtId }: BookingWizardProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [step, setStep] = useState(1);
  const [selectedCourtId, setSelectedCourtId] = useState(
    initialCourtId || courts[0]?.id || ""
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<typeof defaultTimeSlots[0] | null>(
    null
  );

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Promo
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  // Checkout API call state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    bookingId: string;
    totalPrice: number;
    expiryMinutes: number;
  } | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins in seconds

  const currentCourt = courts.find((c) => c.id === selectedCourtId);

  // Fetch booked slots when court or date changes
  useEffect(() => {
    if (!selectedCourtId || !selectedDate) return;

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await fetch(
          `/api/courts/${selectedCourtId}/availability?date=${selectedDate}`
        );
        const data = await res.json();
        if (data.success) {
          // Flatten booked slot ranges into array of slot start times
          const bookedStarts = data.data.map((b: any) => {
            const dateObj = new Date(b.start);
            return dateObj.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
          });
          setBookedSlots(bookedStarts);
        }
      } catch (err) {
        console.error("Failed to load availability:", err);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
    setSelectedSlot(null);
  }, [selectedCourtId, selectedDate]);

  // Payment Countdown Timer effect
  useEffect(() => {
    if (step !== 3 || !bookingResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Waktu pembayaran Anda telah habis. Sesi booking dibatalkan.");
          setStep(1);
          setBookingResult(null);
          return 900;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, bookingResult]);

  const handleNextStep = () => {
    if (step === 1 && !selectedSlot) {
      toast.error("Pilih waktu bermain terlebih dahulu!");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleApplyPromo = () => {
    if (!promoCodeInput.trim()) return;
    if (promoCodeInput.toUpperCase() === "PROMO10") {
      setAppliedPromo({
        code: "PROMO10",
        discount: 50000,
      });
      toast.success("Promo 'PROMO10' berhasil digunakan! Diskon Rp 50.000");
    } else {
      toast.error("Kode promo tidak valid atau kadaluwarsa");
    }
  };

  const handleCreateBooking = async () => {
    if (!session) {
      toast.error("Silakan masuk terlebih dahulu untuk menyelesaikan booking!");
      router.push(`/login?callbackUrl=/booking`);
      return;
    }

    if (!selectedSlot || !currentCourt) return;

    setIsSubmitting(true);

    try {
      const startTimeStr = `${selectedDate}T${selectedSlot.start}:00`;
      const endTimeStr = `${selectedDate}T${selectedSlot.end}:00`;

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courtId: selectedCourtId,
          startTimeStr,
          endTimeStr,
          promoCode: appliedPromo?.code,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBookingResult(result.data);
        setTimeLeft(result.data.expiryMinutes * 60);
        setStep(3);
        toast.success("Booking berhasil dibuat! Selesaikan pembayaran Anda.");
      } else {
        toast.error(result.message || "Gagal membuat booking");
      }
    } catch (error) {
      toast.error("Gagal terhubung ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulatePayment = (success: boolean) => {
    if (!bookingResult) return;
    if (success) {
      toast.success("Pembayaran berhasil dikonfirmasi!");
      router.push("/member/bookings");
    } else {
      toast.error("Pembayaran dibatalkan atau gagal.");
      setStep(1);
      setBookingResult(null);
    }
  };

  const calculateTotalPrice = () => {
    if (!currentCourt) return 0;
    const basePrice = currentCourt.pricePerHour * 1.5; // All default slots are 1.5 hours
    if (appliedPromo) {
      return Math.max(0, basePrice - appliedPromo.discount);
    }
    return basePrice;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left Area: Wizard Form */}
      <div className="lg:col-span-8 space-y-8">
        {/* Step Indicator */}
        <div className="flex items-center gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1
                  ? "bg-[#ccff00] text-black"
                  : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
              }`}
            >
              1
            </div>
            <span
              className={`text-xs font-bold ${
                step >= 1 ? "text-zinc-900 dark:text-white" : "text-zinc-400"
              }`}
            >
              Pilih Jadwal
            </span>
          </div>
          <div className="w-12 h-px bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2
                  ? "bg-[#ccff00] text-black"
                  : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
              }`}
            >
              2
            </div>
            <span
              className={`text-xs font-bold ${
                step >= 2 ? "text-zinc-900 dark:text-white" : "text-zinc-400"
              }`}
            >
              Konfirmasi
            </span>
          </div>
          <div className="w-12 h-px bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 3
                  ? "bg-[#ccff00] text-black"
                  : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
              }`}
            >
              3
            </div>
            <span
              className={`text-xs font-bold ${
                step >= 3 ? "text-zinc-900 dark:text-white" : "text-zinc-400"
              }`}
            >
              Pembayaran
            </span>
          </div>
        </div>

        {/* Step 1 Content */}
        {step === 1 && (
          <div className="space-y-8">
            {/* Court Selection */}
            <div className="space-y-4">
              <Label className="text-zinc-900 dark:text-zinc-50 font-bold">
                Pilih Lapangan
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {courts.map((court) => (
                  <button
                    key={court.id}
                    onClick={() => setSelectedCourtId(court.id)}
                    className={`p-5 rounded-2xl text-left border transition-all ${
                      selectedCourtId === court.id
                        ? "border-[#ccff00] bg-[#ccff00]/10"
                        : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800"
                    }`}
                  >
                    <span className="font-heading text-sm font-bold block mb-1">
                      {court.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 block">
                      Rp {court.pricePerHour.toLocaleString("id-ID")} / jam
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-4">
              <Label className="text-zinc-900 dark:text-zinc-50 font-bold block">
                Tanggal Bermain
              </Label>
              <div className="w-full sm:max-w-xs">
                <CustomDatePicker
                  value={selectedDate}
                  minDate={new Date()}
                  onChange={setSelectedDate}
                  placeholder="Pilih Tanggal Bermain"
                />
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Label className="text-zinc-900 dark:text-zinc-50 font-bold flex items-center gap-2">
                  Pilih Waktu Bermain
                  {isLoadingSlots && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
                </Label>
                
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Tersedia</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Penuh</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                    <span>Maintenance</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {defaultTimeSlots.map((slot, index) => {
                  const isMaintenance = index === 4; // Mocking 13:00 slot as Maintenance
                  const isBooked = bookedSlots.includes(slot.start) && !isMaintenance;
                  const isSelected = selectedSlot?.start === slot.start;

                  return (
                    <button
                      key={index}
                      disabled={isBooked || isMaintenance}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        "px-5 py-4 rounded-2xl border transition-all text-xs font-semibold flex items-center justify-between group cursor-pointer",
                        isMaintenance
                          ? "bg-zinc-100 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/50 text-zinc-400 cursor-not-allowed"
                          : isBooked
                          ? "bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30 text-rose-500 dark:text-rose-400 cursor-not-allowed"
                          : isSelected
                          ? "bg-[#ccff00] border-[#ccff00] text-black font-bold shadow-lg shadow-[#ccff00]/25 scale-[1.02]"
                          : "bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-200 hover:scale-[1.01] hover:shadow-md"
                      )}
                    >
                      <span>
                        {slot.start} - {slot.end}
                      </span>
                      <span>
                        {isMaintenance 
                          ? "Maint." 
                          : isBooked 
                          ? "Penuh" 
                          : isSelected 
                          ? <Check className="w-3.5 h-3.5" /> 
                          : "Tersedia"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleNextStep}
              className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full px-8 py-3.5 h-auto text-sm w-full sm:w-auto"
            >
              Lanjutkan ke Konfirmasi
            </Button>
          </div>
        )}

        {/* Step 2 Content */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-zinc-950 dark:text-zinc-50">
                Verifikasi Detail Booking
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Tinjau kembali pilihan jadwal dan rincian transaksi sebelum melanjutkan ke proses pembayaran.
              </p>
            </div>

            {/* Promo Code section */}
            <div className="space-y-2">
              <Label htmlFor="promo">Gunakan Kode Promo</Label>
              <div className="flex gap-3">
                <Input
                  id="promo"
                  type="text"
                  placeholder="Contoh: PROMO10"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="rounded-2xl max-w-xs"
                />
                <Button
                  onClick={handleApplyPromo}
                  className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-black rounded-2xl px-6"
                >
                  Gunakan
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="border-zinc-300 rounded-full px-6 py-3 h-auto"
              >
                Kembali
              </Button>
              <Button
                onClick={handleCreateBooking}
                disabled={isSubmitting}
                className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full px-8 py-3.5 h-auto text-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Lanjut ke Pembayaran"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 Content: Payment */}
        {step === 3 && bookingResult && (
          <div className="space-y-8">
            <div className="bg-rose-50 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-950/50 rounded-3xl p-6 text-center space-y-3">
              <span className="text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider block">
                Selesaikan Pembayaran Sebelum Waktu Habis
              </span>
              <div className="font-heading text-4xl font-bold text-rose-600 dark:text-rose-400">
                {Math.floor(timeLeft / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(timeLeft % 60).toString().padStart(2, "0")}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl p-8 space-y-6">
              <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-zinc-400" />
                Metode Pembayaran (Midtrans Snap Simulator)
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                Silakan simulasikan proses webhook pembayaran dari payment gateway di bawah ini:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleSimulatePayment(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-2xl py-6 h-auto flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-600/10"
                >
                  <span className="text-sm font-bold">Simulasi Bayar Sukses</span>
                  <span className="text-[10px] text-emerald-100 font-normal">
                    Mengonfirmasi status lunas
                  </span>
                </Button>
                <Button
                  onClick={() => handleSimulatePayment(false)}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-2xl py-6 h-auto flex flex-col items-center justify-center gap-1 shadow-lg shadow-rose-600/10"
                >
                  <span className="text-sm font-bold">Simulasi Bayar Gagal / Batal</span>
                  <span className="text-[10px] text-rose-100 font-normal">
                    Membatalkan booking & melepas slot
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Area: Booking Summary Sticky Widget */}
      <div className="lg:col-span-4 sticky top-28">
        <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl space-y-6">
          <h2 className="font-heading text-xl font-bold text-zinc-950 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            Ringkasan Booking
          </h2>

          <div className="flex gap-4 items-center">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=150&auto=format&fit=crop"
                alt="Lapangan Padel"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                Lapangan
              </p>
              <h4 className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-50">
                {currentCourt?.name || "Belum dipilih"}
              </h4>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 space-y-4 font-sans text-xs">
            <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-zinc-400" />
                Tanggal
              </span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                Waktu
              </span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {selectedSlot ? `${selectedSlot.start} - ${selectedSlot.end}` : "-"}
              </span>
            </div>

            <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-zinc-400" />
                Durasi
              </span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">1.5 Jam</span>
            </div>

            {appliedPromo && (
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                <span className="flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Promo ({appliedPromo.code})
                </span>
                <span className="font-bold">- Rp {appliedPromo.discount.toLocaleString("id-ID")}</span>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 flex justify-between items-end">
            <div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-bold block mb-1">
                Total Pembayaran
              </span>
              <span className="font-heading text-2xl font-bold text-[#506600] dark:text-[#ccff00]">
                Rp {calculateTotalPrice().toLocaleString("id-ID")}
              </span>
            </div>
            <Lock className="w-4.5 h-4.5 text-zinc-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
