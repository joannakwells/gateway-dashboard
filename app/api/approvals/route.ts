import { NextResponse } from "next/server";
import { saveApproval } from "@/lib/repository";

export async function POST(request: Request) {
  const payload = await request.json();
  const approval = await saveApproval(payload);
  return NextResponse.json(approval);
}

export async function PATCH(request: Request) {
  const payload = await request.json();
  const approval = await saveApproval(payload);
  return NextResponse.json(approval);
}
