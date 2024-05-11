import { client } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  const questionId = req.nextUrl.searchParams.get("questionId");

  try {
    let response;
    if (username) {
      response = await client.from("farstackQuestions").select("*").eq("creatorUsername", username);
    } else if (questionId) {
      response = await client.from("farstackQuestions").select("*").eq("questionId", questionId);
    } else {
      return NextResponse.json({ code: "failure", message: "Invalid parameters" });
    }

    if (response.error) {
      return NextResponse.json({ code: "failure", response });
    }
    return NextResponse.json({ code: "success", data: response.data });
  } catch {
    return NextResponse.json({ code: "failure" });
  }
}
