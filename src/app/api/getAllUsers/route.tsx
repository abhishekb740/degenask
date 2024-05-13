import { client } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const users = await client.from("farstackUser").select("*");
    return NextResponse.json(users);
  } catch (e) {
    console.log(e);
  }
}
