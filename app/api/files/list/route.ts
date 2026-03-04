import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const isWin = os.platform() === "win32";
    
    // Jika tidak ada path, mulai dari Root OS
    let targetPath = body.path || (isWin ? "C:\\" : "/");

    // Pastikan path valid
    if (!fs.existsSync(targetPath)) {
       return NextResponse.json({ error: "Path not found: " + targetPath }, { status: 404 });
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
      } catch (e) {
        // Abaikan file sistem yang aksesnya ditolak (Access Denied)
        return null;
      }
    }).filter(Boolean);

    // Sorting: Folder di atas
    items.sort((a: any, b: any) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ 
      currentPath: path.resolve(targetPath),
      os: isWin ? "Windows" : "Linux",
      files: items 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

