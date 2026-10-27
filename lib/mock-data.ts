// Centralized Mock Data for Demo & Static Mode (no database required)

export const isDatabaseConfigured = Boolean(
  process.env.DATABASE_URL &&
    (process.env.NODE_ENV !== "production" || !process.env.DATABASE_URL.includes("localhost"))
);

export interface MockCourt {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  status: "ACTIVE" | "MAINTENANCE";
  imageUrl?: string;
  location?: string;
  type?: "Indoor" | "Outdoor";
}

export const MOCK_COURTS: MockCourt[] = [
  {
    id: "court-1",
    name: "Court 1 (Indoor)",
    description: "Lapangan indoor premium dengan pencahayaan LED standar turnamen internasional, lantai karpet WPT (World Padel Tour), dan ruang ber-AC yang nyaman.",
    pricePerHour: 200000,
    status: "ACTIVE",
    imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop",
    location: "Senayan, Jakarta Selatan",
    type: "Indoor",
  },
  {
    id: "court-2",
    name: "Court 2 (Indoor)",
    description: "Lapangan indoor berstandar turnamen dengan ceiling tinggi untuk lob shot optimal dan ventilasi udara modern yang menyegarkan.",
    pricePerHour: 200000,
    status: "ACTIVE",
    imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop",
    location: "Senayan, Jakarta Selatan",
    type: "Indoor",
  },
  {
    id: "court-3",
    name: "Court 3 (Outdoor)",
    description: "Lapangan outdoor premium dengan pemandangan terbuka dan asri. Dilengkapi lampu sorot anti-silau khusus malam hari.",
    pricePerHour: 150000,
    status: "ACTIVE",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
    location: "Canggu, Bali",
    type: "Outdoor",
  },
  {
    id: "court-4",
    name: "Court 4 (Outdoor)",
    description: "Lapangan outdoor dengan permukaan bantalan anti-slip tingkat tinggi, cocok untuk latihan rutin dan pertandingan santai.",
    pricePerHour: 150000,
    status: "ACTIVE",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
    location: "Senayan, Jakarta Selatan",
    type: "Outdoor",
  },
];

export const MOCK_MEMBERSHIP_PLANS = [
  {
    id: "plan-starter",
    name: "Starter Pack",
    description: "Cocok untuk pemula yang ingin bermain santai bersama teman dan menikmati diskon rutin.",
    price: 150000,
    durationDays: 30,
    benefits: [
      "Diskon booking lapangan 10%",
      "Prioritas booking slot H-3",
      "Akses grup komunitas Padel Society",
      "Diskon 5% untuk pembelian di Pro Shop",
    ],
    priorityLevel: 1,
  },
  {
    id: "plan-elite",
    name: "Elite Pro",
    description: "Untuk pemain setia dan antusias dengan prioritas slot maksimal dan akses event eksklusif.",
    price: 500000,
    durationDays: 30,
    benefits: [
      "Diskon booking lapangan 20%",
      "Prioritas booking slot H-7 sebelum umum",
      "Akses eksklusif turnamen & gathering member",
      "Gratis sewa raket premium 2x/bulan",
      "Diskon 15% untuk Pro Shop & merchandise",
      "Loker pribadi gratis di clubhouse",
    ],
    priorityLevel: 2,
  },
];

export const MOCK_FAQS = [
  {
    id: "faq-1",
    question: "Bagaimana cara melakukan booking lapangan?",
    answer: "Anda cukup memilih lapangan yang diinginkan di halaman 'Lapangan' atau 'Booking', pilih tanggal dan jam yang tersedia, lalu selesaikan pembayaran. Slot Anda akan terkunci otomatis secara real-time.",
    category: "Booking",
  },
  {
    id: "faq-2",
    question: "Apakah tersedia penyewaan raket dan bola?",
    answer: "Tentu! Kami menyediakan penyewaan raket padel premium (Babolat, Bullpadel, Nox) seharga Rp 35.000 per sesi. Bola baru dan minuman isotonik juga tersedia di Pro Shop kami.",
    category: "Fasilitas",
  },
  {
    id: "faq-3",
    question: "Bagaimana kebijakan pembatalan dan reschedule?",
    answer: "Reschedule dapat dilakukan maksimal H-4 jam sebelum jadwal bermain (1x kesempatan). Pembatalan dapat dilakukan maksimal H-6 jam sebelum sesi dimulai dengan pengembalian dana dipotong biaya admin 10%.",
    category: "Kebijakan",
  },
  {
    id: "faq-4",
    question: "Metode pembayaran apa saja yang didukung?",
    answer: "Kami menerima pembayaran instan melalui QRIS (GoPay, OVO, Dana, ShopeePay, BCA, dll.), Virtual Account Bank (BCA, Mandiri, BRI, BNI), serta Kartu Kredit/Debit.",
    category: "Pembayaran",
  },
];

export const MOCK_EVENTS = [
  {
    id: "event-1",
    title: "Padel Society Open Tournament 2024",
    description: "Turnamen padel tahunan bergengsi di Jakarta. Tunjukkan kemampuan terbaik tim Anda dalam format ganda (doubles) dan perebutkan total hadiah Rp 25.000.000.",
    location: "Senayan Club Indoor Arena",
    date: new Date("2024-11-15T09:00:00"),
    quota: 32,
    registrationFee: 250000,
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
    status: "UPCOMING",
  },
  {
    id: "event-2",
    title: "Weekend Social Coaching Clinic",
    description: "Pelatihan teknik dasar dan strategi pertandingan yang dibimbing langsung oleh pelatih internasional berlisensi FIP. Cocok untuk semua tingkatan pemain.",
    location: "Senayan Club Outdoor",
    date: new Date("2024-11-02T16:00:00"),
    quota: 16,
    registrationFee: 100000,
    imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop",
    status: "UPCOMING",
  },
];
