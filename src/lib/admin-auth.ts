import { NextResponse } from "next/server";

export function ensureAdmin(request: Request): NextResponse | null {
  const expectedToken = process.env.ADMIN_API_TOKEN;

  if (!expectedToken) {
    return NextResponse.json(
      { error: "ADMIN_API_TOKEN belum dikonfigurasi di server." },
      { status: 500 },
    );
  }

  const headerToken = request.headers.get("x-admin-token")?.trim() || "";
  const bearerToken = request.headers
    .get("authorization")
    ?.replace("Bearer ", "")
    .trim() || "";

  const token = headerToken || bearerToken;

  if (!token || token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return null;
}
