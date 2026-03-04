"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Download, Trash2, Archive, Globe, Database, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function Backups() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchBackups = async () => {
    try {
      const res = await fetch("/api/backups");
      const data = await res.json();
      setBackups(data);
    } catch (err) { toast.error("Failed to load backups"); }
    finally { setIsFetching(false); }
  };

  useEffect(() => { fetchBackups(); }, []);

  const createBackup = async (type: string) => {
    setLoading(true);
    const toastId = toast.loading(`Creating ${type} backup...`);
    try {
      const res = await fetch("/api/backups/create", {
        method: "POST",
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("Backup successful!", { id: toastId });
      fetchBackups();
    } catch (err: any) { toast.error(err.message, { id: toastId }); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">Backup Manager</h1>
        <p className="text-gray-500 text-sm mt-1">Direct server backup to local ZIP/TAR archives.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => createBackup("full")} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl hover:border-indigo-500/50 transition-all cursor-pointer group">
           <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Archive className="text-indigo-400 w-6 h-6" /></div>
           <h3 className="font-bold text-lg">Full Backup</h3>
           <p className="text-xs text-gray-500 mt-1">Back up all web directories.</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
         {isFetching ? (
           <div className="p-20 text-center"><RefreshCw className="w-10 h-10 animate-spin mx-auto text-indigo-500" /></div>
         ) : (
           <div className="divide-y divide-white/5">
              {backups.length === 0 ? (
                <div className="p-20 text-center text-gray-500">No backups found.</div>
              ) : backups.map((b) => (
                <div key={b.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/[0.02] transition-colors">
                   <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                         <Save className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                         <p className="font-bold text-white text-sm truncate max-w-[200px]">{b.name}</p>
                         <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">{b.size} • {new Date(b.date).toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                         <Download className="w-4 h-4" /> Download
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
