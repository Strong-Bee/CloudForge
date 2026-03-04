import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json();
    if (!id || !action) return NextResponse.json({ error: "Service ID and action required" }, { status: 400 });

    const isWin = os.platform() === "win32";
    let cmd = "";

    if (isWin) {
      if (action === "restart") cmd = `powershell -NoProfile -Command "Restart-Service -Name '${id}' -Force"`;
      else if (action === "start") cmd = `powershell -NoProfile -Command "Start-Service -Name '${id}'"`;
      else if (action === "stop") cmd = `powershell -NoProfile -Command "Stop-Service -Name '${id}' -Force"`;
    } else {
      cmd = `sudo systemctl ${action} ${id}`;
    }

    const { stdout, stderr } = await execAsync(cmd);
    return NextResponse.json({ message: `Service ${action}ed successfully`, output: stdout + stderr });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
