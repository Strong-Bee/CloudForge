"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Settings as SettingsIcon, LogOut, Search, Menu } from "lucide-react";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="h-20 bg-black/20 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8 z-30 sticky top-0">
      {/* Search Bar (Hidden on Mobile) */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search servers, databases, commands..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Mobile Title (Only shows on mobile) */}
      <div className="md:hidden font-bold text-lg tracking-tight">CloudForge</div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-5">
        <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-gray-400 hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold hidden md:block">Admin</span>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
              >
                <div className="px-4 py-3 border-b border-white/5 mb-2">
                  <p className="text-sm font-bold text-white">Administrator</p>
                  <p className="text-xs text-gray-500 mt-0.5">Root Access</p>
                </div>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-3 transition-colors">
                  <SettingsIcon className="w-4 h-4" /> Account Settings
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 flex items-center gap-3 transition-colors mt-1">
                  <LogOut className="w-4 h-4" /> Logout Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

