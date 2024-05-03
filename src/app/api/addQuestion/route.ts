import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    return NextResponse.json({ message: "Question added " }, { status: 200 });
}