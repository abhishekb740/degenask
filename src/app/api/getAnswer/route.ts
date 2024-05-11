import { client } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const questionId = req.nextUrl.searchParams.get("questionId");
  try {
    const response = await client.from("farstackAnswers").select("*").eq("questionId", questionId);
    if (response.error) {
      return NextResponse.json({ code: "failure", response });
    }
    return NextResponse.json({ code: "success", data: response.data });
  } catch {
    return NextResponse.json({ code: "failure" });
  }
}
