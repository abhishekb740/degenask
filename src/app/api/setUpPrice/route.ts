import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { price } = body;
  console.log(price);
  return NextResponse.json({ price: price, message: "Price set up successfully" });
}
