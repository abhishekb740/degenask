/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Button from "@/components/form/button";
import { useAtomValue } from "jotai";
import { headshotAtom } from "@/store";
import { User } from "@/types";

export default function Account({ user }: { user: User }) {
  const { price, username: creatorUsername, address: creatorAddress } = user;
  const headshotData = useAtomValue(headshotAtom);
  const { name } = headshotData;

  return (
    <div className="flex flex-col w-full md:w-3/5 gap-5 font-primary">
      <h3 className="text-xl text-neutral-500">{name}&apos;s Degenask</h3>
      <div className="flex flex-col gap-2">
        <span className="bg-[#F6F6F6] text-lg p-4 font-medium rounded-xl truncate">
          <p className="text-neutral-500 text-md font-regular">Address to receive Funds</p>
          {creatorAddress}
        </span>
        <span className="bg-[#F6F6F6] text-lg p-4 font-medium rounded-xl">
          <p className="text-neutral-500 text-md font-regular">Price to Ask</p>
          <span className="flex flex-row items-center justify-between">
            {price} DEGEN
            <p className="text-neutral-400">{(price * 0.014).toFixed(2)} USD</p>
          </span>
        </span>
      </div>
      <Button
        id="share"
        title="Share the Page"
        onClick={() => {
          window.open(`https://warpcast.com/${user.username}`, "_blank");
        }}
      />
    </div>
  );
}
