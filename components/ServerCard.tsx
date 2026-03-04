"use client";

import { motion } from "framer-motion";
import { TrendingUp, Activity, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

interface ServerCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  subtitle?: string;
  progress?: number;
  status?: "normal" | "warning" | "critical";
}

export default function ServerCard({
  title,
  value,
  icon,
  subtitle,
  progress,
  status = "normal",
}: ServerCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "warning": return "from-yellow-500/20 to-transparent border-yellow-500/20";
      case "critical": return "from-red-500/20 to-transparent border-red-500/20";
      default: return "from-white/5 to-transparent border-white/5";
    }
  };

  const getProgressColor = () => {
    if (status === "critical") return "bg-gradient-to-r from-red-600 to-pink-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]";
    if (status === "warning") return "bg-gradient-to-r from-yellow-600 to-orange-500 shadow-[0_0_12px_rgba(234,179,8,0.4)]";
    return "bg-gradient-to-r from-purple-600 to-blue-500 shadow-[0_0_12px_rgba(147,51,234,0.4)]";
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className={`p-6 rounded-3xl bg-gradient-to-br border backdrop-blur-md transition-all group relative overflow-hidden ${getStatusColor()}`}
    >
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-3xl group-hover:bg-white/10 transition-colors" />

      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
           {icon}
        </div>
        <div className="flex flex-col items-end">
           {status === "critical" && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
           {status === "normal" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">Live Monitor</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      </div>

      {progress !== undefined && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase text-gray-500">
            <span>Utilization</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${getProgressColor()}`}
            />
          </div>
        </div>
      )}

      {subtitle && (
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between group/link cursor-pointer">
          <span className="text-[10px] text-gray-500 font-medium truncate pr-4">{subtitle}</span>
          <ChevronRight className="w-3 h-3 text-gray-500 group-hover/link:text-white group-hover/link:translate-x-1 transition-all" />
        </div>
      )}
    </motion.div>
  );
}

