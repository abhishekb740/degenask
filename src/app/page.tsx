import { Hero } from "@/components";
import { Metadata } from "next";

export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Degenask",
  description:
    "Earn $DEGEN for answering questions and ask anything to your favourite creators that you're curious about",
  icons: "/degenask.png",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_HOST_URL,
    title: "Degenask",
    description:
      "Earn $DEGEN for answering questions and ask anything to your favourite creators that you're curious about",
    images: {
      url: `${process.env.NEXT_PUBLIC_HOST_URL}/metadata/degenaskv2.gif`,
      alt: "Degenask",
    },
  },
};

export default function Home() {
  return <Hero />;
}
