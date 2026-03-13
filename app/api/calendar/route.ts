import { NextResponse } from "next/server";
import { saveCalendarEvent } from "@/lib/repository";

export async function POST(request: Request) {
  const payload = await request.json();
  const event = await saveCalendarEvent(payload);
  return NextResponse.json(event);
}
