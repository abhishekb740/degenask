import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  console.log(request.body);
  const body = await request.json();
  const { name, image, price, bio } = body;
  return NextResponse.json({ name, image, price, bio, message: "User registered successfully" });
}
