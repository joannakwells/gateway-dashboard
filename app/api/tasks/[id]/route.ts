import { NextResponse } from "next/server";
import { deleteTask } from "@/lib/repository";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteTask(id);
  return NextResponse.json({ ok: true });
}
