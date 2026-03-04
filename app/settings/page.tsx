"use client";
import { motion } from "framer-motion";
import { Save, Server, Globe, Key, AlertTriangle, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">System Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure global server parameters and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* General Box */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Server className="text-purple-500 w-5 h-5"/> Instance Configuration</h2>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Server Hostname</label>
                <input type="text" defaultValue="CloudForge-Node-01" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Primary IP Address</label>
                <input type="text" defaultValue="192.168.1.100" disabled className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Security Box */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl">
             <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Key className="text-emerald-500 w-5 h-5"/> Security & Access</h2>
             <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-4 mb-6">
               <AlertTriangle className="text-red-500 shrink-0 w-6 h-6 mt-0.5" />
               <div>
                  <p className="text-red-400 font-bold text-sm">Danger Zone</p>
                  <p className="text-red-400/80 text-xs mt-1">Modifying SSH ports or root access can lock you out of your own server.</p>
               </div>
             </div>
             <div className="space-y-5">
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">SSH Port</label>
                 <input type="number" defaultValue="22" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 transition-colors" />
               </div>
             </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
           <button 
             onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }}
             className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-500/20"
           >
             {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
             Save All Changes
           </button>
        </div>
      </div>
    </motion.div>
  );
}

