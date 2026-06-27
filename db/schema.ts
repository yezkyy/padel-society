import { pgTable, text, timestamp, integer, boolean, uuid, jsonb, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// 1. BETTER AUTH CORE TABLES
// ==========================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: text("role").notNull().default("MEMBER"), // MEMBER, ADMIN, OPERATOR
  phone: text("phone"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ==========================================
// 2. PADEL SOCIETY CORE TABLES
// ==========================================

export const courts = pgTable("courts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  pricePerHour: integer("price_per_hour").notNull(), // in IDR
  status: text("status").notNull().default("ACTIVE"), // ACTIVE, MAINTENANCE
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const courtImages = pgTable("court_images", {
  id: text("id").primaryKey(),
  courtId: text("court_id")
    .notNull()
    .references(() => courts.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  order: integer("order").notNull().default(0),
});

export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  courtId: text("court_id")
    .notNull()
    .references(() => courts.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").notNull().default("PENDING"), // PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW, EXPIRED
  totalPrice: integer("total_price").notNull(),
  promoCode: text("promo_code"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const bookingHistory = pgTable("booking_history", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  previousStatus: text("previous_status").notNull(),
  newStatus: text("new_status").notNull(),
  changedBy: text("changed_by")
    .notNull()
    .references(() => user.id),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  paymentMethod: text("payment_method"),
  externalId: text("external_id"), // Midtrans transaction ID
  status: text("status").notNull().default("UNPAID"), // UNPAID, PAID, FAILED, EXPIRED
  paidAt: timestamp("paid_at"),
  expiryTime: timestamp("expiry_time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  pdfUrl: text("pdf_url"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// 3. MEMBERSHIPS
// ==========================================

export const membershipPlans = pgTable("membership_plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  durationDays: integer("duration_days").notNull(),
  benefits: jsonb("benefits").notNull(), // JSON array of benefits
  priorityLevel: integer("priority_level").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const memberships = pgTable("memberships", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  planId: text("plan_id")
    .notNull()
    .references(() => membershipPlans.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("ACTIVE"), // ACTIVE, EXPIRED, CANCELLED
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// 4. PROMO CODES
// ==========================================

export const promoCodes = pgTable("promo_codes", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(), // PERCENT, FIXED
  discountValue: integer("discount_value").notNull(),
  minBookingAmount: integer("min_booking_amount").notNull().default(0),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").notNull().default(0),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// 5. EVENTS & REGISTRATIONS
// ==========================================

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  quota: integer("quota").notNull(),
  registrationFee: integer("registration_fee").notNull().default(0),
  imageUrl: text("image_url"),
  status: text("status").notNull().default("UPCOMING"), // UPCOMING, ONGOING, COMPLETED, CANCELLED
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("PENDING"), // PENDING, CONFIRMED, CANCELLED
  paymentStatus: text("payment_status").notNull().default("UNPAID"), // UNPAID, PAID
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// 6. BLOGS & CATEGORIES
// ==========================================

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const blogs = pgTable("blogs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  categoryId: text("category_id")
    .references(() => categories.id, { onDelete: "set null" }),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id),
  publishedAt: timestamp("published_at"),
  status: text("status").notNull().default("DRAFT"), // DRAFT, PUBLISHED
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ==========================================
// 7. PUBLIC CONTENT & SETTINGS
// ==========================================

export const gallery = pgTable("gallery", {
  id: text("id").primaryKey(),
  mediaType: text("media_type").notNull().default("IMAGE"), // IMAGE, VIDEO
  url: text("url").notNull(),
  caption: text("caption"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  order: integer("order").notNull().default(0),
});

export const websiteSettings = pgTable("website_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const mediaLibrary = pgTable("media_library", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  filepath: text("filepath").notNull(),
  size: integer("size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedBy: text("uploaded_by")
    .references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// 8. NOTIFICATIONS & LOGS
// ==========================================

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // INFO, BOOKING, PAYMENT, PROMO
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  description: text("description"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// ==========================================
// 9. RELATIONS
// ==========================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  bookings: many(bookings),
  memberships: many(memberships),
  testimonials: many(testimonials),
  eventRegistrations: many(eventRegistrations),
  blogs: many(blogs),
  activityLogs: many(activityLogs),
  notifications: many(notifications),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const courtRelations = relations(courts, ({ many }) => ({
  images: many(courtImages),
  bookings: many(bookings),
}));

export const courtImagesRelations = relations(courtImages, ({ one }) => ({
  court: one(courts, {
    fields: [courtImages.courtId],
    references: [courts.id],
  }),
}));

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  user: one(user, {
    fields: [bookings.userId],
    references: [user.id],
  }),
  court: one(courts, {
    fields: [bookings.courtId],
    references: [courts.id],
  }),
  payment: one(payments),
  invoice: one(invoices),
  history: many(bookingHistory),
}));

export const bookingHistoryRelations = relations(bookingHistory, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingHistory.bookingId],
    references: [bookings.id],
  }),
  changedByUser: one(user, {
    fields: [bookingHistory.changedBy],
    references: [user.id],
  }),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));

export const invoiceRelations = relations(invoices, ({ one }) => ({
  booking: one(bookings, {
    fields: [invoices.bookingId],
    references: [bookings.id],
  }),
}));

export const membershipPlanRelations = relations(membershipPlans, ({ many }) => ({
  memberships: many(memberships),
}));

export const membershipRelations = relations(memberships, ({ one }) => ({
  user: one(user, {
    fields: [memberships.userId],
    references: [user.id],
  }),
  plan: one(membershipPlans, {
    fields: [memberships.planId],
    references: [membershipPlans.id],
  }),
}));

export const eventRelations = relations(events, ({ many }) => ({
  registrations: many(eventRegistrations),
}));

export const eventRegistrationRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id],
  }),
  user: one(user, {
    fields: [eventRegistrations.userId],
    references: [user.id],
  }),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  blogs: many(blogs),
}));

export const blogRelations = relations(blogs, ({ one }) => ({
  category: one(categories, {
    fields: [blogs.categoryId],
    references: [categories.id],
  }),
  author: one(user, {
    fields: [blogs.authorId],
    references: [user.id],
  }),
}));

export const testimonialRelations = relations(testimonials, ({ one }) => ({
  user: one(user, {
    fields: [testimonials.userId],
    references: [user.id],
  }),
}));
