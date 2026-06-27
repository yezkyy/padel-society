"use client";

import { useState } from "react";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  Download,
  RefreshCw,
  MoreVertical,
  Activity,
  Calendar,
  Users,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const chartData = [
  { name: "Mon", revenue: 15 },
  { name: "Tue", revenue: 18 },
  { name: "Wed", revenue: 14 },
  { name: "Thu", revenue: 22 },
  { name: "Fri", revenue: 28 },
  { name: "Sat", revenue: 35 },
  { name: "Sun", revenue: 30 },
];

export default function AdminDashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Data berhasil dimutakhirkan!");
    }, 800);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
            Dashboard Overview
          </h2>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
            Selamat datang kembali. Berikut ringkasan aktivitas operasional hari ini.
          </p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button
            onClick={() => toast.success("Mengekspor laporan CSV...")}
            variant="outline"
            className="border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Ekspor
          </Button>
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Revenue Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#ccff00]/10 rounded-xl text-[#506600] dark:text-[#ccff00]">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +12.5%
            </span>
          </div>
          <div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              Total Pendapatan
            </h3>
            <p className="font-heading text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              Rp 128.500.000
            </p>
          </div>
        </div>

        {/* Active Bookings Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full font-bold">
              Hari Ini
            </span>
          </div>
          <div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              Booking Aktif
            </h3>
            <p className="font-heading text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              42
            </p>
          </div>
        </div>

        {/* Occupancy Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#ccff00]/10 rounded-xl text-[#506600] dark:text-[#ccff00]">
              <Activity className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +5%
            </span>
          </div>
          <div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              Rasio Keterisian
            </h3>
            <p className="font-heading text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              85%
            </p>
          </div>
        </div>

        {/* New Members Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              +8
            </span>
          </div>
          <div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              Member Baru
            </h3>
            <p className="font-heading text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              12
            </p>
          </div>
        </div>
      </div>

      {/* Chart & Live Status Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Trends Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Tren Pendapatan
            </h3>
            <CustomSelect
              options={[
                { value: "7-hari", label: "7 Hari Terakhir" },
                { value: "30-hari", label: "30 Hari Terakhir" },
                { value: "tahun-ini", label: "Tahun Ini" },
              ]}
              defaultValue="7-hari"
              className="h-10 text-xs py-1 px-3 rounded-xl min-w-[150px] border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
            />
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ccff00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ccff00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#a1a1aa"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}M`}
                />
                <ChartTooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#506600"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Court Status */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Status Lapangan Live
            </h3>
            <button
              onClick={handleRefresh}
              className={`text-zinc-400 hover:text-black dark:hover:text-white transition-all ${
                isRefreshing ? "animate-spin text-black" : ""
              }`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            {/* Court 1 */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Court 1</span>
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold rounded-full mb-1">
                  Penuh
                </span>
                <p className="text-[10px] text-zinc-500 truncate">Budi Santoso</p>
                <p className="text-[9px] text-zinc-400">10:00 - 12:00</p>
              </div>
            </div>

            {/* Court 2 */}
            <div className="bg-[#ccff00]/10 rounded-2xl p-4 border border-[#ccff00]/25 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Court 2</span>
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-[#ccff00]/25 text-[#5b7300] text-[10px] font-bold rounded-full mb-1">
                  Tersedia
                </span>
                <p className="text-[9px] text-zinc-400 mt-1">Next: 14:00</p>
              </div>
            </div>

            {/* Court 3 */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Court 3</span>
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold rounded-full mb-1">
                  Penuh
                </span>
                <p className="text-[10px] text-zinc-500 truncate">Siska Dwi</p>
                <p className="text-[9px] text-zinc-400">11:00 - 12:30</p>
              </div>
            </div>

            {/* Court 4 */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl p-4 flex flex-col justify-between opacity-60">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Court 4</span>
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-rose-500/10 text-rose-600 text-[10px] font-bold rounded-full mb-1">
                  Maintenance
                </span>
                <p className="text-[9px] text-zinc-400 mt-1">Hingga Besok</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Booking Terbaru
          </h3>
          <Button
            onClick={() => toast.success("Menampilkan semua data transaksi booking...")}
            variant="link"
            className="text-[#506600] dark:text-[#ccff00] font-semibold text-sm p-0 h-auto"
          >
            Lihat Semua
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 pb-4">
                <th className="py-4 px-4 font-semibold">Pelanggan</th>
                <th className="py-4 px-4 font-semibold">Lapangan</th>
                <th className="py-4 px-4 font-semibold">Jadwal Bermain</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-zinc-800 dark:text-zinc-200">
              <tr className="border-b border-zinc-100/50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="py-4 px-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold">
                    JD
                  </div>
                  <span>John Doe</span>
                </td>
                <td className="py-4 px-4">Court 1</td>
                <td className="py-4 px-4">Hari Ini, 14:00 - 15:30</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[9px]">
                    Confirmed
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="text-zinc-400 hover:text-black dark:hover:text-white p-2">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              <tr className="border-b border-zinc-100/50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                <td className="py-4 px-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold">
                    AS
                  </div>
                  <span>Ayu Sekar</span>
                </td>
                <td className="py-4 px-4">Court 2</td>
                <td className="py-4 px-4">Hari Ini, 16:00 - 18:00</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-[9px]">
                    Pending
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="text-zinc-400 hover:text-black dark:hover:text-white p-2">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
