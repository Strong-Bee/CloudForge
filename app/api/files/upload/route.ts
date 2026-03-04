import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const targetDir = formData.get("path") as string;

    if (!file || !targetDir) return NextResponse.json({ error: "Missing file or path" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(targetDir, file.name);

    fs.writeFileSync(filePath, buffer);
    return NextResponse.json({ message: "File uploaded successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
