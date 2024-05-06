/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Headshot from "./headshot";
import Setup from "./setup";
import { usePrivy } from "@privy-io/react-auth";
import { init, useQuery } from "@airstack/airstack-react";
import type { Profile, UserData } from "@/types";
import AskAQuestion from "./askAQuestion";

export default function Profile({ user }: Profile) {
  const { username, address, price, count } = user;
  const { user: fcUser } = usePrivy();
  const [setup, setSetup] = useState<boolean>(false);
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

  const { data, loading, error } = useQuery(query);

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
      if (username === fcUser?.farcaster?.username) setSetup(true);
    } else {
      setSetup(false);
    }
  }, [fcUser, price, address, username]);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center sm:pt-20 px-3 sm:px-10">
      <div className="relative bg-[white] p-4 md:p-8 w-full sm:w-2/3 md:h-3/5 lg:w-2/4 font-primary rounded-xl border border-neutral-400/60 shadow-xl">
        {!loading && userData && <Headshot data={userData as UserData} setSetup={setSetup} />}
        {setup && <Setup user={user} />}
        {!setup && <AskAQuestion price={price} />}
      </div>
    </div>
  );
}
