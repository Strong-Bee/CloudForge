import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const isWin = os.platform() === "win32";
    let targetPath = body.path;

    if (!targetPath) {
      targetPath = isWin ? "C:\\\\" : "/";
    }

    if (!fs.existsSync(targetPath)) {
       return NextResponse.json({ error: "Path not found" }, { status: 404 });
    }

    const items = fs.readdirSync(targetPath, { withFileTypes: true }).map(dirent => {
      try {
        const fullPath = path.join(targetPath, dirent.name);
        const stat = fs.statSync(fullPath);
        return {
          name: dirent.name,
          isDirectory: dirent.isDirectory(),
          size: stat.size,
          modified: stat.mtime,
          fullPath: fullPath
        };
      } catch (e) { return null; }
    }).filter(Boolean);

    return NextResponse.json({ 
      currentPath: path.resolve(targetPath),
      os: isWin ? "Windows" : "Linux",
      files: items 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
