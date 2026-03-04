import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) return NextResponse.json([]);

    const files = fs.readdirSync(backupDir).map(file => {
      const stats = fs.statSync(path.join(backupDir, file));
      return {
        id: file,
        name: file,
        size: (stats.size / 1024 / 1024).toFixed(2) + " MB",
        date: stats.mtime,
        type: file.includes("full") ? "Full" : "Partial"
      };
    });

    return NextResponse.json(files);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
