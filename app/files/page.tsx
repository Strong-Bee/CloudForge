"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Folder, FileText, ChevronRight, Home, Upload, Trash2, RefreshCw, HardDrive, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [osName, setOsName] = useState("");

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
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles("");
  }, []);

  const navigateTo = (targetPath: string) => {
    loadFiles(targetPath);
  };

  const goUp = () => {
    if (!currentPath) return;
    const parts = currentPath.split(/[\\/]/).filter(Boolean);
    parts.pop();
    const isWin = osName === "Windows";
    const separator = isWin ? "\\" : "/";
    const newPath = isWin ? (parts.length > 0 ? parts.join(separator) + separator : "C:\\") : ("/" + parts.join(separator));
    loadFiles(newPath);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">System File Explorer</h1>
          <p className="text-gray-500 text-sm mt-1">Exploring {osName} System</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => loadFiles(currentPath)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[75vh]">
        {/* Breadcrumb Path Bar */}
        <div className="h-14 bg-white/5 border-b border-white/5 flex items-center px-6 gap-2 text-sm">
           <button onClick={() => loadFiles("")} className="hover:text-blue-400 text-gray-400 transition-colors flex items-center gap-2">
             <HardDrive className="w-4 h-4" /> Root
           </button>
           <ChevronRight className="w-4 h-4 text-gray-700" />
           <div className="flex-1 font-mono text-gray-300 truncate">{currentPath}</div>
           <button onClick={goUp} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 transition-all flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
           </button>
        </div>

        {/* File List Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
           {loading && files.length === 0 ? (
             <div className="flex flex-col justify-center items-center h-full gap-4">
               <RefreshCw className="w-10 h-10 animate-spin text-blue-500" />
               <p className="text-gray-500 font-bold animate-pulse">Reading Disk...</p>
             </div>
           ) : files.length === 0 ? (
             <div className="text-center py-20 text-gray-500 font-medium">Directory is empty or access denied.</div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
               {files.map((f, i) => (
                 <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.01 }}
                    key={i} 
                    onClick={() => f.isDirectory && navigateTo(f.fullPath)}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${f.isDirectory ? "hover:bg-blue-500/10 cursor-pointer" : "hover:bg-white/5"}`}
                 >
                    <div className="shrink-0">
                       {f.isDirectory ? (
                          <Folder className="w-8 h-8 text-blue-400 fill-blue-400/20 group-hover:fill-blue-400/40" />
                       ) : (
                          <FileText className="w-8 h-8 text-gray-500" />
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-bold text-gray-200 group-hover:text-white transition-colors truncate">{f.name}</p>
                       <div className="text-[10px] text-gray-500 flex gap-3 mt-0.5 font-bold uppercase tracking-wider">
                          {!f.isDirectory ? <span>{formatSize(f.size)}</span> : <span className="text-blue-500/60">Directory</span>}
                          <span>{new Date(f.modified).toLocaleDateString()}</span>
                       </div>
                    </div>
                 </motion.div>
               ))}
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}
