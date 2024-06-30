import { getAllUsers, getUser, getUserData, getv1User } from "@/app/_actions/queries";
import { User, Userv1 } from "@/types";
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
    title: `${profile?.Socials?.Social[0]?.profileDisplayName} | Degenask`,
    icons: profile?.Socials?.Social[0]?.profileImage,
    description:
      "Earn $DEGEN for answering questions and ask anything to your favourite creators that you're curious about",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: process.env.NEXT_PUBLIC_HOST_URL,
      siteName: "Degenask",
      images: {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/api/getOg?username=${username}`,
        alt: "Degenask",
      },
    },
  };
}

const SetupProfile = dynamic(() => import("@/components/setup"), {
  loading: () => (
    <div className="min-h-screen flex justify-center items-center gap-4 text-xl text-neutral-700 font-medium">
      <svg
        aria-hidden="true"
        className="w-6 h-6 text-neutral-300 animate-spin fill-[#9c62ff]"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      Setting up profile...
    </div>
  ),
});

export default async function Setup({ params }: Props) {
  try {
    const user = await getUser(params.username);
    const profile = await getUserData(params.username);
    const users = await getAllUsers();
    const userv1 = await getv1User(params.username);
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
          users={users as User[]}
          userv1={userv1?.[0] as Userv1}
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
