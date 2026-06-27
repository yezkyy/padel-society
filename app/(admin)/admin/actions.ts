"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, gte, lte, or, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ==========================================
// MOCK FALLBACK DATA STORE FOR DEVELOPMENT
// ==========================================

let mockCourts: any[] = [
  { id: "court-1", name: "Court 1 (Indoor)", description: "Lapangan indoor premium dengan pencahayaan LED standar turnamen.", pricePerHour: 200000, status: "ACTIVE" },
  { id: "court-2", name: "Court 2 (Indoor)", description: "Lapangan indoor premium dengan ventilasi optimal dan karpet profesional.", pricePerHour: 200000, status: "ACTIVE" },
  { id: "court-3", name: "Court 3 (Outdoor)", description: "Lapangan outdoor dengan pemandangan terbuka, cocok untuk sore hari.", pricePerHour: 150000, status: "ACTIVE" },
  { id: "court-4", name: "Court 4 (Outdoor)", description: "Lapangan outdoor premium dengan permukaan anti-licin.", pricePerHour: 150000, status: "MAINTENANCE" },
];

let mockPromos: any[] = [
  { id: "promo-1", code: "PADELBARU", discountType: "PERCENT", discountValue: 15, minBookingAmount: 100000, maxUses: 100, usedCount: 12, validFrom: new Date("2026-01-01"), validUntil: new Date("2026-12-31"), isActive: true },
  { id: "promo-2", code: "ELITECLUB", discountType: "FIXED", discountValue: 50000, minBookingAmount: 300000, maxUses: 50, usedCount: 5, validFrom: new Date("2026-01-01"), validUntil: new Date("2026-12-31"), isActive: true },
];

let mockUsers = [
  { id: "usr-1", name: "Budi Santoso", email: "budi@gmail.com", role: "MEMBER", phone: "081234567890" },
  { id: "usr-2", name: "Siska Dwi", email: "siska@gmail.com", role: "MEMBER", phone: "081298765432" },
  { id: "usr-3", name: "John Doe", email: "johndoe@gmail.com", role: "MEMBER", phone: "08111222333" },
  { id: "usr-4", name: "Ayu Sekar", email: "ayu@gmail.com", role: "MEMBER", phone: "08222333444" },
];

let mockBookings: any[] = [
  { id: "bk-1", userId: "usr-3", courtId: "court-1", startTime: new Date(new Date().setHours(10, 0, 0)), endTime: new Date(new Date().setHours(12, 0, 0)), status: "CONFIRMED", totalPrice: 400000, promoCode: null, user: { name: "John Doe", email: "johndoe@gmail.com" }, court: { name: "Court 1 (Indoor)" } },
  { id: "bk-2", userId: "usr-4", courtId: "court-2", startTime: new Date(new Date().setHours(14, 0, 0)), endTime: new Date(new Date().setHours(16, 0, 0)), status: "PENDING", totalPrice: 400000, promoCode: null, user: { name: "Ayu Sekar", email: "ayu@gmail.com" }, court: { name: "Court 2 (Indoor)" } },
  { id: "bk-3", userId: "usr-1", courtId: "court-3", startTime: new Date(new Date().setHours(16, 0, 0)), endTime: new Date(new Date().setHours(17, 30, 0)), status: "CONFIRMED", totalPrice: 225000, promoCode: "PADELBARU", user: { name: "Budi Santoso", email: "budi@gmail.com" }, court: { name: "Court 3 (Outdoor)" } },
];

let mockSettings = {
  operatingHoursStart: "06:00",
  operatingHoursEnd: "22:00",
  weekendMultiplier: 1.2,
  peakHoursStart: "16:00",
  peakHoursEnd: "21:00",
  peakHoursMultiplier: 1.25,
  memberDiscount: 10,
};

// ==========================================
// COURT MANAGEMENT ACTIONS
// ==========================================

export async function getCourts() {
  try {
    return await db.select().from(schema.courts);
  } catch (e) {
    console.error("DB Query error, returning mock courts:", e);
    return mockCourts;
  }
}

