import { NextResponse } from "next/server";
import { saveWikiPage } from "@/lib/repository";

export async function POST(request: Request) {
  const payload = await request.json();
  const page = await saveWikiPage(payload);
  return NextResponse.json(page);
}
