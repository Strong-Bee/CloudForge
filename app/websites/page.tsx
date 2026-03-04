"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Plus, RefreshCw, Trash2, Edit2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Site {
  id: string;
  domain: string;
  type: string;
  status: string;
  createdAt: string;
}

export default function Websites() {
  const [domain, setDomain] = useState("");
  const [type, setType] = useState("static");
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetchSites = async () => {
    try {
      const res = await fetch("/api/websites");
      const data = await res.json();
      setSites(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load websites");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const createSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    setLoading(true);
    const toastId = toast.loading("Deploying site...");
    try {
      const res = await fetch("/api/websites/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, type }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success(`Site ${domain} deployed successfully!`, { id: toastId });
      setDomain("");
      fetchSites(); // Reload data
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const deleteSite = async (id: string, domainName: string) => {
    if (!confirm(`Are you sure you want to delete ${domainName} and all its files?`)) return;
    
    const toastId = toast.loading("Deleting site...");
    try {
      const res = await fetch("/api/websites/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success("Site deleted successfully", { id: toastId });
      fetchSites(); // Reload data
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-orange-400">Websites Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Full CRUD control for your web domains and files.</p>
        </div>
        <button onClick={fetchSites} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          <RefreshCw className={`w-5 h-5 text-gray-400 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CREATE FORM */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="text-pink-500 w-5 h-5"/> Deploy New Site</h2>
          <form onSubmit={createSite} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Domain Name</label>
              <input value={domain} onChange={e => setDomain(e.target.value)} type="text" placeholder="example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Site Environment</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none appearance-none">
                <option value="static" className="bg-zinc-900">Static HTML</option>
                <option value="php" className="bg-zinc-900">PHP Application</option>
                <option value="nodejs" className="bg-zinc-900">Node.js App</option>
                <option value="wordpress" className="bg-zinc-900">WordPress CMS</option>
              </select>
            </div>
            <button disabled={loading || !domain} className="w-full py-3.5 mt-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-pink-500/20">
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Deploy Now"}
            </button>
          </form>
        </div>

        {/* LIST / READ AREA */}
        <div className="lg:col-span-2 space-y-4">
           {isFetching ? (
             <div className="py-20 text-center"><RefreshCw className="w-8 h-8 animate-spin mx-auto text-pink-500" /></div>
           ) : sites.length === 0 ? (
             <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-20 text-center">
               <Globe className="w-16 h-16 text-gray-700 mx-auto mb-4 opacity-30" />
               <p className="text-gray-400 font-bold">Database is Empty</p>
               <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">You have not deployed any websites yet. Use the form to create one.</p>
             </div>
           ) : (
             sites.map((s) => (
               <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={s.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between group hover:border-pink-500/30 transition-all shadow-lg">
                  <div className="flex items-center gap-5 mb-4 md:mb-0">
                     <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-orange-500/20 border border-white/5 rounded-xl flex items-center justify-center shrink-0">
                        <Globe className="w-6 h-6 text-pink-500" />
                     </div>
                     <div>
                        <a href={`http://${s.domain}`} target="_blank" className="font-bold text-white tracking-tight text-lg hover:text-pink-400 transition-colors">{s.domain}</a>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                           <span className="uppercase tracking-widest font-black text-orange-400">{s.type}</span>
                           <span>•</span>
                           <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                        </div>
                     </div>
                  </div>
                  
                  {/* UPDATE & DELETE ACTIONS */}
                  <div className="flex items-center gap-3 border-t border-white/5 md:border-none pt-4 md:pt-0">
                     <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20 flex items-center gap-1">
                       <CheckCircle className="w-3 h-3" /> {s.status}
                     </span>
                     <button className="p-2.5 bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-lg transition-colors tooltip" title="Edit Settings">
                        <Edit2 className="w-4 h-4" />
                     </button>
                     <button onClick={() => deleteSite(s.id, s.domain)} className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors tooltip" title="Delete Site">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               </motion.div>
             ))
           )}
        </div>
      </div>
    </motion.div>
  );
}