export async function createCourt(data: { name: string; description: string; pricePerHour: number; status: string }) {
  const id = `court-${Math.random().toString(36).substring(2, 9)}`;
  try {
    const newCourt = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
    await db.insert(schema.courts).values(newCourt);
    revalidatePath("/admin/courts");
    return { success: true, id };
  } catch (e) {
    console.error("DB Error creating court, updating mock:", e);
    const newCourt = { id, ...data };
    mockCourts.push(newCourt);
    return { success: true, id };
  }
}

export async function updateCourt(id: string, data: { name: string; description: string; pricePerHour: number; status: string }) {
  try {
    await db.update(schema.courts).set({ ...data, updatedAt: new Date() }).where(eq(schema.courts.id, id));
    revalidatePath("/admin/courts");
    return { success: true };
  } catch (e) {
    console.error("DB Error updating court, updating mock:", e);
    mockCourts = mockCourts.map(c => c.id === id ? { ...c, ...data } : c);
    return { success: true };
  }
}

export async function deleteCourt(id: string) {
  try {
    await db.delete(schema.courts).where(eq(schema.courts.id, id));
    revalidatePath("/admin/courts");
    return { success: true };
  } catch (e) {
    console.error("DB Error deleting court, updating mock:", e);
    mockCourts = mockCourts.filter(c => c.id !== id);
    return { success: true };
  }
}

export async function toggleCourtStatus(id: string) {
  try {
    const courtList = await db.select().from(schema.courts).where(eq(schema.courts.id, id));
    if (courtList[0]) {
      const newStatus = courtList[0].status === "ACTIVE" ? "MAINTENANCE" : "ACTIVE";
      await db.update(schema.courts).set({ status: newStatus, updatedAt: new Date() }).where(eq(schema.courts.id, id));
    }
    revalidatePath("/admin/courts");
    return { success: true };
  } catch (e) {
    console.error("DB Error toggling court status, updating mock:", e);
    mockCourts = mockCourts.map(c => c.id === id ? { ...c, status: c.status === "ACTIVE" ? "MAINTENANCE" : "ACTIVE" } : c);
    return { success: true };
  }
}

// ==========================================
// BOOKING MANAGEMENT ACTIONS
// ==========================================

export async function getBookings() {
  try {
    const list = await db.query.bookings.findMany({
      with: {
        user: true,
        court: true,
      },
      orderBy: [desc(schema.bookings.createdAt)],
    });
    return list.map(b => ({
      ...b,
      user: b.user ? { name: b.user.name, email: b.user.email } : { name: "Manual Block", email: "system@padelsociety.com" },
      court: b.court ? { name: b.court.name } : { name: "Unknown Court" }
    }));
  } catch (e) {
    console.error("DB Query error, returning mock bookings:", e);
    return mockBookings;
  }
}

