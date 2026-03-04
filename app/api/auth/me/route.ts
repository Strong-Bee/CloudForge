import { NextResponse } from "next/server";
import os from "os";
import { execSync } from "child_process";

export async function GET() {
  try {
    const user = os.userInfo();
    const isWin = os.platform() === "win32";
    
    return NextResponse.json({
      username: user.username,
      uid: user.uid,
      gid: user.gid,
      shell: user.shell || (isWin ? "powershell" : "/bin/bash"),
      homedir: user.homedir,
      hostname: os.hostname(),
      platform: os.platform()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
