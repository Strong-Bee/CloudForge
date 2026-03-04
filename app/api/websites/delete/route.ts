import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import { deleteWebsite } from "@/lib/db";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    // Delete from DB
    const site = deleteWebsite(id);
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    // Delete folder from server (Windows/Linux)
    const isWin = os.platform() === "win32";
    if (isWin) {
       await execAsync(`powershell -NoProfile -Command "Remove-Item -Recurse -Force 'C:\\inetpub\\wwwroot\\${site.domain}' -ErrorAction SilentlyContinue"`);
    } else {
       await execAsync(`sudo rm -rf /var/www/${site.domain}`);
    }

    return NextResponse.json({ message: "Site deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

