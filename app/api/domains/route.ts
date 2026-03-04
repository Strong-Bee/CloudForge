import { NextResponse } from "next/server";
import { getData } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const domains = getData("domains.json");
    return NextResponse.json(domains);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

