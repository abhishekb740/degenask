import { client } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, address, count, price } = body;

  try {
    const existingUser = await client.from("farstackUser").select("*").eq("username", username);
    if (existingUser?.data?.length) {
      const response = await client
        .from("farstackUser")
        .update({
          address,
          count,
          price,
        })
        .eq("username", username);
      if (response.error) {
        return NextResponse.json({ code: "failure", response });
      }
    } else {
      const response = await client.from("farstackUser").insert({
        username,
      });
      if (response.error) {
        return NextResponse.json({ code: "failure", response });
      }
    }
    return NextResponse.json({ code: "success" });
  } catch {
    return NextResponse.json({ code: "failure" });
  }
}
