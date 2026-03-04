"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Server, Shield, Zap, Activity, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CloudForge</span>
          </div>
          <Link 
            href="/auth/Login"
            className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all active:scale-95"
          >
            Go to Panel
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-purple-400 uppercase bg-purple-400/10 border border-purple-400/20 rounded-full">
              Next-Gen Server Management
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
              Manage Your Infrastructure <br /> with Precision.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              CloudForge provides a native experience for managing both Windows and Linux environments. 
              Integrated with your OS credentials for maximum security.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/auth/Login"
                className="group w-full sm:w-auto px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20"
              >
                Access Dashboard
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-24 px-6 relative bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
              <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6"><Server className="w-6 h-6 text-blue-500" /></div>
                <h3 className="text-xl font-bold mb-4">Multi-OS Support</h3>
                <p className="text-gray-400 leading-relaxed">Manage Windows and Linux servers from a single dashboard seamlessly.</p>
              </div>
              <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6"><Zap className="w-6 h-6 text-yellow-500" /></div>
                <h3 className="text-xl font-bold mb-4">Real-time Metrics</h3>
                <p className="text-gray-400 leading-relaxed">Monitor CPU, RAM, and Disk usage with live updates and analytics.</p>
              </div>
              <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6"><Shield className="w-6 h-6 text-green-500" /></div>
                <h3 className="text-xl font-bold mb-4">Native OS Auth</h3>
                <p className="text-gray-400 leading-relaxed">Login using your original OS credentials. No extra databases needed.</p>
              </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© 2026 CloudForge Server Management Platform. Built for Power Users.</p>
      </footer>
    </div>
  );
}
