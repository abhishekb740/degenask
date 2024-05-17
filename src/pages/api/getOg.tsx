/* eslint-disable @next/next/no-img-element */
import { getUserData } from "@/app/_actions/queries";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export default async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const username = searchParams.get("username");

    if (!username) {
      throw new Error("No username provided");
    }

    const profile = await getUserData(username);
    const pfp = profile.Socials.Social[0].profileImage;

    return new ImageResponse(
      (
        <div
          style={{
            backgroundImage: `url("https://i.ibb.co/mHh7gKt/og-bg.png")`,
            backgroundSize: "570px 320px",
            position: "relative",
          }}
          tw="flex items-center justify-center p-8 w-full min-h-screen"
        >
          <img
            src={pfp}
            tw="w-52 h-52 bg-white p-2 rounded-full"
            alt="pfp"
            style={{
              objectFit: "cover",
            }}
          />
          <img
            src="https://i.ibb.co/86v435d/og-nit.png"
            tw="absolute w-60 h-36 bottom-3 right-28"
            alt="tag"
          />
        </div>
      ),
      {
        width: 570,
        height: 320,
      },
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