export async function createBooking(data: {
  userId: string;
  courtId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  totalPrice: number;
  promoCode?: string;
}) {
  const id = `bk-${Math.random().toString(36).substring(2, 9)}`;
  try {
    await db.insert(schema.bookings).values({
      id,
      userId: data.userId,
      courtId: data.courtId,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status,
      totalPrice: data.totalPrice,
      promoCode: data.promoCode || null,
    });
    revalidatePath("/admin/bookings");
    return { success: true, id };
  } catch (e) {
    console.error("DB Error creating booking, updating mock:", e);
    const selectedUser = mockUsers.find(u => u.id === data.userId) || { name: "Manual Block", email: "system@padelsociety.com" };
    const selectedCourt = mockCourts.find(c => c.id === data.courtId) || { name: "Unknown Court" };
    const newBooking = {
      id,
      userId: data.userId,
      courtId: data.courtId,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status,
      totalPrice: data.totalPrice,
      promoCode: data.promoCode || null,
      user: { name: selectedUser.name, email: selectedUser.email },
      court: { name: selectedCourt.name }
    };
    mockBookings.push(newBooking);
    return { success: true, id };
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    await db.update(schema.bookings).set({ status, updatedAt: new Date() }).where(eq(schema.bookings.id, id));
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (e) {
    console.error("DB Error updating booking status, updating mock:", e);
    mockBookings = mockBookings.map(b => b.id === id ? { ...b, status } : b);
    return { success: true };
  }
}

export async function rescheduleBooking(id: string, startTime: Date, endTime: Date) {
  try {
    await db.update(schema.bookings).set({ startTime, endTime, updatedAt: new Date() }).where(eq(schema.bookings.id, id));
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (e) {
    console.error("DB Error rescheduling booking, updating mock:", e);
    mockBookings = mockBookings.map(b => b.id === id ? { ...b, startTime, endTime } : b);
    return { success: true };
  }
}

// ==========================================
// PROMO CODES ACTIONS
// ==========================================

export async function getPromoCodes() {
  try {
    return await db.select().from(schema.promoCodes);
  } catch (e) {
    console.error("DB Query error, returning mock promos:", e);
    return mockPromos;
  }
}

export async function createPromoCode(data: {
  code: string;
  discountType: string;
  discountValue: number;
  minBookingAmount: number;
  maxUses?: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
}) {
  const id = `promo-${Math.random().toString(36).substring(2, 9)}`;
  try {
    await db.insert(schema.promoCodes).values({
      id,
      code: data.code,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minBookingAmount: data.minBookingAmount,
      maxUses: data.maxUses || null,
      usedCount: 0,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
      isActive: data.isActive,
    });
    revalidatePath("/admin/courts");
    return { success: true, id };
  } catch (e) {
    console.error("DB Error creating promo, updating mock:", e);
    const newPromo = { id, ...data, usedCount: 0 };
    mockPromos.push(newPromo);
    return { success: true, id };
  }
}

export async function updatePromoCode(id: string, data: {
  code: string;
  discountType: string;
  discountValue: number;
  minBookingAmount: number;
  maxUses?: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
}) {
  try {
    await db.update(schema.promoCodes).set({
      code: data.code,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minBookingAmount: data.minBookingAmount,
      maxUses: data.maxUses || null,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
      isActive: data.isActive,
    }).where(eq(schema.promoCodes.id, id));
    revalidatePath("/admin/courts");
    return { success: true };
  } catch (e) {
    console.error("DB Error updating promo, updating mock:", e);
    mockPromos = mockPromos.map(p => p.id === id ? { ...p, ...data } : p);
    return { success: true };
  }
}

export async function deletePromoCode(id: string) {
  try {
    await db.delete(schema.promoCodes).where(eq(schema.promoCodes.id, id));
    revalidatePath("/admin/courts");
    return { success: true };
  } catch (e) {
    console.error("DB Error deleting promo, updating mock:", e);
    mockPromos = mockPromos.filter(p => p.id !== id);
    return { success: true };
  }
}

export async function togglePromoCodeActive(id: string) {
  try {
    const promoList = await db.select().from(schema.promoCodes).where(eq(schema.promoCodes.id, id));
    if (promoList[0]) {
      const newActive = !promoList[0].isActive;
      await db.update(schema.promoCodes).set({ isActive: newActive }).where(eq(schema.promoCodes.id, id));
    }
    revalidatePath("/admin/courts");
    return { success: true };
  } catch (e) {
    console.error("DB Error toggling promo active status, updating mock:", e);
    mockPromos = mockPromos.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
    return { success: true };
  }
}

// ==========================================
// SYSTEM SETTINGS ACTIONS
// ==========================================

export async function getSettings() {
  try {
    const rows = await db.select().from(schema.websiteSettings);
    const settings: Record<string, string> = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });
    return {
      operatingHoursStart: settings.operatingHoursStart || "06:00",
      operatingHoursEnd: settings.operatingHoursEnd || "22:00",
      weekendMultiplier: Number(settings.weekendMultiplier || "1.2"),
      peakHoursStart: settings.peakHoursStart || "16:00",
      peakHoursEnd: settings.peakHoursEnd || "21:00",
      peakHoursMultiplier: Number(settings.peakHoursMultiplier || "1.25"),
      memberDiscount: Number(settings.memberDiscount || "10"),
    };
  } catch (e) {
    console.error("DB Query error, returning mock settings:", e);
    return mockSettings;
  }
}

