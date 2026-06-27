import { MemberSidebar } from "@/components/layout/MemberSidebar";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fbf8ff] text-[#1a1b22] dark:bg-zinc-950 dark:text-zinc-50 font-sans antialiased">
      <MemberSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-zinc-50/30 dark:bg-zinc-900/30 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ccff00]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto relative z-10">{children}</div>
      </main>
    </div>
  );
}
