import { Metadata } from "next";
import dynamic from "next/dynamic";

type Props = {
  params: {
    username: string;
  };
};

export const fetchCache = "force-no-store";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params.username;
  return {
    title: `${username} | DegenAsk`,
    icons: "/favicon.png",
    description:
      "Ask anything you're curious about, learn from the creator's thoughts, and earn $DEGEN for your questions.",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://degenask.me",
      siteName: "DegenAsk",
      images: [
        {
          url: "/metadata.png",
          width: 800,
          height: 600,
          alt: "DegenAsk",
        },
      ],
    },
  };
}

const Profile = dynamic(() => import("@/components/profile"), {
  loading: () => (
    <div className="min-h-screen flex justify-center items-center text-xl text-neutral-700 font-medium">
      Fetching profile...
    </div>
  ),
});

export default async function Creator({ params }: Props) {
  const user = await fetch(
    `${process.env.NEXT_PUBLIC_HOST_URL}/api/getCreator?username=${params.username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const response = await user.json();
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_HOST_URL}/api/getQuestion?username=${params.username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const questions = await data.json();
  if (response?.data[0]?.username && questions?.data) {
    return <Profile user={response?.data[0]} questions={questions?.data} />;
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-20">
        <h1 className="text-[2.5rem] font-title font-semibold text-neutral-700">
          404: User not found
        </h1>
      </main>
    );
  }
}
