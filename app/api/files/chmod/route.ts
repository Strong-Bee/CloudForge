import { NextResponse } from "next/server";
import fs from "fs";
import os from "os";

export async function POST(req: Request) {
  try {
    const { path: targetPath, mode } = await req.json();
    if (os.platform() === "win32") {
      return NextResponse.json({ error: "Chmod is not supported on Windows native FS" }, { status: 400 });
    }
    
    fs.chmodSync(targetPath, parseInt(mode, 8));
    return NextResponse.json({ message: "Permissions updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
