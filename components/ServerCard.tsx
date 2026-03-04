"use client";

import { motion } from "framer-motion";
import { TrendingUp, Activity, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

interface ServerCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle?: string;
  progress?: number;
  status?: "normal" | "warning" | "critical";
}

export default function ServerCard({ title, value, icon, subtitle, progress, status = "normal" }: ServerCardProps) {
  const getStatusBorder = () => {
    if (status === "critical") return "border-red-500/50 dark:border-red-500/20";
    if (status === "warning") return "border-amber-500/50 dark:border-amber-500/20";
    return "border-slate-200 dark:border-white/5";
  };

  const getProgressColor = () => {
    if (status === "critical") return "bg-red-500";
    if (status === "warning") return "bg-amber-500";
    return "bg-purple-600";
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border ${getStatusBorder()} shadow-sm dark:shadow-2xl transition-all group relative overflow-hidden`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/5">
           {icon}
        </div>
        <div className="flex flex-col items-end">
           {status === "critical" ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-600 mt-1">Live</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-slate-500 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
      </div>

      {progress !== undefined && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 dark:text-zinc-600">
            <span>Utilization</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full rounded-full ${getProgressColor()}`} />
          </div>
        </div>
      )}

      {subtitle && (
        <div className="mt-6 pt-4 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold truncate pr-4">{subtitle}</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-zinc-700" />
        </div>
      )}
    </motion.div>
  );
}
