import { NextResponse } from "next/server";
import { execSync } from "child_process";
import os from "os";

export const dynamic = "force-dynamic";

function getServiceStatus(name: string, isWin: boolean) {
  try {
    if (isWin) {
      const out = execSync(`powershell -NoProfile -Command "(Get-Service -Name '${name}' -ErrorAction SilentlyContinue).Status"`, { encoding: "utf8" }).trim();
      return out.toLowerCase() === "running" ? "running" : "stopped";
    } else {
      const out = execSync(`systemctl is-active ${name}`, { encoding: "utf8" }).trim();
      return out === "active" ? "running" : "stopped";
    }
  } catch { return "stopped"; }
}

export async function GET() {
  const isWin = os.platform() === "win32";
  const servicesToTrack = isWin 
    ? [{ name: "World Wide Web Publishing Service", id: "W3SVC" }, { name: "MySQL", id: "MySQL" }, { name: "Docker Desktop Service", id: "com.docker.service" }]
    : [{ name: "Nginx Web Server", id: "nginx" }, { name: "MySQL Database", id: "mysql" }, { name: "SSH Server", id: "ssh" }];

  const results = servicesToTrack.map(s => ({
    name: s.name,
    id: s.id,
    status: getServiceStatus(s.id, isWin),
    uptime: "Live"
  }));

  return NextResponse.json(results);
}
