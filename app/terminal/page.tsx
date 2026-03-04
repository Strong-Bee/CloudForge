"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon, Play, Trash2, Cpu } from "lucide-react";

export default function TerminalPage() {
  const [history, setHistory] = useState<{ type: "cmd" | "out" | "error"; text: string }[]>([
    { type: "out", text: "Welcome to CloudForge Web Terminal." },
    { type: "out", text: "Connected to local OS shell (Windows/Linux automatically detected)." },
  ]);
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const runCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const currentCmd = command;
    setCommand("");
    setHistory((prev) => [...prev, { type: "cmd", text: currentCmd }]);
    setLoading(true);

    try {
      const res = await fetch("/api/terminal/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: currentCmd }),
      });
      const data = await res.json();
      
      setHistory((prev) => [
        ...prev,
        { type: data.error ? "error" : "out", text: data.output || "No output returned." },
      ]);
    } catch (err: any) {
      setHistory((prev) => [...prev, { type: "error", text: "Failed to connect to terminal API." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[85vh] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            System Terminal
          </h1>
          <p className="text-gray-500 text-sm">Execute native shell commands directly on your server.</p>
        </div>
        <button 
          onClick={() => setHistory([{ type: "out", text: "Terminal cleared." }])}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-all text-sm font-bold"
        >
          <Trash2 className="w-4 h-4" /> Clear
        </button>
      </div>

      <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-emerald-500/10">
        {/* Terminal Header */}
        <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-6 gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
          <span className="ml-4 text-xs font-mono text-gray-500 flex items-center gap-2">
            <TerminalIcon className="w-4 h-4" /> bash / powershell
          </span>
        </div>

        {/* Output Area */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-2">
          {history.map((line, i) => (
            <div key={i} className={`whitespace-pre-wrap break-all ${line.type === "cmd" ? "text-emerald-400 font-bold" : line.type === "error" ? "text-red-400" : "text-gray-300"}`}>
              {line.type === "cmd" ? `root@cloudforge:~# ${line.text}` : line.text}
            </div>
          ))}
          {loading && <div className="text-emerald-400 animate-pulse">Running command...</div>}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/5 border-t border-white/5">
          <form onSubmit={runCommand} className="flex items-center gap-4">
            <span className="text-emerald-500 font-mono font-bold pl-2">$&gt;</span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              disabled={loading}
              placeholder="Enter OS command..."
              className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-gray-600 focus:ring-0"
              autoFocus
              autoComplete="off"
              spellCheck="false"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-10 h-10 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

