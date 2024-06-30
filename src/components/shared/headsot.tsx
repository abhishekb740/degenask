/* eslint-disable @next/next/no-img-element */
"use client";

import { headshotAtom } from "@/store";
import { formatNumber } from "@/utils/helper";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function Headshot() {
  const headshotData = useAtomValue(headshotAtom);

  return (
    <div className="flex flex-col w-full md:w-2/5 justify-between font-primary">
      <div className="flex flex-col gap-4">
        <span className="flex flex-row items-center gap-4">
          <img src={headshotData.image} alt="pfp" className="w-16 h-16 rounded-full object-cover" />
          <span className="flex flex-col items-start">
            <h1 className="text-2xl font-title">{headshotData.name}</h1>
            <p className="text-neutral-500">@{headshotData.username}</p>
          </span>
        </span>
        <p className="text-neutral-500">{headshotData.bio}</p>
        <div className="flex sm:flex-row md:flex-col lg:flex-row gap-4">
          <span className="inline-flex gap-2.5 items-center text-neutral-500">
            Followers <p className="text-[#A36EFD]">{formatNumber(headshotData.followers)}</p>
          </span>
          <span className="inline-flex gap-2.5 items-center text-neutral-500">
            Followings <p className="text-[#A36EFD]">{formatNumber(headshotData.followings)}</p>
          </span>
        </div>
      </div>
      <Link
        href={`https://warpcast.com/${headshotData.username}`}
        className="mt-6 w-fit"
        target="_blank"
      >
        <Image src="/icons/warpcast.svg" alt="setup" width={25} height={25} />
      </Link>
    </div>
  );
}
