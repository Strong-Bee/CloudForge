"use client";
import { motion } from "framer-motion";
import { Save, Server, Key, Shield, User, Terminal, HardDrive, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(res => res.json()).then(data => setUser(data));
  }, []);

  const tabs = [
    { id: "general", label: "General", icon: Server },
    { id: "account", label: "OS Account", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">System Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage global preferences and native OS account details.</p>
        </div>
        <button onClick={() => { setLoading(true); setTimeout(() => {setLoading(false); toast.success("Settings saved!");}, 1000)}} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all">
          {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tab Sidebar */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all ${activeTab === t.id ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}>
              <t.icon className="w-5 h-5" /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-purple-400"><Server className="w-5 h-5"/> Server Instance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Hostname</label>
                  <input type="text" defaultValue={user?.hostname} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Timezone</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"><option>UTC +07:00 (Jakarta)</option></select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-8">
              <div className="flex items-center gap-6 p-6 bg-purple-500/5 border border-purple-500/10 rounded-3xl">
                 <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-purple-500/20">
                    {user?.username?.[0].toUpperCase()}
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-white">@{user?.username}</h2>
                    <p className="text-purple-400 font-bold text-sm uppercase tracking-tighter mt-1">{user?.platform === "win32" ? "System Administrator" : "Linux Superuser"}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Terminal className="w-3 h-3"/> Default Shell</p>
                    <p className="font-mono text-sm text-gray-300">{user?.shell}</p>
                 </div>
                 <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><HardDrive className="w-3 h-3"/> Home Directory</p>
                    <p className="font-mono text-sm text-gray-300 truncate">{user?.homedir}</p>
                 </div>
                 <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">UID / GID</p>
                    <p className="font-mono text-sm text-gray-300">{user?.uid} / {user?.gid}</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-red-400"><Shield className="w-5 h-5"/> Firewall & Access</h2>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6">
                 <p className="text-red-400 text-xs font-bold leading-relaxed">This panel uses Native OS Authentication. To change your password, please use the OS native command (e.g. `passwd` on Linux or `net user` on Windows).</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
