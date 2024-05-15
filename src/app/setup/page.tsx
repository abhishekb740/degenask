import { Metadata } from "next";
import dynamic from "next/dynamic";

export const fetchCache = "force-no-store";

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
      siteName: "degenask",
      images: {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/metadata.png`,
        alt: "degenAsk",
      },
    },
  };
}

const SetupProfile = dynamic(() => import("@/components/setup"), {
  loading: () => (
    <div className="min-h-screen flex justify-center items-center text-xl text-neutral-700 font-medium">
      Fetching profile...
    </div>
  ),
});

export default async function Setup() {
  return <SetupProfile />;
}
