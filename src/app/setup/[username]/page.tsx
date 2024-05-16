import { Metadata } from "next";
import dynamic from "next/dynamic";

export const fetchCache = "force-no-store";

type Props = {
  params: {
    username: string;
  };
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Setup | DegenAsk`,
    icons: "/favicon.png",
    description:
      "Ask anything you're curious about, learn from the creator's thoughts, and earn $DEGEN for your questions.",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: process.env.NEXT_PUBLIC_HOST_URL,
      siteName: "DegenAsk",
      images: {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/metadata.svg`,
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
  return <SetupProfile user={response?.data[0]} />;
}
