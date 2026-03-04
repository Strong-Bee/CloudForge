import { NextResponse } from "next/server";
import os from "os";
import { execSync } from "child_process";

export const runtime = "nodejs";

function toGB(bytes: number) {
  return (bytes / 1024 / 1024 / 1024).toFixed(2);
}

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400);
  seconds %= 86400;
  const h = Math.floor(seconds / 3600);
  seconds %= 3600;
  const m = Math.floor(seconds / 60);
  return `${d}d ${h}h ${m}m`;
}

function safeExec(cmd: string) {
  try {
    return execSync(cmd, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

export async function GET() {
  const isWin = os.platform() === "win32";
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedPct = Math.round(((totalMem - freeMem) / totalMem) * 100);

  let cpuUsage = 0;
  if (isWin) {
    const cpuRaw = safeExec("wmic cpu get loadpercentage /value");
    cpuUsage = Number(cpuRaw.replace("LoadPercentage=", "")) || 0;
  } else {
    const cores = os.cpus().length || 1;
    const load1 = os.loadavg()[0] || 0;
    cpuUsage = Math.round(Math.min(100, (load1 / cores) * 100));
  }

  let diskUsage = 0;
  if (isWin) {
    const psCmd = safeExec("powershell -NoProfile -Command \"(Get-CimInstance Win32_LogicalDisk | Where-Object DeviceID -eq 'C:') | Select-Object @{N='UsePct';E={[math]::Round(($_.Size - $_.FreeSpace) / $_.Size * 100)}} | ForEach-Object { $_.UsePct }\"");
    diskUsage = Number(psCmd) || 0;
  } else {
    const df = safeExec("df -P / | tail -1");
    if (df) {
      const parts = df.split(/\\s+/);
      diskUsage = Number(parts?.[4]?.replace("%", "")) || 0;
    }
  }

  const osName = isWin ? safeExec("powershell -NoProfile -Command \"(Get-CimInstance Win32_OperatingSystem).Caption\"") : safeExec("lsb_release -ds || cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2");

  return NextResponse.json({
    cpu: cpuUsage,
    totalMemory: `${toGB(totalMem)} GB`,
    freeMemory: `${toGB(freeMem)} GB`,
    memoryUsage: usedPct,
    uptime: formatUptime(os.uptime()),
    cpuModel: os.cpus()?.[0]?.model || "Unknown CPU",
    platform: os.platform(),
    osName: osName.replace(/\"/g, ""),
    hostname: os.hostname(),
    ipAddress: getLocalIp(),
    port: process.env.PORT || "3000",
    arch: os.arch(),
    loadAverage: os.loadavg().map((n) => Number(n.toFixed(2))),
    diskUsage,
    processes: isWin ? Number(safeExec("powershell -NoProfile -Command \"(Get-Process).Count\"")) : Number(safeExec("ps -e --no-headers | wc -l")),
  });
}
