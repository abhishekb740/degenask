import { Metadata } from "next";
import dynamic from "next/dynamic";

type Props = {
  params: {
    questionId: string;
  };
};

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
    title: "degenask",
    description:
      "Ask anything you're curious about, learn from the creator's thoughts, and earn $DEGEN for your questions.",
    images: {
      url: `${process.env.NEXT_PUBLIC_HOST_URL}/metadata.svg`,
      alt: "degenask",
    },
  },
};

const Question = dynamic(() => import("@/components/question"), {
  loading: () => (
    <div className="min-h-screen flex justify-center items-center text-xl text-neutral-700 font-medium">
      Fetching question...
    </div>
  ),
});

export default async function Answer({ params }: Props) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_HOST_URL}/api/getQuestion?questionId=${params.questionId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const question = await data.json();
  if (question?.data) {
    return <Question question={question?.data[0]} />;
  }
}
