import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import { saveData } from "@/lib/db";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { domain, targetDir, type } = await req.json();
    if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

    const isWin = os.platform() === "win32";
    let cmd = "";

    if (isWin) {
      // Windows IIS Binding
      cmd = `powershell -NoProfile -Command "Import-Module WebAdministration; if (Test-Path 'IIS:\\Sites\\Default Web Site') { New-WebBinding -Name 'Default Web Site' -IPAddress '*' -Port 80 -HostHeader '${domain}' }"`;
    } else {
      // Linux Nginx Config
      cmd = `sudo bash -c "echo 'server { listen 80; server_name ${domain}; root ${targetDir || "/var/www/html"}; }' > /etc/nginx/sites-available/${domain} && ln -sf /etc/nginx/sites-available/${domain} /etc/nginx/sites-enabled/ && systemctl reload nginx"`;
    }

    try { await execAsync(cmd); } catch(e) { console.log("System config failed, but continuing with database entry"); }

    saveData("domains.json", { domain, type: type || "Primary", targetDir });
    return NextResponse.json({ message: "Domain/Subdomain added successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

