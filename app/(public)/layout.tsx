import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 py-4 w-full bg-transparent">
        <Navbar />
      </header>
      <main className="flex-1 w-full">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
