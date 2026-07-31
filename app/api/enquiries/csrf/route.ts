import { NextResponse } from "next/server";
import { csrfCookie, issueCsrfToken } from "@/lib/csrf";

export const dynamic = "force-dynamic";

export function GET() {
  const token = issueCsrfToken();
  return NextResponse.json(
    { token },
    {
      headers: {
        "Cache-Control": "no-store",
        "Set-Cookie": csrfCookie(token),
      },
    },
  );
}
