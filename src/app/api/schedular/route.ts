import { scheduleSubscriptionCleanup } from "@/lib/schedular";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  scheduleSubscriptionCleanup();
  return NextResponse.json({ message: "Cron started" });
}
