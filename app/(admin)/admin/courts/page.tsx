"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import {
  KeyRound,
  CalendarDays,
  Percent,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  Check,
  AlertTriangle,
  Clock,
  DollarSign,
  UserCheck,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getCourts,
  createCourt,
  updateCourt,
  deleteCourt,
  toggleCourtStatus,
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  togglePromoCodeActive,
  getSettings,
  saveSettings,
  getBookings,
  createBooking,
  updateBookingStatus,
} from "../actions";

export default function AdminCourtsPage() {
  const [activeTab, setActiveTab] = useState<"courts" | "schedules" | "pricing" | "promos">("courts");
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Core Data
  const [courts, setCourts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    operatingHoursStart: "06:00",
    operatingHoursEnd: "22:00",
    weekendMultiplier: 1.2,
    peakHoursStart: "16:00",
    peakHoursEnd: "21:00",
    peakHoursMultiplier: 1.25,
    memberDiscount: 10,
  });

  // Modal control states
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<any | null>(null);
  
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any | null>(null);

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Form states - Court
  const [courtForm, setCourtForm] = useState({
    name: "",
    description: "",
    pricePerHour: 150000,
    status: "ACTIVE",
  });

  // Form states - Promo
  const [promoForm, setPromoForm] = useState({
    code: "",
    discountType: "PERCENT",
    discountValue: 10,
    minBookingAmount: 0,
    maxUses: 100,
    validFrom: "",
    validUntil: "",
    isActive: true,
  });

  // Schedule View States
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedBlockSlot, setSelectedBlockSlot] = useState<{
    courtId: string;
    courtName: string;
    time: string;
  } | null>(null);

  // Fetch all initial data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchedCourts = await getCourts();
      const fetchedBookings = await getBookings();
      const fetchedPromos = await getPromoCodes();
      const fetchedSettings = await getSettings();

      setCourts(fetchedCourts);
      setBookings(fetchedBookings);
      setPromos(fetchedPromos);
      setSettings(fetchedSettings);
    } catch (e) {
      toast.error("Gagal memuat data dari server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Court Operations
  const handleOpenAddCourt = () => {
    setEditingCourt(null);
    setCourtForm({
      name: "",
      description: "",
      pricePerHour: 150000,
      status: "ACTIVE",
    });
    setIsCourtModalOpen(true);
  };

  const handleOpenEditCourt = (court: any) => {
    setEditingCourt(court);
    setCourtForm({
      name: court.name,
      description: court.description || "",
      pricePerHour: court.pricePerHour,
      status: court.status,
    });
    setIsCourtModalOpen(true);
  };

  const handleSaveCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courtForm.name.trim()) {
      toast.error("Nama lapangan wajib diisi");
      return;
    }

    try {
      if (editingCourt) {
        await updateCourt(editingCourt.id, courtForm);
        toast.success("Lapangan berhasil diperbarui!");
      } else {
        await createCourt(courtForm);
        toast.success("Lapangan baru berhasil ditambahkan!");
      }
      setIsCourtModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Gagal menyimpan data lapangan");
    }
  };

  const handleDeleteCourt = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus lapangan ini? Seluruh riwayat booking lapangan ini juga mungkin terpengaruh.")) {
      try {
        await deleteCourt(id);
        toast.success("Lapangan berhasil dihapus");
        fetchData();
      } catch (err) {
        toast.error("Gagal menghapus lapangan");
      }
    }
  };

  const handleToggleCourtStatus = async (id: string) => {
    try {
      await toggleCourtStatus(id);
      toast.success("Status lapangan berhasil diubah");
      fetchData();
    } catch (err) {
      toast.error("Gagal mengubah status lapangan");
    }
  };

  // Promo Operations
  const handleOpenAddPromo = () => {
    setEditingPromo(null);
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    setPromoForm({
      code: "",
      discountType: "PERCENT",
      discountValue: 10,
      minBookingAmount: 0,
      maxUses: 100,
      validFrom: today.toISOString().split("T")[0],
      validUntil: nextMonth.toISOString().split("T")[0],
      isActive: true,
    });
    setIsPromoModalOpen(true);
  };

  const handleOpenEditPromo = (promo: any) => {
    setEditingPromo(promo);
    
    // Format dates to YYYY-MM-DD
    const fromDate = promo.validFrom instanceof Date ? promo.validFrom : new Date(promo.validFrom);
    const untilDate = promo.validUntil instanceof Date ? promo.validUntil : new Date(promo.validUntil);

    setPromoForm({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      minBookingAmount: promo.minBookingAmount,
      maxUses: promo.maxUses || 100,
      validFrom: fromDate.toISOString().split("T")[0],
      validUntil: untilDate.toISOString().split("T")[0],
      isActive: promo.isActive,
    });
    setIsPromoModalOpen(true);
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.code.trim()) {
      toast.error("Kode promo wajib diisi");
      return;
    }

    const payload = {
      ...promoForm,
      validFrom: new Date(promoForm.validFrom),
      validUntil: new Date(promoForm.validUntil + "T23:59:59"),
    };

    try {
      if (editingPromo) {
        await updatePromoCode(editingPromo.id, payload);
        toast.success("Kode promo berhasil diperbarui!");
      } else {
        await createPromoCode(payload);
        toast.success("Kode promo baru berhasil ditambahkan!");
      }
      setIsPromoModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Gagal menyimpan kode promo");
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kode promo ini?")) {
      try {
        await deletePromoCode(id);
        toast.success("Kode promo berhasil dihapus");
        fetchData();
      } catch (err) {
        toast.error("Gagal menghapus kode promo");
      }
    }
  };

  const handleTogglePromoStatus = async (id: string) => {
    try {
      await togglePromoCodeActive(id);
      toast.success("Status promo berhasil diperbarui");
      fetchData();
    } catch (err) {
      toast.error("Gagal memperbarui status promo");
    }
  };

  // Pricing & Rules Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSettings(settings);
      toast.success("Aturan harga & operasional berhasil disimpan!");
      fetchData();
    } catch (e) {
      toast.error("Gagal menyimpan konfigurasi");
    }
  };

  // Schedules / Manual Block Slots
  const handleOpenBlockSlot = (courtId: string, courtName: string, time: string) => {
    setSelectedBlockSlot({ courtId, courtName, time });
    setIsBlockModalOpen(true);
  };

  const handleConfirmBlockSlot = async () => {
    if (!selectedBlockSlot) return;

    // e.g. "08:00" -> start 08:00, end 09:00
    const [hour] = selectedBlockSlot.time.split(":").map(Number);
    const startTime = new Date(`${selectedDate}T${selectedBlockSlot.time}:00`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour

    try {
      await createBooking({
        userId: "usr-admin-blocked", // Special or mock ID to signify admin block
        courtId: selectedBlockSlot.courtId,
        startTime,
        endTime,
        status: "CONFIRMED", // Directly confirmed
        totalPrice: 0, // Block slots are free (maintenance)
        promoCode: "SYSTEM_BLOCK",
      });
      toast.success(`Slot lapangan ${selectedBlockSlot.courtName} pukul ${selectedBlockSlot.time} berhasil diblokir`);
      setIsBlockModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Gagal memblokir slot");
    }
  };

  const handleReleaseBlockSlot = async (bookingId: string) => {
    if (confirm("Apakah Anda yakin ingin membatalkan blokir/booking pada slot waktu ini?")) {
      try {
        await updateBookingStatus(bookingId, "CANCELLED");
        toast.success("Slot waktu berhasil dilepaskan");
        fetchData();
      } catch (err) {
        toast.error("Gagal melepaskan slot");
      }
    }
  };

  // Schedule Calculations (Timeslot mapping)
  const timeSlots = [];
  const startHour = Number(settings.operatingHoursStart.split(":")[0]);
  const endHour = Number(settings.operatingHoursEnd.split(":")[0]);
  
  for (let h = startHour; h < endHour; h++) {
    const timeStr = `${h.toString().padStart(2, "0")}:00`;
    timeSlots.push(timeStr);
  }

  // Check if a specific time is occupied
  const getBookingForSlot = (courtId: string, timeStr: string) => {
    const targetTime = new Date(`${selectedDate}T${timeStr}:00`);
    
    return bookings.find((b) => {
      if (b.courtId !== courtId) return false;
      if (b.status === "CANCELLED" || b.status === "EXPIRED") return false;
      
      const start = new Date(b.startTime);
      const end = new Date(b.endTime);
      return targetTime >= start && targetTime < end;
    });
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
            Court & Facility Manager
          </h2>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
            Kelola data lapangan, atur jadwal operasional, set tarif sewa, dan edit kode promo.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl flex gap-1 self-start sm:self-auto border border-zinc-200/50 dark:border-zinc-800/50">
          <button
            onClick={() => setActiveTab("courts")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "courts"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Lapangan
          </button>
          <button
            onClick={() => setActiveTab("schedules")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "schedules"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Jadwal
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "pricing"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            Harga & Jam
          </button>
          <button
            onClick={() => setActiveTab("promos")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "promos"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            Promo
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-zinc-200 border-t-[#ccff00] animate-spin" />
          <p className="font-sans text-xs text-zinc-400 font-bold uppercase tracking-wider">Memuat Data...</p>
        </div>
      ) : (
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* TAB 1: COURTS LIST */}
          {activeTab === "courts" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Daftar Lapangan Tersedia ({courts.length})
                </h3>
                <Button
                  onClick={handleOpenAddCourt}
                  className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-4 py-2.5 h-auto transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Lapangan
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {courts.map((court) => (
                  <div
                    key={court.id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                          {court.name}
                        </h4>
                        <span
                          onClick={() => handleToggleCourtStatus(court.id)}
                          className={`cursor-pointer px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider select-none ${
                            court.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {court.status === "ACTIVE" ? "Aktif" : "Maintanance"}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                        {court.description || "Tidak ada deskripsi."}
                      </p>
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                          Tarif Sewa
                        </span>
                        <p className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                          Rp {court.pricePerHour.toLocaleString("id-ID")}
                          <span className="text-xs text-zinc-400 font-sans font-normal"> / jam</span>
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleOpenEditCourt(court)}
                          variant="outline"
                          className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl p-2 w-9 h-9"
                        >
                          <Edit2 className="w-4 h-4 text-zinc-500" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCourt(court.id)}
                          variant="outline"
                          className="border-zinc-200 dark:border-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl p-2 w-9 h-9 group"
                        >
                          <Trash2 className="w-4 h-4 text-zinc-500 group-hover:text-rose-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE PLANNER */}
          {activeTab === "schedules" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl">
                <div className="space-y-1">
                  <h3 className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50">
                    Kalender Keterisian & Pemblokiran Lapangan
                  </h3>
                  <p className="font-sans text-xs text-zinc-400">
                    Pilih tanggal untuk melihat jadwal live dan memblokir slot waktu lapangan secara manual.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CustomDatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 w-[170px]"
                  />
                </div>
              </div>

              {courts.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-3xl text-zinc-400">
                  Belum ada data lapangan. Tambahkan lapangan terlebih dahulu.
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 overflow-x-auto shadow-sm">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800">
                        <th className="py-4 px-4 font-heading text-xs font-bold text-zinc-400 w-24">Waktu</th>
                        {courts.map((court) => (
                          <th key={court.id} className="py-4 px-4 font-heading text-xs font-bold text-zinc-900 dark:text-zinc-50">
                            {court.name}
                            <span className={`block text-[9px] font-sans font-normal ${
                              court.status === "ACTIVE" ? "text-emerald-500" : "text-rose-500"
                            }`}>
                              {court.status === "ACTIVE" ? "Aktif" : "Maintenance"}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                      {timeSlots.map((timeStr) => (
                        <tr key={timeStr} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30">
                          <td className="py-4 px-4 font-mono text-xs font-bold text-zinc-500 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            {timeStr}
                          </td>
                          {courts.map((court) => {
                            const b = getBookingForSlot(court.id, timeStr);
                            const isMaintenance = court.status !== "ACTIVE";
                            
                            if (isMaintenance) {
                              return (
                                <td key={court.id} className="p-2">
                                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl py-2.5 px-4 flex items-center justify-center gap-1.5 text-[10px] font-bold select-none h-12">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    MAINTENANCE
                                  </div>
                                </td>
                              );
                            }

                            if (b) {
                              const isBlocked = b.promoCode === "SYSTEM_BLOCK";
                              return (
                                <td key={court.id} className="p-2">
                                  <div
                                    className={`rounded-2xl p-2.5 flex items-center justify-between border h-12 ${
                                      isBlocked
                                        ? "bg-zinc-900 border-zinc-800 text-zinc-400 dark:bg-zinc-800/40 dark:border-zinc-700/50"
                                        : "bg-[#ccff00]/10 border-[#ccff00]/25 text-[#5b7300] dark:text-[#ccff00]"
                                    }`}
                                  >
                                    <div className="truncate">
                                      <p className="text-[10px] font-bold leading-none truncate">
                                        {isBlocked ? "BLOCKED (Maintenance/Coaching)" : b.user.name}
                                      </p>
                                      <p className="text-[9px] text-zinc-400 mt-1">
                                        {isBlocked ? "Manual Block" : "Confirmed Booking"}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleReleaseBlockSlot(b.id)}
                                      className="text-zinc-400 hover:text-rose-500 p-1 transition-colors"
                                      title={isBlocked ? "Lepas Blokir" : "Batalkan Booking"}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              );
                            }

                            return (
                              <td key={court.id} className="p-2">
                                <button
                                  onClick={() => handleOpenBlockSlot(court.id, court.name, timeStr)}
                                  className="w-full border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-2xl h-12 flex items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white transition-all text-[10px] font-bold gap-1"
                                >
                                  <Lock className="w-3 h-3" />
                                  Blokir Slot
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRICING & HOURS */}
          {activeTab === "pricing" && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 max-w-2xl mx-auto shadow-sm">
              <form onSubmit={handleSaveSettings} className="space-y-8">
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Konfigurasi Jam & Aturan Tarif
                  </h3>
                  <p className="font-sans text-xs text-zinc-400">
                    Atur jam operasional lapangan serta kelipatan tarif khusus untuk peak hours dan akhir pekan.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Jam Operasional */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                      Jam Mulai Operasional
                    </label>
                    <CustomSelect
                      value={settings.operatingHoursStart}
                      onValueChange={(val) => setSettings({ ...settings, operatingHoursStart: val })}
                      options={Array.from({ length: 12 }).map((_, i) => {
                        const val = `${(i + 5).toString().padStart(2, "0")}:00`;
                        return { value: val, label: val };
                      })}
                      className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                      Jam Selesai Operasional
                    </label>
                    <CustomSelect
                      value={settings.operatingHoursEnd}
                      onValueChange={(val) => setSettings({ ...settings, operatingHoursEnd: val })}
                      options={Array.from({ length: 12 }).map((_, i) => {
                        const val = `${(i + 15).toString().padStart(2, "0")}:00`;
                        return { value: val, label: val };
                      })}
                      className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                  {/* Peak Hours Settings */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                      Peak Hours Mulai
                    </label>
                    <CustomSelect
                      value={settings.peakHoursStart}
                      onValueChange={(val) => setSettings({ ...settings, peakHoursStart: val })}
                      options={Array.from({ length: 24 }).map((_, i) => {
                        const val = `${i.toString().padStart(2, "0")}:00`;
                        return { value: val, label: val };
                      })}
                      className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                      Multiplier Peak Hours
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.05"
                        min="1"
                        value={settings.peakHoursMultiplier}
                        onChange={(e) => setSettings({ ...settings, peakHoursMultiplier: parseFloat(e.target.value) })}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 font-mono">x</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                  {/* Weekend Markup */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                      Multiplier Akhir Pekan (Weekend)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.05"
                        min="1"
                        value={settings.weekendMultiplier}
                        onChange={(e) => setSettings({ ...settings, weekendMultiplier: parseFloat(e.target.value) })}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 font-mono">x</span>
                    </div>
                  </div>

                  {/* Member Discount */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                      Diskon Member Otomatis
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.memberDiscount}
                        onChange={(e) => setSettings({ ...settings, memberDiscount: parseInt(e.target.value) })}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 font-mono">%</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-6 py-3 h-auto transition-colors"
                  >
                    Simpan Konfigurasi
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: PROMO CODES */}
          {activeTab === "promos" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Manajemen Kode Promo
                </h3>
                <Button
                  onClick={handleOpenAddPromo}
                  className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-4 py-2.5 h-auto transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Buat Promo Baru
                </Button>
              </div>

              {promos.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-3xl text-zinc-400">
                  Belum ada kode promo aktif.
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 overflow-x-auto shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                        <th className="py-4 px-4">Kode</th>
                        <th className="py-4 px-4">Diskon</th>
                        <th className="py-4 px-4 text-center">Batas Pemakaian</th>
                        <th className="py-4 px-4">Masa Berlaku</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-800 dark:text-zinc-200">
                      {promos.map((promo) => {
                        const fromDate = new Date(promo.validFrom).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
                        const untilDate = new Date(promo.validUntil).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
                        return (
                          <tr key={promo.id} className="border-b border-zinc-100/50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                            <td className="py-4 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                              {promo.code}
                            </td>
                            <td className="py-4 px-4">
                              {promo.discountType === "PERCENT" ? (
                                <span className="font-bold text-[#506600] dark:text-[#ccff00]">{promo.discountValue}% Off</span>
                              ) : (
                                <span className="font-bold">Rp {promo.discountValue.toLocaleString("id-ID")} Off</span>
                              )}
                              <p className="text-[10px] text-zinc-400 mt-0.5">
                                Min. Spend: Rp {promo.minBookingAmount.toLocaleString("id-ID")}
                              </p>
                            </td>
                            <td className="py-4 px-4 text-center font-mono font-bold">
                              {promo.usedCount} / {promo.maxUses || "∞"}
                            </td>
                            <td className="py-4 px-4 text-zinc-500 dark:text-zinc-400">
                              {fromDate} - {untilDate}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                onClick={() => handleTogglePromoStatus(promo.id)}
                                className={`cursor-pointer px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider select-none ${
                                  promo.isActive
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {promo.isActive ? "Aktif" : "Nonaktif"}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <Button
                                  onClick={() => handleOpenEditPromo(promo)}
                                  variant="outline"
                                  className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl p-2 w-8 h-8"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-zinc-500" />
                                </Button>
                                <Button
                                  onClick={() => handleDeletePromo(promo.id)}
                                  variant="outline"
                                  className="border-zinc-200 dark:border-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl p-2 w-8 h-8 group"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-rose-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* COURT ADD/EDIT MODAL OVERLAY */}
      <AnimatePresence>
        {isCourtModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6 mx-4"
            >
              <div>
                <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {editingCourt ? "Edit Lapangan" : "Tambah Lapangan Baru"}
                </h3>
                <p className="font-sans text-xs text-zinc-400">
                  Isi data spesifikasi lapangan Padel Society.
                </p>
              </div>

              <form onSubmit={handleSaveCourt} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Nama Lapangan</label>
                  <input
                    type="text"
                    required
                    value={courtForm.name}
                    onChange={(e) => setCourtForm({ ...courtForm, name: e.target.value })}
                    placeholder="Contoh: Court 1 (Indoor)"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Deskripsi / Spesifikasi</label>
                  <textarea
                    value={courtForm.description}
                    onChange={(e) => setCourtForm({ ...courtForm, description: e.target.value })}
                    placeholder="Jelaskan kualitas lapangan, jenis karpet, lampu, dll."
                    rows={3}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tarif Sewa Per Jam (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">Rp</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={courtForm.pricePerHour}
                      onChange={(e) => setCourtForm({ ...courtForm, pricePerHour: parseInt(e.target.value) })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-semibold">Status Awal</label>
                  <CustomSelect
                    value={courtForm.status}
                    onValueChange={(val) => setCourtForm({ ...courtForm, status: val })}
                    options={[
                      { value: "ACTIVE", label: "Aktif (Dapat Dibooking)" },
                      { value: "MAINTENANCE", label: "Maintenance (Diblokir)" },
                    ]}
                    className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCourtModalOpen(false)}
                    className="border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-5"
                  >
                    Simpan
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROMO ADD/EDIT MODAL OVERLAY */}
      <AnimatePresence>
        {isPromoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6 mx-4"
            >
              <div>
                <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {editingPromo ? "Edit Kode Promo" : "Buat Promo Baru"}
                </h3>
                <p className="font-sans text-xs text-zinc-400">
                  Konfigurasikan kode promo potongan harga sewa.
                </p>
              </div>

              <form onSubmit={handleSavePromo} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Kode Promo</label>
                    <input
                      type="text"
                      required
                      value={promoForm.code}
                      onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase().replace(/\s/g, "") })}
                      placeholder="PADEL10"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Jenis Diskon</label>
                    <CustomSelect
                      value={promoForm.discountType}
                      onValueChange={(val) => setPromoForm({ ...promoForm, discountType: val })}
                      options={[
                        { value: "PERCENT", label: "Persentase (%)" },
                        { value: "FIXED", label: "Potongan Tetap (Rp)" },
                      ]}
                      className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Nilai Diskon</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={promoForm.discountValue}
                      onChange={(e) => setPromoForm({ ...promoForm, discountValue: parseInt(e.target.value) })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Batas Kuota Pemakaian</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={promoForm.maxUses}
                      onChange={(e) => setPromoForm({ ...promoForm, maxUses: parseInt(e.target.value) })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Minimal Transaksi (IDR)</label>
                  <input
                    type="number"
                    min="0"
                    value={promoForm.minBookingAmount}
                    onChange={(e) => setPromoForm({ ...promoForm, minBookingAmount: parseInt(e.target.value) })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-semibold">Berlaku Mulai</label>
                    <CustomDatePicker
                      value={promoForm.validFrom}
                      onChange={(val) => setPromoForm({ ...promoForm, validFrom: val })}
                      className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-semibold">Berlaku Hingga</label>
                    <CustomDatePicker
                      value={promoForm.validUntil}
                      onChange={(val) => setPromoForm({ ...promoForm, validUntil: val })}
                      className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPromoModalOpen(false)}
                    className="border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-5"
                  >
                    Simpan Promo
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BLOCK SLOT CONFIRMATION MODAL */}
      <AnimatePresence>
        {isBlockModalOpen && selectedBlockSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl space-y-6 mx-4"
            >
              <div className="flex items-center gap-3 text-amber-500">
                <div className="p-3 bg-amber-500/10 rounded-2xl">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                    Blokir Slot Waktu
                  </h3>
                  <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400">Konfirmasi Pemblokiran</p>
                </div>
              </div>

              <div className="space-y-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60 p-4 rounded-2xl text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Lapangan:</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{selectedBlockSlot.courtName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Tanggal:</span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {new Date(selectedDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Waktu:</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{selectedBlockSlot.time} (1 Jam)</span>
                </div>
              </div>

              <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                Slot waktu yang diblokir tidak akan dapat dipilih oleh pengguna di halaman publik atau member dashboard. Ini digunakan untuk maintenance lapangan, coaching, atau pemesanan offline khusus.
              </p>

              <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsBlockModalOpen(false)}
                  className="border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleConfirmBlockSlot}
                  className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-bold text-xs rounded-xl px-5"
                >
                  Blokir Slot
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
