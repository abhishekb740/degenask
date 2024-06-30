/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import dynamic from "next/dynamic";
import Container from "../container";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, headshotAtom } from "@/store";
import HeadshotSkeleton from "../shared/skeletons/headshot";
import SetProfile from "./setup";
import { User, UserData, Userv1 } from "@/types";

const Headshot = dynamic(() => import("@/components/shared/headsot"), {
  loading: () => <HeadshotSkeleton />,
});

export default function SetupProfile({
  user,
  profile,
  users,
  userv1,
}: {
  user: User;
  profile: UserData;
  users: User[];
  userv1: Userv1;
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
    <Container users={users}>
      <div className="relative flex flex-col gap-3 md:flex-row bg-white mb-8 md:mb-0 p-6 sm:p-7 md:p-8 w-full font-primary rounded-3xl border border-neutral-100 shadow-xl mt-20">
        {isLoading ? <HeadshotSkeleton /> : <Headshot />}
        <SetProfile user={user} userv1={userv1} />
      </div>
    </Container>
  );
}
