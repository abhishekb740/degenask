import { client } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const users = await client.from("farstackUser").select("*");
    return NextResponse.json({ code: "success", data: users.data });
  } catch {
    return NextResponse.json({ code: "failure" });
  }
}
