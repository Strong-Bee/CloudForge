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
  { icon: FolderOpen, label: "File Manager", href: "/files", color: "text-yellow-400" },
  { icon: Globe, label: "Websites", href: "/websites", color: "text-pink-500" },
  { icon: Link2, label: "Domains & DNS", href: "/domains", color: "text-purple-400" },
  { icon: Database, label: "Databases", href: "/databases", color: "text-emerald-500" },
  { icon: Clock, label: "Cron Jobs", href: "/cron", color: "text-orange-400" },
  { icon: Save, label: "Backups", href: "/backups", color: "text-indigo-400" },
  { icon: Shield, label: "Security", href: "/security", color: "text-red-500" },
  { icon: Server, label: "Containers", href: "/servers", color: "text-blue-400" },
  { icon: Activity, label: "Services", href: "/services", color: "text-teal-400" },
  { icon: Terminal, label: "Terminal", href: "/terminal", color: "text-gray-300" },
  { icon: Settings, label: "Settings", href: "/settings", color: "text-gray-500" },
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
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#050505] border-t border-white/5 h-16 px-2 overflow-x-auto flex items-center hide-scrollbar">
        <div className="flex items-center gap-2 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`relative p-3 rounded-xl flex-shrink-0 ${isActive ? "bg-white/10" : ""}`}>
                <item.icon className={`w-5 h-5 ${isActive ? item.color : "text-gray-500"}`} />
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <motion.aside animate={{ width: collapsed ? 80 : 260 }} className="relative h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col z-40">
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <Server className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 font-black text-lg tracking-tight">CloudForge</motion.span>}
      </div>

      <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="block group">
              <div className={`flex items-center h-10 rounded-lg transition-all ${isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"} ${collapsed ? "justify-center" : "px-3"}`}>
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? item.color : ""}`} />
                {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center h-10 rounded-lg text-gray-500 hover:bg-white/5">
          {collapsed ? <Menu className="w-4 h-4" /> : <div className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /><span className="text-sm">Collapse</span></div>}
        </button>
      </div>
    </motion.aside>
  );
}
