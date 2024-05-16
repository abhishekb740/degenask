/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import dynamic from "next/dynamic";
import Layout from "../layout";
import { useRouter } from "next/navigation";
import { init, useQuery } from "@airstack/airstack-react";
import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, headshotAtom } from "@/store";
import HeadshotSkeleton from "../shared/skeletons/headshot";
import SetProfile from "./setup";
import { User } from "@/types";

const Headshot = dynamic(() => import("@/components/shared/headsot"), {
  loading: () => <HeadshotSkeleton />,
});

export default function SetupProfile({ user }: { user: User }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setHeadshot = useSetAtom(headshotAtom);
  const auth = useAtomValue(authAtom);

  if (auth !== "setup") {
    router.push("/");
  }

  init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!);
  const query = `query MyQuery {
      Socials(
        input: {filter: {dappName: {_eq: farcaster}, profileName: {_eq: "${user.username}"}}, blockchain: ethereum}
      ) {
        Social {
          profileBio
          profileDisplayName
          profileImage
          followingCount
          followerCount
        }
      }
    }`;

  const { data, loading } = useQuery(query);

  useEffect(() => {
    if (data) {
      setHeadshot({
        username: user.username,
        name: data.Socials.Social[0].profileDisplayName,
        bio: data.Socials.Social[0].profileBio,
        image: data.Socials.Social[0].profileImage,
        followers: data.Socials.Social[0].followerCount,
        followings: data.Socials.Social[0].followingCount,
      });
      setIsLoading(false);
    }
  }, [data, loading]);

  return (
    <Layout>
      <div className="relative flex flex-col gap-3 md:flex-row bg-white p-6 sm:p-7 md:p-8 w-full font-primary rounded-3xl shadow-xl">
        {isLoading ? <HeadshotSkeleton /> : <Headshot />}
        <SetProfile user={user} />
      </div>
    </Layout>
  );
}
