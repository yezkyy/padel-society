# IMPLEMENTATION GUIDE

## Project

Nama Proyek: Padel Society

Website ini merupakan platform modern yang menggabungkan Company Profile premium dengan sistem Booking Lapangan Padel berbasis Next.js. Seluruh implementasi harus mengacu pada PRD.md sebagai sumber business logic dan folder stitch/ sebagai sumber utama desain UI/UX.

---

# Implementation Priority

Gunakan prioritas berikut selama proses implementasi.

1. PRD.md sebagai sumber seluruh business logic, flow pengguna, database, fitur, dan aturan bisnis.
2. Folder stitch/ sebagai referensi visual, layout, hierarchy, spacing, typography, dan komponen.
3. Jangan mengubah desain yang ada kecuali diperlukan untuk meningkatkan usability atau responsive layout.
4. Seluruh implementasi harus production-ready.
5. Hindari membuat placeholder yang tidak diperlukan.

---

# Tech Stack

Framework

- Next.js 15 (App Router)
- React 19
- TypeScript

Styling

- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React Icons

Database

- PostgreSQL

ORM

- Drizzle ORM

Authentication

- Better Auth

Validation

- Zod
- React Hook Form

State Management

- TanStack Query
- React Context hanya untuk state global sederhana

Utilities

- date-fns
- clsx
- tailwind-merge

Charts

- Recharts

Table

- TanStack Table

Notification

- Sonner

Upload

- UploadThing atau Cloudinary

Maps

- Google Maps API

Payment

- Midtrans

Deployment

- Vercel

---

# Coding Standard

Gunakan TypeScript secara penuh.

Tidak diperbolehkan menggunakan any kecuali benar-benar diperlukan.

Gunakan functional component.

Gunakan async/await.

Gunakan Server Components apabila memungkinkan.

Gunakan Client Components hanya jika memang membutuhkan interaktivitas.

Gunakan Server Actions apabila sesuai.

Pisahkan business logic dari UI.

Hindari hardcoded data.

Semua data harus berasal dari API atau Database.

---

# Folder Structure

Gunakan struktur folder yang bersih.

app/

components/

features/

hooks/

lib/

services/

types/

utils/

config/

providers/

actions/

db/

public/

styles/

---

# Component Rules

Seluruh UI harus reusable.

Pisahkan menjadi komponen kecil.

Contoh

Button

Card

Input

Badge

Avatar

Modal

Dialog

Sheet

Table

Pagination

Breadcrumb

Navbar

Sidebar

Footer

Hero

CTA

Booking Card

Court Card

Member Card

Event Card

Gallery Card

Blog Card

Statistic Card

---

# Design Rules

Ikuti desain Stitch secara pixel-perfect.

Gunakan spacing yang konsisten.

Gunakan typography sesuai Design System.

Gunakan warna sesuai Design System.

Gunakan icon yang konsisten.

Gunakan border radius yang konsisten.

Gunakan shadow yang ringan.

Gunakan animasi yang halus.

Jangan mengubah hierarchy layout.

---

# Responsive Rules

Website harus Mobile First.

Breakpoint

Mobile

Tablet

Laptop

Desktop

Ultra Wide

Pastikan seluruh halaman responsive.

Tidak boleh ada horizontal scrolling.

---

# Animation Rules

Gunakan Framer Motion.

Animasi harus ringan.

Gunakan

Fade

Slide

Scale

Reveal

Hover

Scroll Animation

Micro Interaction

Jangan menggunakan animasi berlebihan.

---

# Accessibility

Gunakan semantic HTML.

Gunakan aria-label jika diperlukan.

Gunakan keyboard navigation.

Gunakan focus state.

Gunakan alt image.

Pastikan contrast memenuhi standar.

---

# Performance

Gunakan Next Image.

Gunakan Lazy Loading.

Gunakan Dynamic Import bila diperlukan.

Optimalkan bundle size.

Gunakan caching.

Gunakan Suspense.

