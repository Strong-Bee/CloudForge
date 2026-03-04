"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Plus, Trash2, Shield, Search, RefreshCw, Link2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DomainManager() {
  const [domain, setDomain] = useState("");
  const [targetDir, setTargetDir] = useState("");
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetchDomains = async () => {
    try {
      const res = await fetch("/api/domains");
      const data = await res.json();
      setDomains(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load domains");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const addDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    setLoading(true);
    const toastId = toast.loading("Configuring domain...");
    try {
      const res = await fetch("/api/domains/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, targetDir, type: domain.includes(".") ? "Subdomain" : "Primary" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success(`Domain ${domain} added!`, { id: toastId });
      setDomain("");
      setTargetDir("");
      fetchDomains();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const deleteDomain = async (id: string, name: string) => {
    if (!confirm(`Remove ${name}? Binding will stay but record will be deleted.`)) return;
    try {
      await fetch("/api/domains/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      toast.success("Domain removed");
      fetchDomains();
    } catch (err) { toast.error("Failed"); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Domains & DNS</h1>
          <p className="text-gray-500 text-sm mt-1">Manage web bindings, aliases, and subdomains.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="text-purple-500 w-5 h-5"/> New Binding</h2>
          <form onSubmit={addDomain} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Domain/Subdomain</label>
              <input value={domain} onChange={e => setDomain(e.target.value)} type="text" placeholder="blog.example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Document Root (Path)</label>
              <input value={targetDir} onChange={e => setTargetDir(e.target.value)} type="text" placeholder="/var/www/blog" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors" />
            </div>
            <button disabled={loading || !domain} className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xl shadow-purple-500/20 transition-all">
              {loading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : "Link Domain"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
           {isFetching ? (
             <div className="py-20 text-center"><RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-500" /></div>
           ) : domains.length === 0 ? (
             <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-20 text-center">
               <Globe className="w-16 h-16 text-gray-700 mx-auto mb-4 opacity-30" />
               <p className="text-gray-400 font-bold">No Domains Mapped</p>
               <p className="text-xs text-gray-600 mt-2">Map your domains to server folders easily.</p>
             </div>
           ) : (
             domains.map((d) => (
               <div key={d.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between group">
                  <div className="flex items-center gap-5">
                     <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
                        <Link2 className="w-6 h-6 text-purple-500" />
                     </div>
                     <div>
                        <p className="font-bold text-white tracking-tight">{d.domain}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase truncate max-w-[200px]">{d.targetDir || "Default Root"}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                     <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 flex items-center gap-1">
                       <Shield className="w-3 h-3" /> SSL Active
                     </span>
                     <button onClick={() => deleteDomain(d.id, d.domain)} className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </motion.div>
  );
}
