"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthOrLanding = pathname === "/" || pathname?.startsWith("/auth");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Toaster position="top-right" />
          {isAuthOrLanding ? (
            <main className="min-h-screen">{children}</main>
          ) : (
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden relative">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar bg-slate-50 dark:bg-[#050505]">
                  {children}
                </main>
              </div>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
