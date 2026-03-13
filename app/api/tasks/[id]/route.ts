import { NextResponse } from "next/server";
import { deleteTask, saveTask } from "@/lib/repository";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await request.json();
  const { id } = await params;
  const task = await saveTask({ ...payload, id });
  return NextResponse.json(task);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteTask(id);
  return NextResponse.json({ ok: true });
}
