import { Hero } from "@/components";
import { User } from "@/types";
import { client } from "@/utils/supabase/client";
import { Metadata } from "next";

export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "DegenAsk",
  description:
    "Ask anything you're curious about, learn from the creator's thoughts, and earn $DEGEN for your questions.",
  icons: "/favicon.png",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_HOST_URL,
    title: "DegenAsk",
    description:
      "Ask anything you're curious about, learn from the creator's thoughts, and earn $DEGEN for your questions.",
    images: {
      url: `${process.env.NEXT_PUBLIC_HOST_URL}/metadata.svg`,
      alt: "DegenAsk",
    },
  },
};

export default async function Home() {
  try {
    const { data } = await client.from("farstackUser").select("*");
    return <Hero users={data as User[]} />;
  } catch (e) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-20">
        <h1 className="text-[2.5rem] font-title font-semibold text-neutral-700">
          404: Page not found
        </h1>
      </main>
    );
  }
}
