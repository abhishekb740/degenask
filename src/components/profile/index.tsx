/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { usePrivy } from "@privy-io/react-auth";
import type { Profile, Questions, User, UserData } from "@/types";
import { headshotAtom, questionsAtom, userAtom } from "@/store";
import dynamic from "next/dynamic";
import AskSkeleton from "./skeleton/ask";
import { useRouter } from "next/navigation";
import Layout from "../layout";
import HeadshotSkeleton from "../shared/skeletons/headshot";
import Account from "./account";
import Feed from "./feed";
import FeedSkeleton from "./skeleton/feed";

const Ask = dynamic(() => import("@/components/profile/ask"), {
  loading: () => <AskSkeleton />,
});

const Headshot = dynamic(() => import("@/components/shared/headsot"), {
  loading: () => <HeadshotSkeleton />,
});

export default function Profile({
  user,
  profile,
  questions: posts,
}: {
  user: User;
  profile: UserData;
  questions: Questions;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setUser = useSetAtom(userAtom);
  const setHeadshot = useSetAtom(headshotAtom);
  const questions = useAtomValue(questionsAtom);
  const setQuestions = useSetAtom(questionsAtom);
  const { username, address, price } = user;
  const { user: fcUser } = usePrivy();

  useEffect(() => {
    if (address === null || price === null) {
      if (username === fcUser?.farcaster?.username) {
        router.push(`/setup/${user.username}`);
      }
    }
  }, [address, price]);

  useEffect(() => {
    setUser(user);
    setQuestions(posts);
    setHeadshot({
      username: user.username,
      name: profile.name,
      bio: profile.bio,
      image: profile.image,
      followers: profile.followers,
      followings: profile.followings,
    });
    setIsLoading(false);
  }, [user, posts, profile]);

  return (
    <Layout>
      <div className="relative flex flex-col gap-3 md:flex-row bg-white p-6 sm:p-7 md:p-8 w-full font-primary rounded-3xl shadow-xl">
        {isLoading ? <HeadshotSkeleton /> : <Headshot />}
        {isLoading ? (
          <AskSkeleton />
        ) : fcUser?.farcaster?.username === user.username ? (
          <Account user={user} />
        ) : (
          <Ask user={user} />
        )}
      </div>
      <span className="flex w-full items-start justify-start mt-14 mb-5">
        <h2 className="text-2xl font-title font-medium">Recent Q&A</h2>
      </span>
      {isLoading ? (
        <FeedSkeleton />
      ) : questions.length > 0 ? (
        questions.map((question) => {
          return <Feed key={question.questionId} question={question} />;
        })
      ) : (
        <p className="w-full text-start text-neutral-500">
          No question asked yet. You can be the first 👀
        </p>
      )}
    </Layout>
  );
}
