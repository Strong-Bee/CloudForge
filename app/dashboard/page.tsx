"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu, MemoryStick, HardDrive, Clock, Activity, Server, Globe, Database, 
  ArrowUpRight, Monitor, Network, Hash, Box
} from "lucide-react";
import ServerCard from "@/components/ServerCard";
import { getServerStats } from "@/lib/serverStats";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getServerStats();
        setStats(data);
      } catch (err) { console.error("Failed to fetch stats", err); }
      finally { setLoading(false); }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">System Overview</h1>
          <p className="text-slate-500 dark:text-zinc-500 text-sm mt-1 font-medium">Real-time infrastructure monitoring and analytics.</p>
        </div>
      </div>

      {/* Info Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm dark:shadow-2xl">
         <div className="flex items-center gap-4 border-r border-slate-100 dark:border-white/5 pr-4 last:border-none">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center"><Monitor className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">OS System</p>
               <p className="text-sm font-bold text-slate-700 dark:text-gray-200 truncate">{stats?.osName || "Detecting..."}</p>
            </div>
         </div>
         <div className="flex items-center gap-4 border-r border-slate-100 dark:border-white/5 pr-4 last:border-none">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center"><Network className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">IP Address</p>
               <p className="text-sm font-bold text-slate-700 dark:text-gray-200">{stats?.ipAddress || "0.0.0.0"}</p>
            </div>
         </div>
         <div className="flex items-center gap-4 border-r border-slate-100 dark:border-white/5 pr-4 last:border-none">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center"><Server className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Hostname</p>
               <p className="text-sm font-bold text-slate-700 dark:text-gray-200 truncate">{stats?.hostname || "localhost"}</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center"><Hash className="w-5 h-5 text-orange-600 dark:text-orange-400" /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Active Port</p>
               <p className="text-sm font-bold text-slate-700 dark:text-gray-200">{stats?.port || "3000"}</p>
            </div>
         </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ServerCard
          title="CPU Usage"
          value={`${stats?.cpu || 0}%`}
          icon={<Cpu className="w-6 h-6 text-blue-500" />}
          subtitle={stats?.cpuModel}
          progress={stats?.cpu || 0}
          status={stats?.cpu > 80 ? "critical" : stats?.cpu > 50 ? "warning" : "normal"}
        />
        <ServerCard
          title="Memory Usage"
          value={stats?.freeMemory || "0 GB"}
          icon={<MemoryStick className="w-6 h-6 text-purple-500" />}
          subtitle={`Total: ${stats?.totalMemory || "0 GB"}`}
          progress={stats?.memoryUsage || 0}
          status={stats?.memoryUsage > 85 ? "critical" : "normal"}
        />
        <ServerCard
          title="Disk Storage"
          value={`${stats?.diskUsage || 0}%`}
          icon={<HardDrive className="w-6 h-6 text-emerald-500" />}
          subtitle="System root partition"
          progress={stats?.diskUsage || 0}
          status={stats?.diskUsage > 90 ? "critical" : "normal"}
        />
        <ServerCard
          title="System Uptime"
          value={stats?.uptime || "0d 0h 0m"}
          icon={<Clock className="w-6 h-6 text-orange-500" />}
          subtitle="Time since last boot"
        />
      </div>

      {/* Network Traffic Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm dark:shadow-2xl">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                <Activity className="w-5 h-5 text-purple-500" /> Network Traffic
              </h2>
              <span className="text-[10px] font-black text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 uppercase tracking-widest">Active</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-blue-500/30 transition-all">
                 <p className="text-slate-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Incoming Traffic</p>
                 <div className="flex items-end gap-3 text-slate-900 dark:text-white">
                    <span className="text-3xl font-black">{stats?.networkIn || "0 Mbps"}</span>
                    <ArrowUpRight className="w-5 h-5 text-blue-500 mb-1" />
                 </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-purple-500/30 transition-all">
                 <p className="text-slate-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Outgoing Traffic</p>
                 <div className="flex items-end gap-3 text-slate-900 dark:text-white">
                    <span className="text-3xl font-black">{stats?.networkOut || "0 Mbps"}</span>
                    <ArrowUpRight className="w-5 h-5 text-purple-500 mb-1" />
                 </div>
              </div>
           </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-b from-purple-500/10 to-transparent border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm dark:shadow-2xl bg-white dark:bg-transparent">
           <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white"><Box className="w-5 h-5 text-purple-500" /> Health Status</h2>
           <div className="space-y-4">
              {["API Gateway", "Database", "Docker Engine", "Panel Service"].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                   <span className="text-sm font-bold text-slate-500 dark:text-zinc-400">{s}</span>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-green-600 dark:text-green-500 uppercase tracking-tighter">Healthy</span>
                      <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                   </div>
                </div>
              ))}
           </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
