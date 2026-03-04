import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { serviceName } = await req.json();
    if (!serviceName) return NextResponse.json({ error: "Service name required" }, { status: 400 });

    const isWin = os.platform() === "win32";
    let cmd = "";

    if (isWin) {
      cmd = `powershell -NoProfile -Command "Restart-Service -Name '${serviceName}'"`;
    } else {
      cmd = `sudo systemctl restart ${serviceName}`;
    }

    await execAsync(cmd);
    return NextResponse.json({ message: "Service restarted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
