/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import dynamic from "next/dynamic";
import Layout from "../layout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, headshotAtom } from "@/store";
import HeadshotSkeleton from "../shared/skeletons/headshot";
import SetProfile from "./setup";
import { User, UserData } from "@/types";

const Headshot = dynamic(() => import("@/components/shared/headsot"), {
  loading: () => <HeadshotSkeleton />,
});

export default function SetupProfile({
  user,
  profile,
  users,
}: {
  user: User;
  profile: UserData;
  users: User[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setHeadshot = useSetAtom(headshotAtom);
  const auth = useAtomValue(authAtom);

  if (auth !== "setup") {
    router.push("/");
  }

  useEffect(() => {
    setHeadshot({
      username: user.username,
      name: profile.name,
      bio: profile.bio,
      image: profile.image,
      followers: profile.followers,
      followings: profile.followings,
    });
    setIsLoading(false);
  }, [profile]);

  return (
    <Layout users={users}>
      <div className="relative flex flex-col gap-3 md:flex-row bg-white p-6 sm:p-7 md:p-8 w-full font-primary rounded-3xl shadow-xl mt-20">
        {isLoading ? <HeadshotSkeleton /> : <Headshot />}
        <SetProfile user={user} />
      </div>
    </Layout>
  );
}
