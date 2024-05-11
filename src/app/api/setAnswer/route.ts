import { client } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { questionId, content, creatorUsername, answerId } = body;

  const response = await client.from("farstackAnswers").insert({
    questionId,
    content,
    creatorUsername,
    answerId,
  });
  if (response.error) {
    return NextResponse.json({ code: "failure", response });
  }
  return NextResponse.json({ code: "success" });
}
