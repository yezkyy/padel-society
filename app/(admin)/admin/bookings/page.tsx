"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import {
  CalendarDays,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  Download,
  MoreVertical,
  X,
  CreditCard,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getBookings,
  getCourts,
  getCustomers,
  createBooking,
  updateBookingStatus,
  rescheduleBooking,
} from "../actions";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [courts, setCourts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [courtFilter, setCourtFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // View state: list or create
  const [view, setView] = useState<"list" | "create">("list");

  // Dialog / Modal states
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("PENDING");

  // Form states - Reschedule
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  // Form states - Create Booking
  const [createForm, setCreateForm] = useState({
    userId: "",
    courtId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "08:00",
    endTime: "09:00",
    status: "CONFIRMED",
    totalPrice: 0,
    promoCode: "",
  });

  // Fetch initial data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const bList = await getBookings();
      const cList = await getCourts();
      const uList = await getCustomers();
      
      setBookings(bList);
      setCourts(cList.filter((c: any) => c.status === "ACTIVE"));
      setCustomers(uList);
    } catch (e) {
      toast.error("Gagal memuat data booking");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update computed price when court, times are changed in creation form
  useEffect(() => {
    const selectedCourtObj = courts.find(c => c.id === createForm.courtId);
    if (!selectedCourtObj || !createForm.startTime || !createForm.endTime) {
      setCreateForm(prev => ({ ...prev, totalPrice: 0 }));
      return;
    }

    const [startH, startM] = createForm.startTime.split(":").map(Number);
    const [endH, endM] = createForm.endTime.split(":").map(Number);
    
    const durationHours = (endH + endM / 60) - (startH + startM / 60);
    
    if (durationHours > 0) {
      const price = Math.round(selectedCourtObj.pricePerHour * durationHours);
      setCreateForm(prev => ({ ...prev, totalPrice: price }));
    } else {
      setCreateForm(prev => ({ ...prev, totalPrice: 0 }));
    }
  }, [createForm.courtId, createForm.startTime, createForm.endTime, courts]);

  // Operations - Change Status
  const handleOpenStatusModal = (booking: any) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setIsStatusModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedBooking) return;
    try {
      await updateBookingStatus(selectedBooking.id, newStatus);
      toast.success(`Status booking ${selectedBooking.id} berhasil diperbarui menjadi ${newStatus}`);
      setIsStatusModalOpen(false);
      fetchData();
    } catch (e) {
      toast.error("Gagal memperbarui status");
    }
  };

  // Operations - Reschedule
  const handleOpenRescheduleModal = (booking: any) => {
    setSelectedBooking(booking);
    
    const startDate = new Date(booking.startTime);
    const endDate = new Date(booking.endTime);
    
    const startStr = `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`;
    const endStr = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;

    setRescheduleData({
      date: startDate.toISOString().split("T")[0],
      startTime: startStr,
      endTime: endStr,
    });
    setIsRescheduleModalOpen(true);
  };

  const handleSaveReschedule = async () => {
    if (!selectedBooking) return;
    
    const start = new Date(`${rescheduleData.date}T${rescheduleData.startTime}:00`);
    const end = new Date(`${rescheduleData.date}T${rescheduleData.endTime}:00`);

    if (end.getTime() <= start.getTime()) {
      toast.error("Waktu selesai bermain harus setelah waktu mulai");
      return;
    }

    try {
      await rescheduleBooking(selectedBooking.id, start, end);
      toast.success("Jadwal booking berhasil disesuaikan!");
      setIsRescheduleModalOpen(false);
      fetchData();
    } catch (e) {
      toast.error("Gagal melakukan reschedule");
    }
  };

  // Operations - Create Manual Booking
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createForm.userId) {
      toast.error("Silakan pilih pelanggan");
      return;
    }
    if (!createForm.courtId) {
      toast.error("Silakan pilih lapangan");
      return;
    }

    const start = new Date(`${createForm.date}T${createForm.startTime}:00`);
    const end = new Date(`${createForm.date}T${createForm.endTime}:00`);

    if (end.getTime() <= start.getTime()) {
      toast.error("Waktu selesai bermain harus setelah waktu mulai");
      return;
    }

    try {
      await createBooking({
        userId: createForm.userId,
        courtId: createForm.courtId,
        startTime: start,
        endTime: end,
        status: createForm.status,
        totalPrice: createForm.totalPrice,
        promoCode: createForm.promoCode || undefined,
      });

      toast.success("Booking manual berhasil dibuat!");
      setView("list");
      fetchData();
    } catch (err) {
      toast.error("Gagal membuat booking");
    }
  };

  // Filtering Logic
  const filteredBookings = bookings.filter((b) => {
    const userMatch = b.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      b.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const courtMatch = courtFilter === "ALL" || b.courtId === courtFilter;
    const statusMatch = statusFilter === "ALL" || b.status === statusFilter;

    return userMatch && courtMatch && statusMatch;
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
            Bookings Console
          </h2>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
            Kelola transaksi pemesanan lapangan, verifikasi pembayaran, ubah jadwal, dan buat order manual.
          </p>
        </div>

        {view === "list" ? (
          <Button
            onClick={() => setView("create")}
            className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-4 py-2.5 h-auto transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Booking Manual
          </Button>
        ) : (
          <Button
            onClick={() => setView("list")}
            variant="outline"
            className="border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs font-semibold"
          >
            Kembali ke Daftar
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-zinc-200 border-t-[#ccff00] animate-spin" />
          <p className="font-sans text-xs text-zinc-400 font-bold uppercase tracking-wider">Memuat Data Booking...</p>
        </div>
      ) : view === "create" ? (
        /* CREATE MANUAL BOOKING VIEW */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 max-w-xl mx-auto shadow-sm">
          <form onSubmit={handleCreateBooking} className="space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Buat Booking Lapangan Manual
              </h3>
              <p className="font-sans text-xs text-zinc-400">
                Pilih member, lapangan, dan jadwal bermain. Tagihan akan dibuat otomatis.
              </p>
            </div>

            {/* Select Customer */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Pilih Pelanggan</label>
              <CustomSelect
                searchable
                value={createForm.userId}
                onValueChange={(val) => setCreateForm({ ...createForm, userId: val })}
                options={customers.map((c) => ({
                  value: c.id,
                  label: `${c.name} (${c.email})`
                }))}
                placeholder="Pilih Pelanggan"
                className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
            </div>

            {/* Select Court */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Pilih Lapangan</label>
              <CustomSelect
                searchable
                value={createForm.courtId}
                onValueChange={(val) => setCreateForm({ ...createForm, courtId: val })}
                options={courts.map((court) => ({
                  value: court.id,
                  label: `${court.name} - Rp ${court.pricePerHour.toLocaleString("id-ID")} / jam`
                }))}
                placeholder="Pilih Lapangan"
                className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tanggal</label>
                <CustomDatePicker
                  value={createForm.date}
                  onChange={(val) => setCreateForm({ ...createForm, date: val })}
                  className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Mulai</label>
                <CustomSelect
                  value={createForm.startTime}
                  onValueChange={(val) => setCreateForm({ ...createForm, startTime: val })}
                  options={Array.from({ length: 16 }).map((_, i) => {
                    const h = i + 6;
                    const val = `${h.toString().padStart(2, "0")}:00`;
                    return { value: val, label: val };
                  })}
                  className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Selesai</label>
                <CustomSelect
                  value={createForm.endTime}
                  onValueChange={(val) => setCreateForm({ ...createForm, endTime: val })}
                  options={Array.from({ length: 16 }).map((_, i) => {
                    const h = i + 7;
                    const val = `${h.toString().padStart(2, "0")}:00`;
                    return { value: val, label: val };
                  })}
                  className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>
            </div>

            {/* Status & Promo code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status Awal</label>
                <CustomSelect
                  value={createForm.status}
                  onValueChange={(val) => setCreateForm({ ...createForm, status: val })}
                  options={[
                    { value: "CONFIRMED", label: "Langsung Konfirmasi (Paid)" },
                    { value: "PENDING", label: "Pending (Menunggu Bayar)" },
                  ]}
                  className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Kode Promo (Opsional)</label>
                <input
                  type="text"
                  value={createForm.promoCode}
                  onChange={(e) => setCreateForm({ ...createForm, promoCode: e.target.value.toUpperCase().trim() })}
                  placeholder="Contoh: ELITECLUB"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                />
              </div>
            </div>

            {/* Calculated Pricing Display */}
            <div className="bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-2xl p-5 flex justify-between items-center select-none">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#506600] dark:text-[#ccff00]">Estimasi Tagihan</p>
                <p className="text-zinc-500 text-[10px] mt-0.5">Dihitung otomatis berdasarkan durasi main.</p>
              </div>
              <p className="font-heading text-xl font-bold text-[#506600] dark:text-[#ccff00]">
                Rp {createForm.totalPrice.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setView("list")}
                className="border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs font-semibold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-6 transition-colors"
              >
                Buat Pemesanan
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* BOOKINGS LIST VIEW */
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari Pelanggan, Email, Booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00] text-zinc-800 dark:text-zinc-200"
              />
            </div>

            <div className="flex flex-wrap w-full md:w-auto gap-3 items-center">
              {/* Court filter */}
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-400 hidden sm:inline" />
                <CustomSelect
                  value={courtFilter}
                  onValueChange={setCourtFilter}
                  options={[
                    { value: "ALL", label: "Semua Lapangan" },
                    ...courts.map((c) => ({ value: c.id, label: c.name }))
                  ]}
                  className="h-[38px] text-xs py-1 px-3 rounded-xl min-w-[160px] border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-zinc-400 hidden sm:inline" />
                <CustomSelect
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  options={[
                    { value: "ALL", label: "Semua Status" },
                    { value: "PENDING", label: "PENDING" },
                    { value: "CONFIRMED", label: "CONFIRMED" },
                    { value: "CANCELLED", label: "CANCELLED" },
                    { value: "COMPLETED", label: "COMPLETED" },
                    { value: "EXPIRED", label: "EXPIRED" },
                  ]}
                  className="h-[38px] text-xs py-1 px-3 rounded-xl min-w-[140px] border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <Button
                onClick={() => toast.success("Mengekspor daftar booking...")}
                variant="outline"
                className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl px-3 py-2 h-auto text-xs font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Ekspor CSV
              </Button>
            </div>
          </div>

          {/* Bookings Table */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 border border-dashed rounded-3xl text-zinc-400">
              Tidak ada data booking yang sesuai dengan kriteria filter.
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                    <th className="py-4 px-4">Booking ID</th>
                    <th className="py-4 px-4">Pelanggan</th>
                    <th className="py-4 px-4">Lapangan</th>
                    <th className="py-4 px-4">Jadwal Main</th>
                    <th className="py-4 px-4">Total Biaya</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-800 dark:text-zinc-200">
                  {filteredBookings.map((booking) => {
                    const start = new Date(booking.startTime);
                    const end = new Date(booking.endTime);
                    const dateStr = start.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
                    const timeStr = `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")} - ${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`;
                    
                    return (
                      <tr key={booking.id} className="border-b border-zinc-100/50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-zinc-900 dark:text-white">
                          {booking.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#ccff00]/10 text-[#506600] dark:text-[#ccff00] font-bold flex items-center justify-center text-[10px]">
                              {booking.user.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold leading-none">{booking.user.name}</p>
                              <p className="text-[9px] text-zinc-400 mt-1">{booking.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold">
                          {booking.court.name}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold leading-none">{dateStr}</p>
                          <p className="text-[9px] text-zinc-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            {timeStr}
                          </p>
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold">
                          Rp {booking.totalPrice.toLocaleString("id-ID")}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            onClick={() => handleOpenStatusModal(booking)}
                            className={`cursor-pointer px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider select-none ${
                              booking.status === "CONFIRMED"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : booking.status === "PENDING"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : booking.status === "CANCELLED"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              onClick={() => handleOpenRescheduleModal(booking)}
                              variant="outline"
                              className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl p-2 w-8 h-8"
                              title="Reschedule Booking"
                            >
                              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            </Button>
                            <Button
                              onClick={() => handleOpenStatusModal(booking)}
                              variant="outline"
                              className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl p-2 w-8 h-8"
                              title="Ubah Status"
                            >
                              <Edit className="w-3.5 h-3.5 text-zinc-500" />
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

      {/* CHANGE STATUS MODAL */}
      <AnimatePresence>
        {isStatusModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl space-y-6 mx-4"
            >
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                  Ubah Status Pemesanan
                </h3>
                <p className="font-sans text-xs text-zinc-400">Ubah status booking ID: {selectedBooking.id}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-zinc-400">Pelanggan:</span><span className="font-bold">{selectedBooking.user.name}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Total Harga:</span><span className="font-bold font-mono">Rp {selectedBooking.totalPrice.toLocaleString("id-ID")}</span></div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Pilih Status Baru</label>
                  <CustomSelect
                    value={newStatus}
                    onValueChange={setNewStatus}
                    options={[
                      { value: "PENDING", label: "PENDING (Menunggu Pembayaran)" },
                      { value: "CONFIRMED", label: "CONFIRMED (Sudah Lunas / Disetujui)" },
                      { value: "CANCELLED", label: "CANCELLED (Dibatalkan)" },
                      { value: "COMPLETED", label: "COMPLETED (Selesai Bermain)" },
                      { value: "EXPIRED", label: "EXPIRED (Kadaluarsa)" },
                    ]}
                    className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs font-semibold"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveStatus}
                  className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-5"
                >
                  Simpan Status
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESCHEDULE MODAL */}
      <AnimatePresence>
        {isRescheduleModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl space-y-6 mx-4"
            >
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                  Reschedule Pemesanan
                </h3>
                <p className="font-sans text-xs text-zinc-400">Atur ulang tanggal dan jam booking ID: {selectedBooking.id}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tanggal Baru</label>
                  <CustomDatePicker
                    value={rescheduleData.date}
                    onChange={(val) => setRescheduleData({ ...rescheduleData, date: val })}
                    className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Jam Mulai</label>
                    <CustomSelect
                      value={rescheduleData.startTime}
                      onValueChange={(val) => setRescheduleData({ ...rescheduleData, startTime: val })}
                      options={Array.from({ length: 16 }).map((_, i) => {
                        const h = i + 6;
                        const val = `${h.toString().padStart(2, "0")}:00`;
                        return { value: val, label: val };
                      })}
                      className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Jam Selesai</label>
                    <CustomSelect
                      value={rescheduleData.endTime}
                      onValueChange={(val) => setRescheduleData({ ...rescheduleData, endTime: val })}
                      options={Array.from({ length: 16 }).map((_, i) => {
                        const h = i + 7;
                        const val = `${h.toString().padStart(2, "0")}:00`;
                        return { value: val, label: val };
                      })}
                      className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs font-semibold"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveReschedule}
                  className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-bold text-xs rounded-xl px-5"
                >
                  Simpan Jadwal
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
