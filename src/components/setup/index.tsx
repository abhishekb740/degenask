/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import dynamic from "next/dynamic";
import { usePrivy } from "@privy-io/react-auth";
import Layout from "../layout";
import { useRouter } from "next/navigation";
import { init, useQuery } from "@airstack/airstack-react";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { headshotAtom } from "@/store";
import HeadshotSkeleton from "../shared/skeletons/headshot";
import SetProfile from "./setup";

const Headshot = dynamic(() => import("@/components/shared/headsot"), {
  loading: () => <HeadshotSkeleton />,
});

export default function SetupProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setHeadshot = useSetAtom(headshotAtom);
  const { user: fcUser } = usePrivy();

  init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!);
  const query = `query MyQuery {
      Socials(
        input: {filter: {dappName: {_eq: farcaster}, profileName: {_eq: "${fcUser?.farcaster?.username}"}}, blockchain: ethereum}
      ) {
        Social {
          followingCount
          followerCount
        }
      }
    }`;

  const { data, loading } = useQuery(query);

  useEffect(() => {
    if (data) {
      setHeadshot({
        username: fcUser?.farcaster?.username ?? "",
        name: fcUser?.farcaster?.displayName ?? "",
        bio: fcUser?.farcaster?.bio ?? "",
        image: fcUser?.farcaster?.pfp ?? "",
        followers: data.Socials.Social[0].followerCount,
        followings: data.Socials.Social[0].followingCount,
      });
      setIsLoading(false);
    }
  }, [data, loading]);

  if (fcUser?.farcaster?.username === "") {
    router.push("/");
    return;
  }

  return (
    <Layout>
      <div className="relative flex flex-col gap-3 md:flex-row bg-white p-4 sm:p-5 md:p-8 w-full sm:w-2/3 md:w-4/5 lg:w-3/4 font-primary rounded-3xl shadow-xl">
        {isLoading ? <HeadshotSkeleton /> : <Headshot />}
        <SetProfile />
      </div>
    </Layout>
  );
}
