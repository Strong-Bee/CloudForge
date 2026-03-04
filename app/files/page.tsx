"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileText, ChevronRight, Upload, Trash2, RefreshCw, HardDrive, ArrowLeft, Plus, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [osName, setOsName] = useState("");
  const [showPermModal, setShowPermModal] = useState<any>(null);
  const [newPerm, setNewPerm] = useState("755");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = async (targetPath: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/files/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: targetPath }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFiles(data.files || []);
      setCurrentPath(data.currentPath);
      setOsName(data.os);
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadFiles(""); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", currentPath);

    const toastId = toast.loading(`Uploading ${file.name}...`);
    try {
      const res = await fetch("/api/files/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      toast.success("File uploaded!", { id: toastId });
      loadFiles(currentPath);
    } catch (err: any) { toast.error(err.message, { id: toastId }); }
  };

  const createFolder = async () => {
    const name = prompt("Enter folder name:");
    if (!name) return;
    try {
      await fetch("/api/files/mkdir", {
        method: "POST",
        body: JSON.stringify({ path: currentPath, name }),
      });
      toast.success("Folder created");
      loadFiles(currentPath);
    } catch (err) { toast.error("Failed to create folder"); }
  };

  const updatePermissions = async () => {
    try {
      const res = await fetch("/api/files/chmod", {
        method: "POST",
        body: JSON.stringify({ path: showPermModal.fullPath, mode: newPerm }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("Permissions updated");
      setShowPermModal(null);
      loadFiles(currentPath);
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">System Explorer</h1>
          <p className="text-gray-500 text-sm mt-1">Manage OS files and permissions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => loadFiles(currentPath)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all"><RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? "animate-spin" : ""}`} /></button>
          <button onClick={createFolder} className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl flex items-center gap-2 transition-all"><Plus className="w-4 h-4" /> New Folder</button>
          <button onClick={() => fileInputRef.current?.click()} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all"><Upload className="w-4 h-4" /> Upload File</button>
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[75vh] relative">
        <div className="h-14 bg-white/5 border-b border-white/5 flex items-center px-6 gap-2 text-sm">
           <button onClick={() => loadFiles("")} className="hover:text-blue-400 text-gray-400 transition-colors flex items-center gap-2 font-bold"><HardDrive className="w-4 h-4" /> ROOT</button>
           <ChevronRight className="w-4 h-4 text-gray-700" />
           <div className="flex-1 font-mono text-gray-300 truncate text-xs">{currentPath}</div>
           <button onClick={() => {
             const parts = currentPath.split(/[\\/]/).filter(Boolean);
             parts.pop();
             const p = osName === "Windows" ? (parts.length > 0 ? parts.join("\\") + "\\" : "C:\\") : ("/" + parts.join("/"));
             loadFiles(p);
           }} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 flex items-center gap-1 font-bold text-xs"><ArrowLeft className="w-4 h-4" /> UP</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
           {files.length === 0 && !loading ? (
             <div className="text-center py-20 text-gray-600 font-bold">Directory is empty or restricted.</div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
               {files.map((f, i) => (
                 <div key={i} className="flex items-center gap-4 p-3 rounded-xl transition-all group hover:bg-white/5 border border-transparent hover:border-white/5">
                    <div onClick={() => f.isDirectory && loadFiles(f.fullPath)} className={`shrink-0 ${f.isDirectory ? "cursor-pointer" : ""}`}>
                       {f.isDirectory ? <Folder className="w-8 h-8 text-blue-400 fill-blue-400/20" /> : <FileText className="w-8 h-8 text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-bold text-gray-200 truncate text-sm">{f.name}</p>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{!f.isDirectory ? (f.size / 1024).toFixed(1) + " KB" : "Directory"}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       {osName !== "Windows" && (
                         <button onClick={() => {setNewPerm("755"); setShowPermModal(f)}} className="p-2 hover:bg-purple-500/20 text-gray-500 hover:text-purple-400 rounded-lg transition-colors"><ShieldCheck className="w-4 h-4" /></button>
                       )}
                       <button className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Permissions Modal */}
        <AnimatePresence>
          {showPermModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold">Permissions</h3>
                     <button onClick={() => setShowPermModal(null)}><X className="w-5 h-5 text-gray-500" /></button>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 truncate font-mono">{showPermModal.name}</p>
                  <div className="space-y-4">
                     <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Octal Mode</label>
                        <input type="text" value={newPerm} onChange={e => setNewPerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-center text-2xl focus:border-purple-500 outline-none" placeholder="755" />
                     </div>
                     <button onClick={updatePermissions} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all">Apply Chmod</button>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
