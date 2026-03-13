import { NextResponse } from "next/server";
import { saveContentItem } from "@/lib/repository";

export async function POST(request: Request) {
  const payload = await request.json();
  const item = await saveContentItem(payload);
  return NextResponse.json(item);
}
