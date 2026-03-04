"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Plus, Terminal, Key } from "lucide-react";

export default function Databases() {
  const [dbName, setDbName] = useState("");
  const [dbs] = useState([{ name: "wp_cloudforge", user: "root", size: "12 MB" }]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Database Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Manage MySQL schemas and user privileges.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create DB Form */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="text-emerald-500 w-5 h-5"/> Create Database</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Database Name</label>
              <input value={dbName} onChange={e => setDbName(e.target.value)} type="text" placeholder="db_name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
            </div>
            <button className="w-full py-3.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20">
              Create MySQL Database
            </button>
            <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
              <Terminal className="w-3 h-3" /> Executes native SQL queries.
            </p>
          </div>
        </div>

        {/* DB List */}
        <div className="lg:col-span-2 space-y-4">
           {dbs.map((db, i) => (
             <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between group">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                   <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Database className="w-6 h-6 text-emerald-500" />
                   </div>
                   <div>
                      <p className="font-bold text-white tracking-tight">{db.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                         <span className="flex items-center gap-1"><Key className="w-3 h-3"/> User: {db.user}</span>
                         <span>•</span>
                         <span>{db.size}</span>
                      </div>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button className="px-4 py-2 bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 text-xs font-bold rounded-lg transition-colors">Manage (phpMyAdmin)</button>
                   <button className="px-4 py-2 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 text-xs font-bold rounded-lg transition-colors">Drop</button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
}
