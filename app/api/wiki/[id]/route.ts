import { NextResponse } from "next/server";
import { saveWikiPage } from "@/lib/repository";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await request.json();
  const { id } = await params;
  const page = await saveWikiPage({ ...payload, id });
  return NextResponse.json(page);
}
