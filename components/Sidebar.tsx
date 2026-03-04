"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Terminal, Settings, Globe, Database, Server, 
  Activity, FolderOpen, ChevronLeft, Menu, Link2, Clock, Shield, Save
} from "lucide-react";
import { useState, useEffect } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", color: "text-blue-500" },
  { icon: FolderOpen, label: "Files", href: "/files", color: "text-amber-500" },
  { icon: Globe, label: "Websites", href: "/websites", color: "text-pink-500" },
  { icon: Link2, label: "Domains", href: "/domains", color: "text-purple-500" },
  { icon: Database, label: "Databases", href: "/databases", color: "text-emerald-500" },
  { icon: Clock, label: "Cron Jobs", href: "/cron", color: "text-orange-500" },
  { icon: Save, label: "Backups", href: "/backups", color: "text-indigo-500" },
  { icon: Shield, label: "Security", href: "/security", color: "text-red-500" },
  { icon: Server, label: "Containers", href: "/servers", color: "text-blue-400" },
  { icon: Activity, label: "Services", href: "/services", color: "text-teal-500" },
  { icon: Terminal, label: "Terminal", href: "/terminal", color: "text-slate-500" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl border-t border-slate-200 dark:border-white/5 h-16 px-4 flex items-center justify-between">
        {menuItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`p-2.5 rounded-xl transition-all ${isActive ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-zinc-600"}`}>
              <item.icon className="w-6 h-6" />
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <motion.aside 
      animate={{ width: collapsed ? 88 : 280 }} 
      className="relative h-screen bg-white dark:bg-black border-r border-slate-200 dark:border-white/5 flex flex-col z-40 transition-colors"
    >
      <div className="h-20 flex items-center px-7">
        <div className="w-9 h-9 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/30">
          <Server className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 font-black text-xl tracking-tight text-slate-900 dark:text-white">CloudForge</motion.span>}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="block group">
              <div className={`flex items-center h-11 rounded-xl transition-all ${isActive ? "bg-purple-50 dark:bg-white/5 text-purple-600 dark:text-white shadow-sm" : "text-slate-500 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"} ${collapsed ? "justify-center" : "px-4"}`}>
                <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`} />
                {!collapsed && <span className="ml-3 text-sm font-bold tracking-tight">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-white/5">
        <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center h-11 rounded-xl text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all">
          {collapsed ? <Menu className="w-5 h-5" /> : <div className="flex items-center gap-3"><ChevronLeft className="w-5 h-5" /><span className="text-sm font-bold">Collapse</span></div>}
        </button>
      </div>
    </motion.aside>
  );
}
