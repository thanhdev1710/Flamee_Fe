import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { CONFIG } from "@/global/config";
import { COOKIE } from "@/global/cookie";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE.access_token)?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(CONFIG.JWT_SECRET),
      { algorithms: ["HS512"] }
    );
    console.log(payload);

    return NextResponse.json({ user: payload });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
