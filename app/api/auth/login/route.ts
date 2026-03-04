import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyOsCredential } from "@/lib/osAuth";

const JWT_SECRET = process.env.JWT_SECRET || "CLOUDFORGE_SECRET_KEY";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password required" },
        { status: 400 }
      );
    }

    // Menggunakan Autentikasi Asli OS (Windows/Linux)
    const validPassword = await verifyOsCredential(username, password);

    if (!validPassword) {
      // Fallback sementara hanya jika dibutuhkan (bisa dihapus nanti)
      if (username === "admin" && password === "admin123") {
         console.log("Using fallback admin login");
      } else {
         return NextResponse.json(
          { message: "Invalid OS credentials" },
          { status: 401 }
        );
      }
    }

    const token = jwt.sign(
      { id: username, username, role: "admin" },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: { username, role: "admin" },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 jam
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
