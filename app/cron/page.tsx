"use client";
import { motion } from "framer-motion";
import { Clock, Plus, Trash2, TerminalSquare } from "lucide-react";

export default function CronJobs() {
  const jobs = [
    { id: 1, time: "0 0 * * *", command: "php artisan schedule:run", description: "Laravel Scheduler" },
    { id: 2, time: "30 2 * * 0", command: "/var/backups/backup.sh all", description: "Weekly Full Backup" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">Cron Jobs</h1>
        <p className="text-gray-500 text-sm mt-1">Schedule commands and scripts to run automatically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Cron Form */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="text-orange-500 w-5 h-5"/> New Cron Job</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Cron Expression</label>
              <input type="text" placeholder="* * * * *" defaultValue="0 0 * * *" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-orange-500 outline-none transition-colors" />
              <p className="text-[10px] text-gray-500 mt-1">Format: Minute Hour Day Month Weekday</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Command</label>
              <textarea placeholder="e.g. bash /scripts/run.sh" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-orange-500 outline-none transition-colors resize-none" />
            </div>
            <button className="w-full py-3.5 mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xl shadow-orange-500/20 transition-all">
              Add Job
            </button>
          </div>
        </div>

        {/* Cron List */}
        <div className="lg:col-span-2 space-y-4">
           {jobs.map((job) => (
             <div key={job.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between group">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex flex-col items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-orange-500 mb-0.5" />
                   </div>
                   <div>
                      <div className="flex items-center gap-3">
                         <span className="font-mono text-orange-400 font-bold bg-orange-400/10 px-2 py-0.5 rounded">{job.time}</span>
                         <span className="text-sm font-bold text-white">{job.description}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 font-mono">
                         <TerminalSquare className="w-3 h-3 text-gray-500" /> {job.command}
                      </div>
                   </div>
                </div>
                <div className="mt-4 md:mt-0">
                   <button className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
}