Gunakan Skeleton Loading.

---

# Authentication

Gunakan Better Auth.

Role

Guest

Member

Admin

Operator

Gunakan middleware.

Lindungi seluruh route dashboard.

---

# Authorization

Gunakan Role Based Access Control.

Role memiliki permission yang berbeda.

Permission tidak boleh di-hardcode pada UI.

Semua validasi dilakukan di server.

---

# Booking Rules

Implementasikan seluruh aturan booking sesuai PRD.

Tidak boleh terjadi double booking.

Gunakan database transaction.

Validasi slot sebelum pembayaran.

Gunakan slot locking selama proses pembayaran.

Status Booking

Pending

Confirmed

Cancelled

Completed

No Show

Expired

---

# Payment Rules

Gunakan Midtrans.

Implementasikan webhook.

Gunakan signature validation.

Status pembayaran harus sinkron dengan status booking.

Invoice dibuat otomatis.

---

# Notification

Gunakan Email.

Siapkan struktur untuk WhatsApp Notification.

Gunakan template notification.

---

# Database

Implementasikan seluruh tabel sesuai PRD.

Gunakan foreign key.

Gunakan index.

Gunakan cascade apabila diperlukan.

Gunakan migration Drizzle.

---

# API Rules

Gunakan REST API.

Response harus konsisten.

Format

Success

Message

Data

Meta

Error

---

# Error Handling

Gunakan Error Boundary.

Gunakan Toast Notification.

Gunakan halaman

404

403

401

500

---

# Form Rules

Gunakan React Hook Form.

Gunakan Zod Validation.

Semua error harus jelas.

Gunakan loading state.

Gunakan disabled state.

---

# Dashboard

Dashboard Member

Dashboard Admin

Gunakan layout terpisah.

Sidebar harus reusable.

Navbar harus reusable.

---

# CMS

Seluruh CMS harus menggunakan tabel modern.

Search

Filter

Pagination

Sorting

Bulk Action

Export

Import

Confirmation Dialog

---

# File Upload

Gunakan drag and drop.

Preview image.

Validation.

Compress image.

---

# Loading State

Gunakan Skeleton.

Gunakan Spinner seperlunya.

Tidak boleh blank screen.

---

# Empty State

Gunakan ilustrasi.

Gunakan CTA.

Berikan informasi yang jelas.

---

# Code Quality

Gunakan Clean Code.

Gunakan SOLID Principle.

Gunakan reusable function.

Gunakan reusable hooks.

Gunakan reusable service.

Gunakan reusable utility.

---

# Naming Convention

Gunakan PascalCase untuk Component.

Gunakan camelCase untuk variable.

Gunakan kebab-case untuk route.

Gunakan snake_case hanya untuk database.

---

# Git Convention

Gunakan Conventional Commit.

Contoh

feat:

fix:

refactor:

style:

docs:

chore:

---

# UI Consistency

Seluruh halaman harus memiliki:

Navbar yang konsisten.

Footer yang konsisten.

Spacing yang konsisten.

Typography yang konsisten.

Icon yang konsisten.

Animation yang konsisten.

Button yang konsisten.

Card yang konsisten.

Form yang konsisten.

---

# Business Logic

Jangan mengubah flow bisnis yang sudah dijelaskan pada PRD.

Apabila terdapat perbedaan antara PRD dan desain Stitch:

- PRD menjadi acuan utama untuk business logic.
- Stitch menjadi acuan utama untuk tampilan visual.

---

# Final Goal

Bangun aplikasi yang siap digunakan pada lingkungan production.

Seluruh kode harus modular, scalable, maintainable, reusable, responsive, dan mudah dikembangkan pada fase berikutnya.

Hasil implementasi harus menyerupai kualitas produk startup modern dengan standar enterprise serta mengikuti seluruh kebutuhan yang telah dijelaskan pada PRD.md dan desain Stitch tanpa mengurangi kualitas desain maupun pengalaman pengguna.