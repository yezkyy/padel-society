import { db } from "./index";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import { auth } from "../lib/auth";

async function main() {
  console.log("Seeding started...");

  // 1. Seed Membership Plans
  const plans = [
    {
      id: "plan-starter",
      name: "Starter Pack",
      description: "Cocok untuk pemula yang ingin mencoba padel",
      price: 150000,
      durationDays: 30,
      benefits: ["Diskon booking 10%", "Booking slot H-3"],
      priorityLevel: 1,
    },
    {
      id: "plan-elite",
      name: "Elite Pro",
      description: "Untuk pemain setia dengan prioritas dan diskon maksimal",
      price: 500000,
      durationDays: 30,
      benefits: [
        "Diskon booking 20%",
        "Prioritas booking slot H-7",
        "Akses ke event eksklusif",
        "Gratis sewa raket 2x/bulan",
      ],
      priorityLevel: 2,
    },
  ];

  for (const plan of plans) {
    await db.insert(schema.membershipPlans).values(plan).onConflictDoNothing();
  }
  console.log("Seeded membership plans.");

  // 2. Seed Courts
  const courtList = [
    {
      id: "court-1",
      name: "Court 1 (Indoor)",
      description: "Lapangan indoor premium dengan pencahayaan LED standar turnamen dan karpet profesional.",
      pricePerHour: 200000,
      status: "ACTIVE",
    },
    {
      id: "court-2",
      name: "Court 2 (Indoor)",
      description: "Lapangan indoor premium dengan ventilasi optimal dan karpet profesional.",
      pricePerHour: 200000,
      status: "ACTIVE",
    },
    {
      id: "court-3",
      name: "Court 3 (Outdoor)",
      description: "Lapangan outdoor dengan pemandangan terbuka, cocok untuk bermain di sore hari.",
      pricePerHour: 150000,
      status: "ACTIVE",
    },
    {
      id: "court-4",
      name: "Court 4 (Outdoor)",
      description: "Lapangan outdoor premium dengan permukaan anti-licin.",
      pricePerHour: 150000,
      status: "MAINTENANCE",
    },
  ];

  for (const c of courtList) {
    await db.insert(schema.courts).values(c).onConflictDoNothing();
  }
  console.log("Seeded courts.");

  // 3. Seed FAQs
  const faqList = [
    {
      id: "faq-1",
      question: "Bagaimana cara melakukan booking lapangan?",
      answer: "Anda dapat memilih lapangan dan jadwal yang tersedia di halaman 'Daftar Lapangan' atau 'Booking', lalu selesaikan pembayaran dalam waktu 15 menit menggunakan QRIS, Virtual Account, atau E-Wallet.",
      category: "Booking",
      order: 1,
    },
    {
      id: "faq-2",
      question: "Apakah saya bisa membatalkan atau menjadwal ulang (reschedule)?",
      answer: "Reschedule dapat dilakukan maksimal H-4 jam sebelum jadwal bermain (1x kesempatan). Pembatalan dapat dilakukan maksimal H-6 jam sebelum jadwal bermain dengan pengembalian dana dipotong biaya admin 10%.",
      category: "Kebijakan",
      order: 2,
    },
    {
      id: "faq-3",
      question: "Apakah tersedia penyewaan raket dan bola?",
      answer: "Ya, kami menyediakan penyewaan raket padel premium seharga Rp 35.000 per sesi dan pembelian bola baru seharga Rp 50.000 per tabung di Pro Shop lokasi.",
      category: "Fasilitas",
      order: 3,
    },
  ];

  for (const f of faqList) {
    await db.insert(schema.faqs).values(f).onConflictDoNothing();
  }
  console.log("Seeded FAQs.");

  // 4. Seed Users via Better Auth API
  try {
    const adminUser = await auth.api.signUpEmail({
      body: {
        name: "Admin Padel Society",
        email: "admin@padelsociety.com",
        password: "password123",
        phone: "081200000000",
      },
    });
    
    if (adminUser) {
      await db
        .update(schema.user)
        .set({ role: "ADMIN" })
        .where(eq(schema.user.email, "admin@padelsociety.com"));
      console.log("Seeded Admin user.");
    }
  } catch (e) {
    console.log("Admin user might already exist.");
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: "Budi Pangestu",
        email: "member@padelsociety.com",
        password: "password123",
        phone: "081200000001",
      },
    });
    console.log("Seeded Member user.");
  } catch (e) {
    console.log("Member user might already exist.");
  }

  console.log("Seeding completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
