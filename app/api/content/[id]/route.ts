import { NextResponse } from "next/server";
import { deleteContentItem, saveContentItem } from "@/lib/repository";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await request.json();
  const { id } = await params;
  const item = await saveContentItem({ ...payload, id });
  return NextResponse.json(item);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteContentItem(id);
  return NextResponse.json({ ok: true });
}
