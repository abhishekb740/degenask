import { Hero } from "@/components";
import { Metadata } from "next";

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
      url: `${process.env.NEXT_PUBLIC_HOST_URL}/metadata.png`,
      alt: "DegenAsk",
    },
  },
};

export default function Home() {
  return <Hero />;
}
