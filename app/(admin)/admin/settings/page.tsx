"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  Globe,
  BookOpen,
  Trophy,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  Plus,
  Trash2,
  Edit2,
  Check,
  Calendar,
  DollarSign,
  UserCheck,
  Eye,
  EyeOff,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getGallery,
  addToGallery,
  removeFromGallery,
  getTestimonials,
  toggleTestimonialVisibility,
  getFaqs,
  createFaq,
  deleteFaq,
} from "../actions";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "blogs" | "events" | "gallery" | "testimonials" | "reports">("general");
  const [isLoading, setIsLoading] = useState(true);

  // Content state variables
  const [events, setEvents] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  // General Settings Form state
  const [generalForm, setGeneralForm] = useState({
    siteName: "Padel Society",
    siteDescription: "Premium Padel Court Booking & Corporate Club",
    address: "Canggu, Bali / Jakarta Barat",
    phone: "0812-3456-7890",
    email: "info@padelsociety.com",
    instagram: "https://instagram.com/padelsociety",
    facebook: "https://facebook.com/padelsociety",
  });

  // Modal controls
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  // Gallery URL add state
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryCaption, setNewGalleryCaption] = useState("");

  // Forms
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    quota: 20,
    registrationFee: 0,
    status: "UPCOMING",
  });

  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    status: "DRAFT",
  });

  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "Umum",
    order: 1,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const eList = await getEvents();
      const bList = await getBlogs();
      const gList = await getGallery();
      const tList = await getTestimonials();
      const fList = await getFaqs();

      setEvents(eList);
      setBlogs(bList);
      setGallery(gList);
      setTestimonials(tList);
      setFaqs(fList);
    } catch (e) {
      toast.error("Gagal memuat konfigurasi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pengaturan website berhasil disimpan!");
  };

  // Event handlers
  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: "",
      description: "",
      location: "",
      date: new Date().toISOString().split("T")[0] + "T09:00",
      quota: 20,
      registrationFee: 0,
      status: "UPCOMING",
    });
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: any) => {
    setEditingEvent(evt);
    const dateObj = new Date(evt.date);
    const dateStr = `${dateObj.toISOString().split("T")[0]}T${dateObj.toTimeString().split(" ")[0].substring(0, 5)}`;
    setEventForm({
      title: evt.title,
      description: evt.description,
      location: evt.location,
      date: dateStr,
      quota: evt.quota,
      registrationFee: evt.registrationFee,
      status: evt.status,
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...eventForm,
        date: new Date(eventForm.date),
      };
      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
        toast.success("Event berhasil diupdate");
      } else {
        await createEvent(payload);
        toast.success("Event baru berhasil ditambahkan");
      }
      setIsEventModalOpen(false);
      loadData();
    } catch (err) {
      toast.error("Gagal menyimpan event");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      try {
        await deleteEvent(id);
        toast.success("Event terhapus");
        loadData();
      } catch (err) {
        toast.error("Gagal menghapus event");
      }
    }
  };

  // Blog handlers
  const handleOpenAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: "",
      content: "",
      excerpt: "",
      status: "DRAFT",
    });
    setIsBlogModalOpen(true);
  };

  const handleOpenEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || "",
      status: blog.status,
    });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await updateBlog(editingBlog.id, blogForm);
        toast.success("Artikel berhasil diperbarui");
      } else {
        await createBlog({ ...blogForm, authorId: "usr-admin-1" });
        toast.success("Artikel baru berhasil diterbitkan");
      }
      setIsBlogModalOpen(false);
      loadData();
    } catch (err) {
      toast.error("Gagal menyimpan artikel");
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      try {
        await deleteBlog(id);
        toast.success("Artikel dihapus");
        loadData();
      } catch (e) {
        toast.error("Gagal menghapus artikel");
      }
    }
  };

  // Gallery handlers
  const handleAddGallery = async () => {
    if (!newGalleryUrl.trim()) return;
    try {
      await addToGallery({
        mediaType: "IMAGE",
        url: newGalleryUrl,
        caption: newGalleryCaption,
      });
      toast.success("Media berhasil ditambahkan ke galeri");
      setNewGalleryUrl("");
      setNewGalleryCaption("");
      loadData();
    } catch (e) {
      toast.error("Gagal menambahkan media");
    }
  };

  const handleRemoveGallery = async (id: string) => {
    try {
      await removeFromGallery(id);
      toast.success("Media dihapus dari galeri");
      loadData();
    } catch (e) {
      toast.error("Gagal menghapus media");
    }
  };

  // Testimonials
  const handleToggleTestimonial = async (id: string) => {
    try {
      await toggleTestimonialVisibility(id);
      toast.success("Status visibilitas testimoni dirubah");
      loadData();
    } catch (e) {
      toast.error("Gagal mengubah visibilitas");
    }
  };

  // FAQ
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFaq(faqForm);
      toast.success("FAQ berhasil ditambahkan");
      setIsFaqModalOpen(false);
      loadData();
    } catch (err) {
      toast.error("Gagal membuat FAQ");
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await deleteFaq(id);
      toast.success("FAQ berhasil dihapus");
      loadData();
    } catch (err) {
      toast.error("Gagal menghapus FAQ");
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
            System & Content Manager
          </h2>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
            Atur profil publik, artikel blog, kegiatan event, media galeri, serta pantau laporan keuangan.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl flex flex-wrap gap-1 self-start sm:self-auto border border-zinc-200/50 dark:border-zinc-800/50">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "general"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Website
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "blogs"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Blog
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "events"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Events
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "gallery"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            FAQ & Galeri
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "testimonials"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Testimoni
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "reports"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Laporan
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-zinc-200 border-t-[#ccff00] animate-spin" />
          <p className="font-sans text-xs text-zinc-400 font-bold uppercase tracking-wider">Memuat Data CMS...</p>
        </div>
      ) : (
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* TAB 1: WEBSITE SETTINGS */}
          {activeTab === "general" && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 max-w-2xl mx-auto shadow-sm">
              <form onSubmit={handleSaveGeneral} className="space-y-8">
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Informasi Profil Website
                  </h3>
                  <p className="font-sans text-xs text-zinc-400">
                    Atur nama perusahaan, deskripsi branding, kontak dan social media.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Nama Website</label>
                      <input
                        type="text"
                        value={generalForm.siteName}
                        onChange={(e) => setGeneralForm({ ...generalForm, siteName: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Branding Subtitle</label>
                      <input
                        type="text"
                        value={generalForm.siteDescription}
                        onChange={(e) => setGeneralForm({ ...generalForm, siteDescription: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Alamat Club</label>
                    <input
                      type="text"
                      value={generalForm.address}
                      onChange={(e) => setGeneralForm({ ...generalForm, address: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">No. HP Kontak</label>
                      <input
                        type="text"
                        value={generalForm.phone}
                        onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email Utama</label>
                      <input
                        type="email"
                        value={generalForm.email}
                        onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Link Instagram</label>
                      <input
                        type="text"
                        value={generalForm.instagram}
                        onChange={(e) => setGeneralForm({ ...generalForm, instagram: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Link Facebook</label>
                      <input
                        type="text"
                        value={generalForm.facebook}
                        onChange={(e) => setGeneralForm({ ...generalForm, facebook: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-6 py-3 h-auto"
                  >
                    Simpan Pengaturan
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: BLOG MANAGER */}
          {activeTab === "blogs" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Pengelolaan Artikel Komunitas
                </h3>
                <Button
                  onClick={handleOpenAddBlog}
                  className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-4 py-2.5 h-auto flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tulis Artikel Baru
                </Button>
              </div>

              {blogs.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-3xl text-zinc-400">
                  Belum ada artikel yang diposting.
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 overflow-x-auto shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-4 px-4">Judul Artikel</th>
                        <th className="py-4 px-4">Ringkasan (Excerpt)</th>
                        <th className="py-4 px-4">Tanggal Rilis</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-800 dark:text-zinc-200">
                      {blogs.map((b) => {
                        const dateStr = b.publishedAt
                          ? new Date(b.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                          : "Draft";
                        return (
                          <tr key={b.id} className="border-b border-zinc-100/50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                            <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white max-w-xs truncate">
                              {b.title}
                            </td>
                            <td className="py-4 px-4 text-zinc-400 max-w-xs truncate">{b.excerpt || "-"}</td>
                            <td className="py-4 px-4 text-zinc-500 font-mono">{dateStr}</td>
                            <td className="py-4 px-4 text-center">
                              <span
                                className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                                  b.status === "PUBLISHED"
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <Button
                                  onClick={() => handleOpenEditBlog(b)}
                                  variant="outline"
                                  className="border-zinc-200 dark:border-zinc-800 rounded-xl p-2 w-8 h-8"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-zinc-500" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteBlog(b.id)}
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

          {/* TAB 3: EVENTS CRUD */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Daftar Event & Turnamen
                </h3>
                <Button
                  onClick={handleOpenAddEvent}
                  className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-4 py-2.5 h-auto flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Buat Event Baru
                </Button>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-3xl text-zinc-400">
                  Belum ada event yang didaftarkan.
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 overflow-x-auto shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-4 px-4">Nama Event</th>
                        <th className="py-4 px-4">Lokasi</th>
                        <th className="py-4 px-4">Tanggal Kegiatan</th>
                        <th className="py-4 px-4 text-center">Pendaftar / Kuota</th>
                        <th className="py-4 px-4">Biaya Registrasi</th>
                        <th className="py-4 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-800 dark:text-zinc-200">
                      {events.map((evt) => {
                        const dateStr = new Date(evt.date).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        return (
                          <tr key={evt.id} className="border-b border-zinc-100/50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                            <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white">
                              {evt.title}
                            </td>
                            <td className="py-4 px-4 text-zinc-500">{evt.location}</td>
                            <td className="py-4 px-4 font-mono">{dateStr}</td>
                            <td className="py-4 px-4 text-center font-bold font-mono">
                              {evt.registrationsCount} / {evt.quota}
                            </td>
                            <td className="py-4 px-4 font-mono">
                              {evt.registrationFee === 0 ? "FREE" : `Rp ${evt.registrationFee.toLocaleString("id-ID")}`}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <Button
                                  onClick={() => handleOpenEditEvent(evt)}
                                  variant="outline"
                                  className="border-zinc-200 dark:border-zinc-800 rounded-xl p-2 w-8 h-8"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-zinc-500" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteEvent(evt.id)}
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

          {/* TAB 4: FAQ & GALLERY MEDIA */}
          {activeTab === "gallery" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Gallery Section */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 space-y-6">
                <div>
                  <h3 className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50">
                    Galeri Foto Klub Padel
                  </h3>
                  <p className="font-sans text-[10px] text-zinc-400 uppercase font-bold tracking-widest mt-0.5">Media Library</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan URL Gambar..."
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Caption..."
                    value={newGalleryCaption}
                    onChange={(e) => setNewGalleryCaption(e.target.value)}
                    className="w-28 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none"
                  />
                  <Button
                    onClick={handleAddGallery}
                    className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black font-bold text-xs rounded-xl px-4 h-auto"
                  >
                    Tambah
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {gallery.map((g) => (
                    <div key={g.id} className="relative group rounded-xl overflow-hidden aspect-video border border-zinc-100 dark:border-zinc-800">
                      <img src={g.url} alt={g.caption || "gallery"} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          onClick={() => handleRemoveGallery(g.id)}
                          className="p-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs Section */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50">
                      Kelola Pertanyaan FAQ
                    </h3>
                    <p className="font-sans text-[10px] text-zinc-400 uppercase font-bold tracking-widest mt-0.5">Accordion FAQs</p>
                  </div>
                  <Button
                    onClick={() => setIsFaqModalOpen(true)}
                    className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-3 py-1.5 h-auto"
                  >
                    Tambah FAQ
                  </Button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {faqs.map((f) => (
                    <div key={f.id} className="pt-3 flex justify-between items-start gap-4">
                      <div>
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{f.question}</p>
                        <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{f.answer}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteFaq(f.id)}
                        className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TESTIMONI VISIBILITY */}
          {activeTab === "testimonials" && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Moderat Testimoni Pengguna
                  </h3>
                  <p className="font-sans text-xs text-zinc-400">Tampilkan atau sembunyikan ulasan pelanggan di halaman publik.</p>
                </div>
              </div>

              <div className="space-y-4">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5 rounded-2xl flex justify-between items-start shadow-sm"
                  >
                    <div className="space-y-2 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{t.user?.name || "Budi Santoso"}</span>
                        <div className="flex gap-0.5 text-amber-500">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <span key={i} className="text-xs">★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        "{t.content}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleTestimonial(t.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider transition-all uppercase flex items-center gap-1.5 ${
                        t.isVisible
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                          : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200 dark:bg-zinc-800"
                      }`}
                    >
                      {t.isVisible ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Hidden
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS & EXPORTS */}
          {activeTab === "reports" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
                <div>
                  <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Ekspor Laporan & Statistik
                  </h3>
                  <p className="font-sans text-xs text-zinc-400">Unduh data keuangan dan booking dalam format spreadsheet.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
                    <span className="text-xs font-bold">Laporan Pendapatan (Bulanan)</span>
                    <Button
                      onClick={() => toast.success("Mengekspor laporan keuangan bulanan...")}
                      className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black text-[10px] font-bold h-8 rounded-lg"
                    >
                      Unduh CSV
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
                    <span className="text-xs font-bold">Laporan Okupansi Lapangan</span>
                    <Button
                      onClick={() => toast.success("Mengekspor laporan occupancy...")}
                      className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black text-[10px] font-bold h-8 rounded-lg"
                    >
                      Unduh CSV
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
                    <span className="text-xs font-bold">Daftar Pendaftar Turnamen</span>
                    <Button
                      onClick={() => toast.success("Mengekspor data pendaftar event...")}
                      className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black text-[10px] font-bold h-8 rounded-lg"
                    >
                      Unduh CSV
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick stats billing overview */}
              <div className="bg-zinc-950 text-white border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col justify-between h-full">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#ccff00]">Billing Hub</p>
                  <h4 className="font-heading text-2xl font-bold mt-2">Ringkasan Bulan Ini</h4>
                </div>

                <div className="my-6 space-y-4 font-sans text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-400">Total Transaksi</span>
                    <span className="font-bold">142 Booking</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-400">Pemakaian Promo</span>
                    <span className="font-bold">28 Kali</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Registrasi Event</span>
                    <span className="font-bold">30 Peserta</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-zinc-400">Estimasi Pendapatan:</span>
                  <span className="font-heading text-lg font-bold text-[#ccff00]">Rp 28.400.000</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* EVENT ADD/EDIT MODAL */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6 mx-4"
            >
              <div>
                <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {editingEvent ? "Edit Event" : "Buat Event Baru"}
                </h3>
                <p className="font-sans text-xs text-zinc-400">Isi detail event / turnamen Padel Society.</p>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Nama Event / Turnamen</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="Contoh: Padel Society Open 2026"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Deskripsi Event</label>
                  <textarea
                    required
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Jelaskan detail regulasi, hadiah, dll."
                    rows={3}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Lokasi</label>
                    <input
                      type="text"
                      required
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder="Canggu / Jakarta"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tanggal & Waktu</label>
                    <input
                      type="datetime-local"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Kuota Peserta</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={eventForm.quota}
                      onChange={(e) => setEventForm({ ...eventForm, quota: parseInt(e.target.value) })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Biaya Pendaftaran (Rp)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={eventForm.registrationFee}
                      onChange={(e) => setEventForm({ ...eventForm, registrationFee: parseInt(e.target.value) })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status</label>
                  <CustomSelect
                    value={eventForm.status}
                    onValueChange={(val) => setEventForm({ ...eventForm, status: val })}
                    options={[
                      { value: "UPCOMING", label: "Upcoming" },
                      { value: "ONGOING", label: "Ongoing" },
                      { value: "COMPLETED", label: "Completed" },
                      { value: "CANCELLED", label: "Cancelled" },
                    ]}
                    className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEventModalOpen(false)}
                    className="border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs font-semibold"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-5"
                  >
                    Simpan Event
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BLOG ADD/EDIT MODAL */}
      <AnimatePresence>
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl space-y-6 mx-4"
            >
              <div>
                <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {editingBlog ? "Edit Artikel" : "Tulis Artikel Baru"}
                </h3>
                <p className="font-sans text-xs text-zinc-400">Bagikan update dan tips komunitas.</p>
              </div>

              <form onSubmit={handleSaveBlog} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Judul Artikel</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="Masukkan judul menarik..."
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Ringkasan Singkat (Excerpt)</label>
                  <input
                    type="text"
                    required
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    placeholder="Garis besar isi artikel untuk preview card..."
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Konten Utama</label>
                  <textarea
                    required
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    placeholder="Tulis artikel lengkap Anda di sini..."
                    rows={6}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-semibold">Status Penerbitan</label>
                  <CustomSelect
                    value={blogForm.status}
                    onValueChange={(val) => setBlogForm({ ...blogForm, status: val })}
                    options={[
                      { value: "DRAFT", label: "Draft (Simpan Sementara)" },
                      { value: "PUBLISHED", label: "Published (Terbitkan Publik)" },
                    ]}
                    className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsBlogModalOpen(false)}
                    className="border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs font-semibold"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-5"
                  >
                    Terbitkan Artikel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FAQ ADD MODAL */}
      <AnimatePresence>
        {isFaqModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl space-y-6 mx-4"
            >
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                  Tambah FAQ Baru
                </h3>
                <p className="font-sans text-xs text-zinc-400">Pertanyaan umum halaman FAQ.</p>
              </div>

              <form onSubmit={handleSaveFaq} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Pertanyaan</label>
                  <input
                    type="text"
                    required
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Jawaban</label>
                  <textarea
                    required
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    rows={3}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFaqModalOpen(false)}
                    className="border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs font-semibold"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-5"
                  >
                    Simpan FAQ
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
