"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, LogOut, Search, Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="h-16 md:h-20 bg-white/80 dark:bg-black/20 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 md:px-8 z-30 sticky top-0 transition-colors">
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Quick search..." 
            className="w-full bg-slate-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </div>

      <div className="md:hidden font-bold text-lg tracking-tighter text-purple-600 dark:text-purple-400">CloudForge</div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-all"
        >
          {mounted && (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
        </button>

        <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full border-2 border-white dark:border-[#0a0a0a]" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md">A</div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden py-2"
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5 mb-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-bold truncate">Administrator</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"><Settings className="w-4 h-4" /> Settings</button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3 transition-colors mt-1"><LogOut className="w-4 h-4" /> Sign Out</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
