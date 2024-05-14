/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { usePrivy } from "@privy-io/react-auth";
import { init, useQuery } from "@airstack/airstack-react";
import type { Profile, Questions, User } from "@/types";
import { feedAtom, headshotAtom, questionsAtom, userAtom } from "@/store";
import Button from "@/components/form/button";
import dynamic from "next/dynamic";
import HeadshotSkeleton from "./skeleton/headshot";
import AskSkeleton from "./skeleton/ask";
import FeedSkeleton from "./skeleton/feed";
import SetupSkeleton from "./skeleton/setup";
import { IoMdArrowBack } from "react-icons/io";
import FarcasterIcon from "@/icons/farcaster";
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  users,
}: {
  user: User;
  questions: Questions;
  users: User[];
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const feed = useAtomValue(feedAtom);
  const setFeed = useSetAtom(feedAtom);
  const profileData = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const headshotData = useAtomValue(headshotAtom);
  const setHeadshot = useSetAtom(headshotAtom);
  const questionsData = useAtomValue(questionsAtom);
  const setQuestions = useSetAtom(questionsAtom);
  const { username, address, price, count } = profile;
  const { user: fcUser } = usePrivy();

  const handleOnChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

let filteredUsers: User[] = [];           // Put this above before router instance 

useEffect(() => {
    filteredUsers = users.filter((user) => user.username.includes(searchQuery));
  }, [searchQuery]);
  console.log(filteredUsers);

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
    setQuestions(questions);
  }, [profile, questions]);

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
          <div className="w-full h-10 bg-gray-300 rounded-[5rem] mb-4 animate-pulse"></div>
        ) : (
          <div className="flex flex-row items-center w-full rounded-[5rem] py-1 border border-neutral-300 px-5 mb-4">
            <IoIosSearch size={30} className="text-neutral-400" />
            <input
              className="flex ml-4 w-full py-2 focus:outline-none"
              placeholder="Discover Creators"
              onChange={handleOnChange}
            />
          </div>
        )}
      {searchQuery && (
          <div className="flex flex-col z-10 absolute max-h-[13rem] border border-neutral-400 bg-white w-[92%] rounded-lg scroll-smooth scrollbar">
            {filteredUsers.length ? (
              filteredUsers.map((user) => {
                return (
                  <button
                    key={user.username}
                    className="flex flex-row gap-2 items-center w-full rounded-[5rem] px-5 py-2 cursor-pointer"
                    onClick={() => router.push(`/${user.username}`)}
                  >
                    <span className="w-6 h-6 bg-gradient-to-r from-sky-300 to-blue-500 rounded-full"></span>
                    <p className="ml-4 text-lg font-primary">{user.username}</p>
                  </button>
                );
              })
            ) : (
              <p className="ml-4 text-lg text-neutral-800 font-primary">No Creators Found</p>
            )}
          </div>
        )}
        {loading ? (
          <div className="w-full h-10 bg-indigo-200 rounded-lg animate-pulse"></div>
        ) : (
          feed === "feed" &&
          (fcUser?.farcaster?.username !== username ? (
            <Button
              id="button"
              title="Ask a question"
              onClick={() => {
                setFeed("ask");
              }}
            />
          ) : (
            <Button
              id="button"
              title={
                <p className="flex flex-row gap-5 justify-center items-center">
                  <FarcasterIcon className="w-5 h-5" color="#ffffff" /> Share your profile
                </p>
              }
              onClick={() => {
                window.open(
                  `https://warpcast.com/~/compose?text=Ask%20me%20anything%20on%20degenask.me%20and%20earn%20$DEGEN%20for%20your%20questions!%0A&embeds[]=${process.env.NEXT_PUBLIC_HOST_URL}/${username}/`,
                );
              }}
            />
          ))
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
            headshotData && <Feed questions={questionsData} />
          )}
        </div>
      </div>
    </div>
  );
}
