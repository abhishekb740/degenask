/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Button from "@/components/form/button";
import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, authMethodAtom, headshotAtom } from "@/store";
import { User } from "@/types";
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Account({ user }: { user: User }) {
  const { price, username: creatorUsername, address: creatorAddress } = user;
  const headshotData = useAtomValue(headshotAtom);
  const { name } = headshotData;
  const setAuth = useSetAtom(authAtom);
  const setAuthMethod = useSetAtom(authMethodAtom);
  const router = useRouter();

  return (
    <div className="flex flex-col w-full md:w-3/5 gap-5 font-primary">
      <span className="flex flex-row w-full items-center justify-between">
        <h3 className="text-xl text-neutral-500">{name}&apos;s Degenask</h3>
        <button
          className="flex flex-row gap-2 w-fit text-neutral-600 hover:text-neutral-800 items-center justify-center"
          onClick={() => {
            setAuth("setup");
            setAuthMethod("edit");
            router.push(`/setup/${creatorUsername}`);
          }}
        >
          <FaRegEdit /> Edit
        </button>
      </span>
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
          window.open(
            `https://warpcast.com/~/compose?text=Ask%20me%20anything%20on%20degenask.me/${creatorUsername}%20and%20earn%20$DEGEN%20for%20your%20questions`,
            "_blank",
          );
        }}
      />
    </div>
  );
}
