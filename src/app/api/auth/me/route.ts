import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE } from "@/global/cookie";
import { SERVER_CONFIG } from "@/global/config";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE.access_token)?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SERVER_CONFIG.AUTH.JWT_SECRET),
      { algorithms: ["HS512"] }
    );

    return NextResponse.json({ user: payload });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