export async function saveSettings(data: {
  operatingHoursStart: string;
  operatingHoursEnd: string;
  weekendMultiplier: number;
  peakHoursStart: string;
  peakHoursEnd: string;
  peakHoursMultiplier: number;
  memberDiscount: number;
}) {
  try {
    const keys = Object.keys(data) as Array<keyof typeof data>;
    for (const key of keys) {
      await db.insert(schema.websiteSettings)
        .values({ key, value: String(data[key]) })
        .onConflictDoUpdate({
          target: schema.websiteSettings.key,
          set: { value: String(data[key]) }
        });
    }
    revalidatePath("/admin/courts");
    return { success: true };
  } catch (e) {
    console.error("DB Error saving settings, updating mock:", e);
    mockSettings = { ...data };
    return { success: true };
  }
}

// ==========================================
// USER / CUSTOMER LOOKUP ACTIONS
// ==========================================

export async function getCustomers() {
  try {
    return await db.select().from(schema.user).where(eq(schema.user.role, "MEMBER"));
  } catch (e) {
    console.error("DB Query error, returning mock users:", e);
    return mockUsers;
  }
}

// ==========================================
// PHASE 7 MOCK DATA FALLBACKS
// ==========================================

let mockEvents: any[] = [
  { id: "evt-1", title: "Padel Society Open 2026", description: "Turnamen padel tahunan paling bergengsi di Jakarta. Terbuka untuk kategori Men's Double & Women's Double.", location: "Canggu Court, Bali", date: new Date("2026-08-15T09:00:00"), quota: 32, registrationFee: 250000, status: "UPCOMING", registrationsCount: 18 },
  { id: "evt-2", title: "Sunday Social Padel", description: "Bermain padel santai dan networking bersama komunitas Padel Society. Gratis sewa raket dan snack.", location: "Court 1 & 2 Indoor, Jakarta", date: new Date("2026-07-05T16:00:00"), quota: 16, registrationFee: 0, status: "UPCOMING", registrationsCount: 12 },
];

let mockBlogs: any[] = [
  { id: "blog-1", title: "Tips Padel untuk Pemula: Cara Memegang Raket & Posisi Tubuh", slug: "tips-padel-pemula", content: "Padel adalah olahraga yang menyenangkan dan cepat berkembang. Bagi pemula, menguasai genggaman continental grip adalah kunci utama...", excerpt: "Panduan lengkap teknik dasar bermain padel bagi pemula.", status: "PUBLISHED", publishedAt: new Date("2026-06-10") },
  { id: "blog-2", title: "Mengapa Lapangan Padel Menggunakan Rumput Sintetis?", slug: "mengapa-lapangan-padel-rumput-sintetis", content: "Rumput sintetis pada lapangan padel memberikan pantulan bola yang konsisten dan mengurangi resiko cedera pada sendi lutut...", excerpt: "Membahas teknologi permukaan lapangan padel profesional.", status: "DRAFT", publishedAt: null },
];

