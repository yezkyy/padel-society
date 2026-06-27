import { db } from "@/db";
import * as schema from "@/db/schema";

export interface BookingDetails {
  id: string;
  courtName: string;
  dateStr: string;
  timeStr: string;
  totalPrice: number;
}

export interface PaymentDetails {
  bookingId: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod: string;
}

/**
 * Triggers an email notification (mock in dev, expandable to nodemailer/SendGrid)
 */
export async function sendBookingEmail(toEmail: string, details: BookingDetails) {
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f3f4f6; border-radius: 24px;">
      <h2 style="color: #000; font-weight: bold;">Booking Lapangan Berhasil!</h2>
      <p>Halo, terima kasih telah melakukan pemesanan lapangan di Padel Society. Berikut rincian pesanan Anda:</p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 16px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${details.id}</p>
        <p style="margin: 5px 0;"><strong>Lapangan:</strong> ${details.courtName}</p>
        <p style="margin: 5px 0;"><strong>Jadwal Main:</strong> ${details.dateStr}, ${details.timeStr}</p>
        <p style="margin: 5px 0; color: #506600; font-weight: bold;"><strong>Total Bayar:</strong> Rp ${details.totalPrice.toLocaleString("id-ID")}</p>
      </div>
      <p>Silakan lakukan pembayaran sesuai waktu yang ditentukan (15 menit untuk booking online).</p>
      <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
      <p style="font-size: 10px; color: #a1a1aa; text-align: center;">Padel Society © 2026. All rights reserved.</p>
    </div>
  `;

  console.log(`[MAILER] Sending Booking Confirmation Email to ${toEmail}`);
  console.log(`[MAILER] Content Preview:`, htmlContent.substring(0, 300) + "...");
  return { success: true };
}

/**
 * Triggers a payment success email invoice
 */
export async function sendPaymentConfirmationEmail(toEmail: string, details: PaymentDetails) {
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f3f4f6; border-radius: 24px;">
      <h2 style="color: #000; font-weight: bold;">Pembayaran Diterima (Invoice: ${details.invoiceNumber})</h2>
      <p>Halo, pembayaran Anda untuk booking ID ${details.bookingId} telah kami terima dan dikonfirmasi.</p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 16px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Nomor Invoice:</strong> ${details.invoiceNumber}</p>
        <p style="margin: 5px 0;"><strong>Metode Pembayaran:</strong> ${details.paymentMethod}</p>
        <p style="margin: 5px 0; color: #506600; font-weight: bold;"><strong>Total Bayar:</strong> Rp ${details.amount.toLocaleString("id-ID")}</p>
      </div>
      <p>Selamat bermain! Silakan tunjukkan Invoice ini kepada petugas lapangan saat kedatangan.</p>
      <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
      <p style="font-size: 10px; color: #a1a1aa; text-align: center;">Padel Society © 2026. All rights reserved.</p>
    </div>
  `;

  console.log(`[MAILER] Sending Payment Success Email to ${toEmail}`);
  return { success: true };
}

/**
 * Send WhatsApp Notification (Ready for WA Business API integration)
 */
export async function sendWhatsAppNotification(toPhone: string, message: string) {
  console.log(`[WHATSAPP] Sending message to ${toPhone}: "${message}"`);
  return { success: true };
}

/**
 * Creates an in-app notification in database for the member/user
 */
export async function createInAppNotification(userId: string, type: "INFO" | "BOOKING" | "PAYMENT" | "PROMO", title: string, message: string) {
  const id = `notif-${Math.random().toString(36).substring(2, 9)}`;
  try {
    await db.insert(schema.notifications).values({
      id,
      userId,
      type,
      title,
      message,
      isRead: false,
    });
    return { success: true, id };
  } catch (e) {
    console.error("DB Error creating in-app notification:", e);
    return { success: false };
  }
}
