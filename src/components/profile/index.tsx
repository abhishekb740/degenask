/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { usePrivy } from "@privy-io/react-auth";
import { init, useQuery } from "@airstack/airstack-react";
import type { Profile, Questions, User } from "@/types";
import { feedAtom, headshotAtom, userAtom } from "@/store";
import Button from "@/components/form/button";
import dynamic from "next/dynamic";
import HeadshotSkeleton from "./skeleton/headshot";
import AskSkeleton from "./skeleton/ask";
import FeedSkeleton from "./skeleton/feed";
import SetupSkeleton from "./skeleton/setup";
import { IoMdArrowBack } from "react-icons/io";

const Headshot = dynamic(() => import("@/components/profile/headshot"), {
  loading: () => <HeadshotSkeleton />,
});

const AskQuestion = dynamic(() => import("@/components/profile/ask"), {
  loading: () => <AskSkeleton />,
});

const Feed = dynamic(() => import("@/components/profile/feed"), {
  loading: () => <FeedSkeleton />,
});

const Setup = dynamic(() => import("@/components/profile/setup"), {
  loading: () => <SetupSkeleton />,
});

export default function Profile({
  user: profile,
  questions,
}: {
  user: User;
  questions: Questions;
}) {
  const feed = useAtomValue(feedAtom);
  const setFeed = useSetAtom(feedAtom);
  const profileData = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const headshotData = useAtomValue(headshotAtom);
  const setHeadshot = useSetAtom(headshotAtom);
  const { username, address, price, count } = profile;
  const { user: fcUser } = usePrivy();

  init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!);
  const query = `query MyQuery {
    Socials(
      input: {filter: {dappName: {_eq: farcaster}, profileName: {_eq: "${username}"}}, blockchain: ethereum}
    ) {
      Social {
        profileBio
        profileDisplayName
        profileImage
        followerCount
      }
    }
  }`;

  const { data, loading } = useQuery(query);

  useEffect(() => {
    if (data) {
      setHeadshot({
        username,
        name: data.Socials.Social[0].profileDisplayName,
        bio: data.Socials.Social[0].profileBio,
        followers: data.Socials.Social[0].followerCount,
        image: data.Socials.Social[0].profileImage,
        count,
      });
    }
  }, [data, loading, username, count]);

  useEffect(() => {
    if (address === null || price === null) {
      if (username === fcUser?.farcaster?.username) {
        setFeed("setup");
      }
    } else {
      setFeed("feed");
    }
  }, [address, price]);

  useEffect(() => {
    setUser({ user: profile });
  }, [profile]);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center px-3 sm:px-10">
      <div className="relative bg-[white] p-4 md:p-8 w-full sm:w-2/3 lg:w-2/4 max-h-[50rem] font-primary rounded-xl border border-neutral-400/60 shadow-xl">
        {loading ? <HeadshotSkeleton /> : headshotData && <Headshot data={headshotData} />}
        {!loading && feed !== "feed" && (
          <div
            onClick={() => setFeed("feed")}
            className="cursor-pointer items-center flex flex-row w-fit text-sm text-neutral-700 gap-2 transition-transform duration-300 ease-in-out hover:scale-110"
          >
            <IoMdArrowBack size={25} />
            <div>Go Back</div>
          </div>
        )}
        {loading ? (
          <div className="w-full h-10 bg-indigo-200 rounded-lg animate-pulse"></div>
        ) : (
          feed === "feed" && (
            <Button
              id="button"
              title="Ask a question"
              onClick={() => {
                setFeed("ask");
              }}
            />
          )
        )}
        <div className="mt-2">
          {!loading && feed === "setup" ? (
            <Setup user={profileData.user} />
          ) : feed === "ask" ? (
            <AskQuestion
              creatorUsername={username}
              creatorAddress={profileData.user.address}
              price={profileData.user.price}
            />
          ) : (
            headshotData && <Feed questions={questions} />
          )}
        </div>
      </div>
    </div>
  );
}
