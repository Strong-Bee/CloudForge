import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { type } = await req.json();
    const isWin = os.platform() === "win32";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupName = `backup_${type}_${timestamp}.${isWin ? "zip" : "tar.gz"}`;
    const backupDir = path.join(process.cwd(), "backups");
    
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const targetPath = path.join(backupDir, backupName);
    const sourceDir = isWin ? "C:\\inetpub\\wwwroot" : "/var/www";

    let cmd = "";
    if (isWin) {
      cmd = `powershell -NoProfile -Command "Compress-Archive -Path '${sourceDir}\\*' -DestinationPath '${targetPath}' -Force"`;
    } else {
      cmd = `sudo tar -czf ${targetPath} -C ${sourceDir} .`;
    }

    await execAsync(cmd);
    return NextResponse.json({ message: "Backup created successfully", name: backupName });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
