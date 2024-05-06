/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import Headshot from "./headshot";
import Setup from "./setup";
import { usePrivy } from "@privy-io/react-auth";
import { init, useQuery } from "@airstack/airstack-react";
import type { Profile, UserData } from "@/types";
import AskQuestion from "./ask";
import { feedAtom } from "@/store";
import Button from "@/components/form/button";
// import Questions from "./questions";

export default function Profile({ user }: Profile) {
  const feed = useAtomValue(feedAtom);
  const setFeed = useSetAtom(feedAtom);
  const { username, address, price, count } = user;
  const { user: fcUser } = usePrivy();
  const [userData, setUserData] = useState<UserData | null>(null);

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
      setUserData({
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
    if (!address || !price) {
      if (username === fcUser?.farcaster?.username) setFeed("setup");
    } else {
      setFeed("");
    }
  }, [price, address, username]);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center sm:pt-20 px-3 sm:px-10">
      <div className="relative bg-[white] p-4 md:p-8 w-full sm:w-2/3 md:h-3/5 lg:w-2/4 font-primary rounded-xl border border-neutral-400/60 shadow-xl">
        {!loading && userData && <Headshot data={userData as UserData} />}
        {!loading && feed === "setup" ? (
          <Setup user={user} />
        ) : feed === "ask" ? (
          <AskQuestion price={price} />
        ) : (
          <Button
            id="button"
            title="Ask a question"
            onClick={() => {
              setFeed("ask");
            }}
          />
        )}
      </div>
    </div>
  );
}
