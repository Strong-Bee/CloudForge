"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Play, Square, RotateCcw, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function ServiceManager() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch (err) { toast.error("Failed to load services"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 10000);
    return () => clearInterval(interval);
  }, []);

  const controlService = async (id: string, action: string) => {
    const toastId = toast.loading(`${action}ing ${id}...`);
    try {
      const res = await fetch("/api/services/control", {
        method: "POST",
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(`Service ${id} ${action}ed!`, { id: toastId });
      fetchServices();
    } catch (err: any) { toast.error(err.message, { id: toastId }); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">Service Manager</h1>
        <button onClick={fetchServices} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
          <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {loading && services.length === 0 ? (
           <div className="p-20 text-center"><RefreshCw className="w-10 h-10 animate-spin mx-auto text-teal-500" /></div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-white/5">
            {services.map((s, i) => (
              <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  {s.status === "running" ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                  <div>
                    <h3 className="font-bold text-white text-lg">{s.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-gray-400">{s.id}</span>
                      <span className={s.status === "running" ? "text-green-500" : "text-red-500 uppercase font-black"}>{s.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => controlService(s.id, "start")} className="p-2.5 bg-white/5 hover:bg-green-500/20 text-gray-400 hover:text-green-400 rounded-xl transition-all"><Play className="w-4 h-4" /></button>
                  <button onClick={() => controlService(s.id, "stop")} className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-all"><Square className="w-4 h-4" /></button>
                  <button onClick={() => controlService(s.id, "restart")} className="px-4 py-2.5 bg-white/5 hover:bg-teal-500/20 text-gray-300 hover:text-teal-400 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
                    <RotateCcw className="w-4 h-4" /> Restart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
