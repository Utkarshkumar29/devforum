import { NextRequest, NextResponse } from "next/server";
import { getCachedFeedPage } from "@/app/lib/cachedFeed";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;

function positiveInteger(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const page = positiveInteger(request.nextUrl.searchParams.get("page"), 1);
  const limit = Math.min(
    positiveInteger(request.nextUrl.searchParams.get("limit"), DEFAULT_LIMIT),
    MAX_LIMIT,
  );

  try {
    const data = await getCachedFeedPage(page, limit, authorization);
    return NextResponse.json(data);
  } catch (error) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? Number(error.status)
        : 502;

    return NextResponse.json(
      { message: "Could not load feed" },
      { status: status >= 400 && status < 600 ? status : 502 },
    );
  }
}
