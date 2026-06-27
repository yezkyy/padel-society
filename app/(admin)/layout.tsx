import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fbf8ff] text-[#1a1b22] dark:bg-zinc-950 dark:text-zinc-50 font-sans antialiased">
      <div className="hidden md:flex h-full">
        <AdminSidebar />
      </div>
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto pt-24 px-6 md:px-12 pb-12">
          <div className="max-w-[1280px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
