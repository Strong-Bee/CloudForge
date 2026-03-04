"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Server, Play, Square, RotateCcw, Box } from "lucide-react";

export default function Servers() {
  const [containers, setContainers] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/docker/containers").then(res => res.json()).then(data => setContainers(Array.isArray(data) ? data : []));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Docker Containers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage isolated environments and microservices.</p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all">+ New Container</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {containers.length === 0 ? (
           <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
              <Box className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 font-bold">No Containers Found</p>
              <p className="text-sm text-gray-600 mt-2">Ensure Docker Desktop or Daemon is running on this machine.</p>
           </div>
        ) : containers.map((c, i) => (
          <motion.div key={i} whileHover={{ y: -4 }} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-2 h-full ${c.State === "running" ? "bg-green-500" : "bg-red-500"}`} />
            <h3 className="text-lg font-bold text-white mb-1 truncate pr-4">{c.Names[0].replace("/", "")}</h3>
            <p className="text-xs text-gray-500 font-mono mb-6 truncate">{c.Image}</p>
            
            <div className="flex items-center justify-between mt-auto">
               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${c.State === "running" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                 {c.State}
               </span>
               <div className="flex gap-2">
                 <button className="p-2 bg-white/5 hover:bg-green-500/20 text-gray-400 hover:text-green-400 rounded-lg transition-colors"><Play className="w-4 h-4" /></button>
                 <button className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"><Square className="w-4 h-4" /></button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

