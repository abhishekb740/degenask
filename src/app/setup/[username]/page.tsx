import { getUser, getUserData } from "@/app/_actions/queries";
import { User } from "@/types";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const fetchCache = "force-no-store";

type Props = {
  params: {
    username: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params.username;
  const profile = await getUserData(username);
  return {
    title: `${profile.Socials.Social[0].profileDisplayName} | DegenAsk`,
    icons: profile.Socials.Social[0].profileImage,
    description:
      "Ask anything you're curious about, learn from the creator's thoughts, and earn $DEGEN for your questions.",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: process.env.NEXT_PUBLIC_HOST_URL,
      siteName: "DegenAsk",
      images: {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/api/getOg?username=${username}`,
        alt: "DegenAsk",
      },
    },
  };
}

const SetupProfile = dynamic(() => import("@/components/setup"), {
  loading: () => (
    <div className="min-h-screen flex justify-center items-center text-xl text-neutral-700 font-medium">
      Setting up profile...
    </div>
  ),
});

export default async function Setup({ params }: Props) {
  try {
    const user = await getUser(params.username);
    const profile = await getUserData(params.username);
    if (user?.[0] && profile) {
      return (
        <SetupProfile
          user={user?.[0] as User}
          profile={{
            username: params.username,
            name: profile.Socials.Social[0].profileDisplayName,
            bio: profile.Socials.Social[0].profileBio,
            image: profile.Socials.Social[0].profileImage,
            followers: profile.Socials.Social[0].followerCount,
            followings: profile.Socials.Social[0].followingCount,
          }}
        />
      );
    } else {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-20">
          <h1 className="text-[2.5rem] font-title font-semibold text-neutral-700">
            404: User not found
          </h1>
        </main>
      );
    }
  } catch (e) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-20">
        <h1 className="text-[2.5rem] font-title font-semibold text-neutral-700">
          404: User not found
        </h1>
      </main>
    );
  }
}
