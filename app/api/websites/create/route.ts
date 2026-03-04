import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import { saveWebsite } from "@/lib/db";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { domain, type } = await req.json();
    if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

    const isWin = os.platform() === "win32";
    const scriptBase = "E:/Lintang/cloudforge/scripts";
    let cmd = "";

    if (isWin) {
      cmd = `powershell -ExecutionPolicy Bypass -File "${scriptBase}/create_site.ps1" -Domain "${domain}" -SiteType "${type || "static"}"`;
    } else {
      cmd = `sudo bash "${scriptBase}/create_site.sh" "${domain}" "${type || "static"}"`;
    }

    const { stdout, stderr } = await execAsync(cmd);
    
    // Save to Database
    saveWebsite({ domain, type, status: "Active" });

    return NextResponse.json({ message: "Site created successfully", output: stdout + stderr });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

