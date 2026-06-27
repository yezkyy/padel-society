"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  Users2,
  ShieldAlert,
  UserCog,
  History,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  UserMinus,
  UserPlus,
  Lock,
  Unlock,
  Key,
  Info,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getAllUsers,
  updateUserRole,
  getActivityLogs,
} from "../actions";

export default function AdminCustomersPage() {
  const [activeTab, setActiveTab] = useState<"customers" | "staff" | "rbac" | "logs">("customers");
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Dialog State
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState("MEMBER");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const uList = await getAllUsers();
      const logList = await getActivityLogs();
      setUsers(uList);
      setLogs(logList);
    } catch (e) {
      toast.error("Gagal mengambil data user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenRoleModal = (userObj: any) => {
    setSelectedUser(userObj);
    setNewRole(userObj.role);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    try {
      await updateUserRole(selectedUser.id, newRole);
      toast.success(`Role untuk ${selectedUser.name} berhasil diperbarui menjadi ${newRole}`);
      setIsRoleModalOpen(false);
      loadData();
    } catch (e) {
      toast.error("Gagal memperbarui role");
    }
  };

  const handleToggleBlock = async (userObj: any) => {
    const isBlocked = userObj.role === "BLOCKED";
    const targetRole = isBlocked ? "MEMBER" : "BLOCKED";
    const confirmMessage = isBlocked
      ? `Apakah Anda yakin ingin membuka blokir akun ${userObj.name}?`
      : `Apakah Anda yakin ingin memblokir akun ${userObj.name}? Pengguna ini tidak akan dapat login atau melakukan booking.`;

    if (confirm(confirmMessage)) {
      try {
        await updateUserRole(userObj.id, targetRole);
        toast.success(isBlocked ? "Blokir akun dibuka!" : "Akun berhasil diblokir!");
        loadData();
      } catch (e) {
        toast.error("Gagal mengubah status blokir");
      }
    }
  };

  // Filter lists
  const members = users.filter((u) => u.role === "MEMBER" || u.role === "BLOCKED");
  const staff = users.filter((u) => u.role === "ADMIN" || u.role === "OPERATOR");

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.phone && m.phone.includes(searchTerm));
    
    const matchRole = roleFilter === "ALL" || m.role === roleFilter;

    return matchSearch && matchRole;
  });

  const filteredStaff = staff.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
            User Hub & Security
          </h2>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
            Kelola database pelanggan, user roles (RBAC), staf operator, dan audit log aktivitas sistem.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl flex gap-1 self-start sm:self-auto border border-zinc-200/50 dark:border-zinc-800/50">
          <button
            onClick={() => { setActiveTab("customers"); setSearchTerm(""); }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "customers"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            Pelanggan
          </button>
          <button
            onClick={() => { setActiveTab("staff"); setSearchTerm(""); }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "staff"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <UserCog className="w-3.5 h-3.5" />
            Internal Staf
          </button>
          <button
            onClick={() => setActiveTab("rbac")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "rbac"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Hak Akses
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "logs"
                ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Audit Log
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-zinc-200 border-t-[#ccff00] animate-spin" />
          <p className="font-sans text-xs text-zinc-400 font-bold uppercase tracking-wider">Memuat Data User...</p>
        </div>
      ) : (
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* TAB 1: PELANGGAN DATABASE */}
          {activeTab === "customers" && (
            <div className="space-y-6">
              {/* Search bar */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Cari Nama Pelanggan, Email, No.HP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ccff00] text-zinc-800 dark:text-zinc-200"
                  />
                </div>

                <div className="flex gap-2 items-center w-full md:w-auto">
                  <Filter className="w-4 h-4 text-zinc-400 hidden sm:inline" />
                  <CustomSelect
                    value={roleFilter}
                    onValueChange={setRoleFilter}
                    options={[
                      { value: "ALL", label: "Semua Tipe Akun" },
                      { value: "MEMBER", label: "MEMBER AKTIF" },
                      { value: "BLOCKED", label: "BLOCKED / DIBAN" },
                    ]}
                    className="h-10 text-xs py-1 px-3 rounded-xl min-w-[170px] border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
              </div>

              {/* Customers table */}
              {filteredMembers.length === 0 ? (
                <div className="text-center py-20 border border-dashed rounded-3xl text-zinc-400">
                  Tidak ada data pelanggan yang cocok dengan kriteria filter.
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 overflow-x-auto shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                        <th className="py-4 px-4">Nama Pelanggan</th>
                        <th className="py-4 px-4">Email</th>
                        <th className="py-4 px-4">No. HP</th>
                        <th className="py-4 px-4 text-center">Status Keanggotaan</th>
                        <th className="py-4 px-4 text-right">Aksi Akun</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-800 dark:text-zinc-200">
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="border-b border-zinc-100/50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white">
                            {member.name}
                          </td>
                          <td className="py-4 px-4 font-mono">{member.email}</td>
                          <td className="py-4 px-4 font-mono">{member.phone || "-"}</td>
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                                member.role === "BLOCKED"
                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              }`}
                            >
                              {member.role === "BLOCKED" ? "Blocked" : "Active Member"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                onClick={() => handleOpenRoleModal(member)}
                                variant="outline"
                                className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl p-2 text-[10px] font-bold h-8"
                              >
                                Ubah Role
                              </Button>
                              <Button
                                onClick={() => handleToggleBlock(member)}
                                variant="outline"
                                className={`border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-[10px] font-bold h-8 ${
                                  member.role === "BLOCKED"
                                    ? "hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600"
                                    : "hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600"
                                }`}
                              >
                                {member.role === "BLOCKED" ? (
                                  <>
                                    <Unlock className="w-3.5 h-3.5 mr-1 inline" />
                                    Buka Blokir
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3.5 h-3.5 mr-1 inline" />
                                    Blokir
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STAFF & ADMIN CRUD */}
          {activeTab === "staff" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Daftar Pengguna Internal / Operator
                </h3>
              </div>

              {filteredStaff.length === 0 ? (
                <div className="text-center py-20 border border-dashed rounded-3xl text-zinc-400">
                  Tidak ada data staf internal.
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 overflow-x-auto shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                        <th className="py-4 px-4">Nama Staf</th>
                        <th className="py-4 px-4">Email</th>
                        <th className="py-4 px-4">Tingkat Jabatan (Role)</th>
                        <th className="py-4 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-800 dark:text-zinc-200">
                      {filteredStaff.map((s) => (
                        <tr key={s.id} className="border-b border-zinc-100/50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white">
                            {s.name}
                          </td>
                          <td className="py-4 px-4 font-mono">{s.email}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black font-mono font-bold tracking-wider text-[9px]">
                              {s.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button
                              onClick={() => handleOpenRoleModal(s)}
                              variant="outline"
                              className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl p-2 text-[10px] font-bold h-8"
                            >
                              Ganti Role / Staf
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RBAC MATRIX */}
          {activeTab === "rbac" && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Matriks Hak Akses (Role-Based Access Control)
                </h3>
                <p className="font-sans text-xs text-zinc-400">
                  Berikut detail matrix izin akses untuk masing-masing level user role di Padel Society.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="py-4 px-4">Izin Akses (Permissions)</th>
                      <th className="py-4 px-4 text-center">ADMIN</th>
                      <th className="py-4 px-4 text-center">OPERATOR</th>
                      <th className="py-4 px-4 text-center">MEMBER</th>
                      <th className="py-4 px-4 text-center">BLOCKED</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-800 dark:text-zinc-200 font-semibold">
                    <tr className="border-b border-zinc-100/50 dark:border-zinc-800/50">
                      <td className="py-4 px-4">Manajemen booking & checkouts</td>
                      <td className="py-4 px-4 text-center text-emerald-500 font-bold">YES</td>
                      <td className="py-4 px-4 text-center text-emerald-500 font-bold">YES</td>
                      <td className="py-4 px-4 text-center text-zinc-400">NO</td>
                      <td className="py-4 px-4 text-center text-zinc-400">NO</td>
                    </tr>
                    <tr className="border-b border-zinc-100/50 dark:border-zinc-800/50">
                      <td className="py-4 px-4">Ubah tarif, block jadwal & edit promo</td>
                      <td className="py-4 px-4 text-center text-emerald-500 font-bold">YES</td>
                      <td className="py-4 px-4 text-center text-zinc-400">NO</td>
                      <td className="py-4 px-4 text-center text-zinc-400">NO</td>
                      <td className="py-4 px-4 text-center text-zinc-400">NO</td>
                    </tr>
                    <tr className="border-b border-zinc-100/50 dark:border-zinc-800/50">
                      <td className="py-4 px-4">Akses database pelanggan & log audit</td>
                      <td className="py-4 px-4 text-center text-emerald-500 font-bold">YES</td>
                      <td className="py-4 px-4 text-center text-emerald-500 font-bold">YES</td>
                      <td className="py-4 px-4 text-center text-zinc-400">NO</td>
                      <td className="py-4 px-4 text-center text-zinc-400">NO</td>
                    </tr>
                    <tr className="border-b border-zinc-100/50 dark:border-zinc-800/50">
                      <td className="py-4 px-4">Mendaftar event & booking lapangan publik</td>
                      <td className="py-4 px-4 text-center text-emerald-500 font-bold">YES</td>
                      <td className="py-4 px-4 text-center text-emerald-500 font-bold">YES</td>
                      <td className="py-4 px-4 text-center text-emerald-500 font-bold">YES</td>
                      <td className="py-4 px-4 text-center text-zinc-400">NO (Banned)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT LOG */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Log Audit Aktivitas Sistem
                </h3>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="py-4 px-4">Waktu</th>
                      <th className="py-4 px-4">Pengguna</th>
                      <th className="py-4 px-4">Tindakan (Action)</th>
                      <th className="py-4 px-4">Objek</th>
                      <th className="py-4 px-4">IP Address</th>
                      <th className="py-4 px-4">Deskripsi</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-800 dark:text-zinc-200">
                    {logs.map((log) => {
                      const date = new Date(log.timestamp).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <tr key={log.id} className="border-b border-zinc-100/50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                          <td className="py-4 px-4 text-zinc-500 flex items-center gap-1.5 font-mono">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            {date}
                          </td>
                          <td className="py-4 px-4 font-bold">{log.userId}</td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-zinc-500">
                            {log.entityType} ({log.entityId})
                          </td>
                          <td className="py-4 px-4 font-mono">{log.ipAddress}</td>
                          <td className="py-4 px-4 max-w-xs truncate" title={log.description}>
                            {log.description}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* CHANGE ROLE MODAL */}
      <AnimatePresence>
        {isRoleModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl space-y-6 mx-4"
            >
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                  Ubah Level Jabatan (Role)
                </h3>
                <p className="font-sans text-xs text-zinc-400">Sesuaikan hak akses akun: {selectedUser.name}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-zinc-400">Email:</span><span className="font-bold">{selectedUser.email}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Role Saat Ini:</span><span className="font-bold">{selectedUser.role}</span></div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Pilih Role Baru</label>
                  <CustomSelect
                    value={newRole}
                    onValueChange={setNewRole}
                    options={[
                      { value: "MEMBER", label: "MEMBER (Pengguna Umum)" },
                      { value: "OPERATOR", label: "OPERATOR (Pengelola Lapangan / CS)" },
                      { value: "ADMIN", label: "ADMIN (Pemilik / Super Admin)" },
                      { value: "BLOCKED", label: "BLOCKED (Dibanned / Kunci Akun)" },
                    ]}
                    className="h-10 text-xs py-1 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="border-zinc-200 dark:border-zinc-800 rounded-xl px-4 text-xs font-semibold"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveRole}
                  className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-bold text-xs rounded-xl px-5"
                >
                  Simpan Role
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
