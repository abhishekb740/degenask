import { client } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    questionId,
    content,
    creatorUsername,
    creatorAddress,
    authorUsername,
    authorAddress,
    price,
    isAnswered,
  } = body;

  try {
    const existingQuestion = await client
      .from("farstackQuestions")
      .select("*")
      .eq("questionId", questionId);
    if (existingQuestion?.data?.length) {
      const response = await client
        .from("farstackQuestions")
        .update({
          isAnswered,
        })
        .eq("questionId", questionId);
      if (response.error) {
        return NextResponse.json({ code: "failure", response });
      }
    } else {
      const response = await client.from("farstackQuestions").insert({
        questionId,
        content,
        creatorUsername,
        creatorAddress,
        authorUsername,
        authorAddress,
        price,
        isAnswered,
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