let mockGallery: any[] = [
  { id: "gal-1", mediaType: "IMAGE", url: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece", caption: "Keseruan Grand Opening Court Indoor", order: 1 },
  { id: "gal-2", mediaType: "IMAGE", url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea", caption: "Final Tournament Padel Society 2025", order: 2 },
];

let mockTestimonials: any[] = [
  { id: "test-1", userId: "usr-1", content: "Fasilitas lapangan indoor-nya sangat luar biasa. Pencahayaan LED-nya pas dan tidak menyilaukan mata saat smash bola.", rating: 5, isVisible: true, user: { name: "Budi Santoso" } },
  { id: "test-2", userId: "usr-2", content: "Sistem booking-nya sangat mudah dan cepat. Customer service di lokasi sangat ramah membantu memilihkan raket sewa.", rating: 4, isVisible: true, user: { name: "Siska Dwi" } },
];

let mockActivityLogs: any[] = [
  { id: "log-1", userId: "admin-1", action: "UPDATE_COURT", entityType: "COURT", entityId: "court-1", description: "Mengubah harga sewa Court 1 menjadi Rp 200.000", ipAddress: "192.168.1.1", timestamp: new Date() },
  { id: "log-2", userId: "admin-1", action: "CREATE_PROMO", entityType: "PROMO", entityId: "promo-1", description: "Membuat kode promo PADELBARU", ipAddress: "192.168.1.1", timestamp: new Date(Date.now() - 3600000) },
];

// ==========================================
// CUSTOMERS & USER ROLES OPERATIONS
// ==========================================

export async function getAllUsers() {
  try {
    return await db.select().from(schema.user);
  } catch (e) {
    console.error("DB Query error, returning mock users:", e);
    // Merge mockUsers and some dummy admins
    return [
      ...mockUsers,
      { id: "admin-1", name: "Admin Padel Society", email: "admin@padelsociety.com", role: "ADMIN", phone: "081200000000" },
      { id: "op-1", name: "Operator Budi", email: "operator@padelsociety.com", role: "OPERATOR", phone: "081200000010" }
    ];
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    await db.update(schema.user).set({ role, updatedAt: new Date() }).where(eq(schema.user.id, userId));
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (e) {
    console.error("DB Error updating user role:", e);
    mockUsers = mockUsers.map(u => u.id === userId ? { ...u, role } : u);
    return { success: true };
  }
}

// ==========================================
// EVENTS OPERATIONS
// ==========================================

export async function getEvents() {
  try {
    const list = await db.select().from(schema.events);
    return list.map(evt => ({ ...evt, registrationsCount: 10 })); // dummy registration count
  } catch (e) {
    console.error("DB Query error, returning mock events:", e);
    return mockEvents;
  }
}

export async function createEvent(data: {
  title: string;
  description: string;
  location: string;
  date: Date;
  quota: number;
  registrationFee: number;
  imageUrl?: string;
  status: string;
}) {
  const id = `evt-${Math.random().toString(36).substring(2, 9)}`;
  try {
    await db.insert(schema.events).values({
      id,
      title: data.title,
      description: data.description,
      location: data.location,
      date: data.date,
      quota: data.quota,
      registrationFee: data.registrationFee,
      imageUrl: data.imageUrl || null,
      status: data.status,
    });
    revalidatePath("/admin/settings");
    return { success: true, id };
  } catch (e) {
    console.error("DB Error creating event, updating mock:", e);
    const newEvt = { id, ...data, registrationsCount: 0 };
    mockEvents.push(newEvt);
    return { success: true, id };
  }
}

export async function updateEvent(id: string, data: {
  title: string;
  description: string;
  location: string;
  date: Date;
  quota: number;
  registrationFee: number;
  imageUrl?: string;
  status: string;
}) {
  try {
    await db.update(schema.events).set({
      title: data.title,
      description: data.description,
      location: data.location,
      date: data.date,
      quota: data.quota,
      registrationFee: data.registrationFee,
      imageUrl: data.imageUrl || null,
      status: data.status,
    }).where(eq(schema.events.id, id));
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e) {
    console.error("DB Error updating event, updating mock:", e);
    mockEvents = mockEvents.map(evt => evt.id === id ? { ...evt, ...data } : evt);
    return { success: true };
  }
}

export async function deleteEvent(id: string) {
  try {
    await db.delete(schema.events).where(eq(schema.events.id, id));
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e) {
    console.error("DB Error deleting event, updating mock:", e);
    mockEvents = mockEvents.filter(evt => evt.id !== id);
    return { success: true };
  }
}

// ==========================================
// BLOGS OPERATIONS
// ==========================================

export async function getBlogs() {
  try {
    return await db.select().from(schema.blogs);
  } catch (e) {
    console.error("DB Query error, returning mock blogs:", e);
    return mockBlogs;
  }
}

export async function createBlog(data: {
  title: string;
  content: string;
  excerpt: string;
  status: string;
  authorId: string;
}) {
  const id = `blog-${Math.random().toString(36).substring(2, 9)}`;
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  try {
    await db.insert(schema.blogs).values({
      id,
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      status: data.status,
      authorId: data.authorId,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    });
    revalidatePath("/admin/settings");
    return { success: true, id };
  } catch (e) {
    console.error("DB Error creating blog, updating mock:", e);
    const newBlog = { id, ...data, slug, publishedAt: data.status === "PUBLISHED" ? new Date() : null };
    mockBlogs.push(newBlog);
    return { success: true, id };
  }
}

export async function updateBlog(id: string, data: {
  title: string;
  content: string;
  excerpt: string;
  status: string;
}) {
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  try {
    await db.update(schema.blogs).set({
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      updatedAt: new Date(),
    }).where(eq(schema.blogs.id, id));
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e) {
    console.error("DB Error updating blog, updating mock:", e);
    mockBlogs = mockBlogs.map(b => b.id === id ? { ...b, ...data, slug, publishedAt: data.status === "PUBLISHED" ? new Date() : null } : b);
    return { success: true };
  }
}

export async function deleteBlog(id: string) {
  try {
    await db.delete(schema.blogs).where(eq(schema.blogs.id, id));
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e) {
    console.error("DB Error deleting blog, updating mock:", e);
    mockBlogs = mockBlogs.filter(b => b.id !== id);
    return { success: true };
  }
}

// ==========================================
// TESTIMONIALS & FAQ OPERATIONS
// ==========================================

export async function getTestimonials() {
  try {
    const list = await db.query.testimonials.findMany({
      with: {
        user: true
      }
    });
    return list;
  } catch (e) {
    console.error("DB Query error, returning mock testimonials:", e);
    return mockTestimonials;
  }
}

export async function toggleTestimonialVisibility(id: string) {
  try {
    const list = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, id));
    if (list[0]) {
      await db.update(schema.testimonials).set({ isVisible: !list[0].isVisible }).where(eq(schema.testimonials.id, id));
    }
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e) {
    console.error("DB Error toggling testimonial status, updating mock:", e);
    mockTestimonials = mockTestimonials.map(t => t.id === id ? { ...t, isVisible: !t.isVisible } : t);
    return { success: true };
  }
}

// FAQs (Phase 7 extension CRUD)
export async function getFaqs() {
  try {
    return await db.select().from(schema.faqs);
  } catch (e) {
    console.error("DB Query error, returning mock FAQs:");
    // Return mock faqs
    return [
      { id: "faq-1", question: "Bagaimana cara booking?", answer: "Pilih tanggal dan slot waktu di menu booking.", category: "Umum", order: 1 },
      { id: "faq-2", question: "Kebijakan pembatalan?", answer: "Pembatalan minimal H-6 jam untuk refund 90%.", category: "Kebijakan", order: 2 }
    ];
  }
}

export async function createFaq(data: { question: string; answer: string; category: string; order: number }) {
  const id = `faq-${Math.random().toString(36).substring(2, 9)}`;
  try {
    await db.insert(schema.faqs).values({ id, ...data });
    revalidatePath("/admin/settings");
    return { success: true, id };
  } catch (e) {
    console.error("DB Error creating FAQ");
    return { success: true, id };
  }
}

export async function deleteFaq(id: string) {
  try {
    await db.delete(schema.faqs).where(eq(schema.faqs.id, id));
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e) {
    console.error("DB Error deleting FAQ");
    return { success: true };
  }
}

// ==========================================
// SYSTEM LOGS & REPORTS OPERATIONS
// ==========================================

export async function getActivityLogs() {
  try {
    return await db.select().from(schema.activityLogs).orderBy(desc(schema.activityLogs.timestamp));
  } catch (e) {
    console.error("DB Query error, returning mock logs:", e);
    return mockActivityLogs;
  }
}

export async function getGallery() {
  try {
    return await db.select().from(schema.gallery);
  } catch (e) {
    console.error("DB Query error, returning mock gallery:", e);
    return mockGallery;
  }
}

export async function addToGallery(data: { mediaType: string; url: string; caption?: string; order?: number }) {
  const id = `gal-${Math.random().toString(36).substring(2, 9)}`;
  try {
    await db.insert(schema.gallery).values({
      id,
      mediaType: data.mediaType,
      url: data.url,
      caption: data.caption || null,
      order: data.order || 0,
    });
    revalidatePath("/admin/settings");
    return { success: true, id };
  } catch (e) {
    console.error("DB Error adding to gallery, updating mock:", e);
    const newMedia = { id, ...data };
    mockGallery.push(newMedia);
    return { success: true, id };
  }
}

export async function removeFromGallery(id: string) {
  try {
    await db.delete(schema.gallery).where(eq(schema.gallery.id, id));
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e) {
    console.error("DB Error removing gallery item, updating mock:", e);
    mockGallery = mockGallery.filter(g => g.id !== id);
    return { success: true };
  }
}

