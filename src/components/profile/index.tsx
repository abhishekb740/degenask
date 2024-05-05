/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Headshot from "./headshot";
import Setup from "./setup";
import { usePrivy } from "@privy-io/react-auth";
import type { Profile } from "@/types";

export default function Profile({ user }: Profile) {
  const { username, address, price, count } = user;
  const { user: fcUser } = usePrivy();
  const [setup, setSetup] = useState<boolean>(false);

  useEffect(() => {
    if (!address || !price) {
      if (username === fcUser?.farcaster?.username) setSetup(true);
    } else {
      setSetup(false);
    }
  }, [fcUser, price, address]);
  return (
    <div className="flex flex-col min-h-screen justify-center items-center sm:pt-20 px-3 sm:px-10">
      <div className="relative bg-[white] p-4 md:p-8 w-full sm:w-2/3 md:h-3/5 lg:w-2/4 font-primary rounded-xl border border-neutral-400/60 shadow-xl">
        <Headshot username={username} count={count} setSetup={setSetup} />
        {setup && <Setup user={user} />}
      </div>
    </div>
  );
}
