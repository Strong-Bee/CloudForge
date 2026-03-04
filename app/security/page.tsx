"use client";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, Lock, Ban } from "lucide-react";

export default function Security() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-rose-500">Security & Firewall</h1>
        <p className="text-gray-500 text-sm mt-1">Manage IP blocking, ModSecurity, and Brute Force Protection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Ban className="text-red-500 w-5 h-5"/> IP Blocker (Firewall)</h2>
          <div className="flex gap-3 mb-6">
             <input type="text" placeholder="Enter IP Address (e.g. 192.168.1.1)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-red-500 outline-none" />
             <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">Block IP</button>
          </div>
          <div className="border border-white/5 rounded-xl overflow-hidden">
             <div className="p-3 bg-white/5 border-b border-white/5 flex justify-between text-xs font-bold text-gray-500 uppercase">
                <span>Blocked IP</span>
                <span>Action</span>
             </div>
             <div className="p-4 text-center text-sm text-gray-400">No IPs currently blocked.</div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center"><Shield className="text-green-500 w-6 h-6" /></div>
                 <div>
                    <h3 className="font-bold text-white">ModSecurity (WAF)</h3>
                    <p className="text-xs text-gray-500">Web Application Firewall is active.</p>
                 </div>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center px-1 justify-end cursor-pointer"><div className="w-4 h-4 bg-white rounded-full" /></div>
           </div>
           
           <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center"><Lock className="text-orange-500 w-6 h-6" /></div>
                 <div>
                    <h3 className="font-bold text-white">Brute Force Protection</h3>
                    <p className="text-xs text-gray-500">Auto-ban IPs after 5 failed logins.</p>
                 </div>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center px-1 justify-end cursor-pointer"><div className="w-4 h-4 bg-white rounded-full" /></div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
