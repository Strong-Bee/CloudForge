import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { command } = await req.json();
    if (!command) return NextResponse.json({ output: "" });

    const isWin = os.platform() === "win32";
    // Jika di Linux, coba jalankan dengan sudo jika bukan root
    let cmd = command;
    if (!isWin && process.getuid && process.getuid() !== 0) {
       // cmd = `sudo ${command}`; // Opsi: Otomatis tambahkan sudo
    }

    const { stdout, stderr } = await execAsync(cmd);
    return NextResponse.json({
      output: stdout + (stderr ? "\\n" + stderr : "")
    });
  } catch (error: any) {
    return NextResponse.json({
      output: error.message || String(error)
    });
  }
}
