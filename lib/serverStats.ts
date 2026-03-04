// lib/serverStats.ts
export interface Stats {
  cpu: number; // percent 0-100
  totalMemory: string; // "16.00 GB"
  freeMemory: string; // "6.21 GB"
  memoryUsage: number; // percent 0-100
  uptime: string; // "3d 4h 12m"
  cpuModel?: string;
  platform?: string;
  loadAverage?: number[];
  diskUsage?: number; // percent 0-100
  networkIn?: string; // "12.3 Mbps"
  networkOut?: string; // "4.8 Mbps"
  processes?: number;
}

export async function getServerStats(): Promise<Stats> {
  const res = await fetch("/api/server/status", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch server stats");

  return res.json();
}