import { NextResponse } from "next/server";
import { saveTask } from "@/lib/repository";

export async function POST(request: Request) {
  const payload = await request.json();
  const task = await saveTask(payload);
  return NextResponse.json(task);
}
