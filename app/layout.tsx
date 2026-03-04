"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Daftar halaman yang TIDAK menampilkan Sidebar & Navbar (Landing Page & Login)
  const isAuthOrLanding = pathname === "/" || pathname?.startsWith("/auth");

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050505] text-white selection:bg-purple-500/30`}>
        <Toaster position="top-right" />
        
        {isAuthOrLanding ? (
          // Layout untuk Landing Page & Login (Polos)
          <main className="min-h-screen">
            {children}
          </main>
        ) : (
          // Layout untuk Dashboard (Dengan Sidebar & Navbar)
          <div className="flex h-screen overflow-hidden bg-[#050505]">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 bg-white/[0.02]">
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}

