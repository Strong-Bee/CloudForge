import { NextResponse } from "next/server";
import { deleteData } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    deleteData("domains.json", id);
    return NextResponse.json({ message: "Domain removed" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

