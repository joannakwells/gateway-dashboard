import { NextResponse } from "next/server";
import { saveCampaign } from "@/lib/repository";

export async function POST(request: Request) {
  const payload = await request.json();
  const campaign = await saveCampaign(payload);
  return NextResponse.json(campaign);
}
