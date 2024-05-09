/* eslint-disable @next/next/no-img-element */
"use client";
import { feedAtom } from "@/store";
import { UserData } from "@/types";
import { useLogout, usePrivy } from "@privy-io/react-auth";
import { useSetAtom } from "jotai";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { FiCopy, FiLogOut } from "react-icons/fi";
import { MdPeople } from "react-icons/md";
import { SiAnswer } from "react-icons/si";
import Dialog from "@/components/form/dialog";
import { useState } from "react";

interface IHeadshotProps {
  data: UserData;
}

export default function Headshot({ data }: IHeadshotProps) {
  const { username, name, bio, followers, image, count } = data;
  const setFeed = useSetAtom(feedAtom);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { user } = usePrivy();
  const { logout } = useLogout();

  return (
    <div>
      <div className="flex flex-row items-start justify-between">
        <span className="flex gap-2 md:gap-8">
          <img
            src={image}
            className="w-[7rem] h-[4rem] md:h-[6rem] lg:w-[6rem] lg:h-[5rem] xl:h-[6rem] bg-sky-200 rounded-full object-fill"
            alt="icon"
          />
          <div className="flex flex-col mt-2">
            <div className="font-bold font-title text-xl md:text-2xl">{name}</div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-end">
              <div className="text-lg text-indigo-500">@{username}</div>
              <div className="flex gap-4">
                <span className="flex flex-row gap-1 text-neutral-700 items-center">
                  <MdPeople />
                  {followers} Followers
                </span>
                <span className="flex flex-row gap-1 text-neutral-700 items-center">
                  <SiAnswer size={15} />
                  {!count ? 0 : count} Answers
                </span>
              </div>
            </div>
            <div className="mt-2 text-sm md:text-md text-neutral-600 max-h-[4rem] truncate text-wrap">
              {bio}
            </div>
          </div>
        </span>
        <span
          onClick={() => {
            navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_HOST_URL}/${username}`);
            toast.success("Profile link copied to clipboard!", {
              style: {
                borderRadius: "10px",
              },
            });
          }}
          className="absolute right-5 bg-lime-100 hover:bg-lime-200 hover:text-lime-800 p-2.5 rounded-full cursor-pointer"
        >
          <FiCopy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
        {user?.farcaster?.username === username && (
          <div>
            <span
              onClick={() => {
                setFeed("setup");
              }}
              className="absolute right-[6.8rem] bg-indigo-100 hover:bg-indigo-200 hover:text-indigo-800 p-2.5 rounded-full cursor-pointer"
            >
              <FaRegEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <span
              onClick={() => {
                setShowDialog(true);
              }}
              className="absolute right-[4rem] bg-red-100 hover:bg-red-200 hover:text-red-600 p-2.5 rounded-full cursor-pointer"
            >
              <FiLogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>{" "}
          </div>
        )}
      </div>
      <Dialog isEnabled={showDialog} setOutsideClick={setShowDialog}>
        <div className="flex flex-col w-[90vw] md:w-[30vw] p-7 rounded-lg bg-[#1c1c1c] font-primary shadow-xl justify-center items-center gap-4">
          <h1 className="text-xl text-white">Do you want to Logout?</h1>
          <span className="w-full flex flex-row gap-2.5">
            <button
              onClick={() => {
                setShowDialog(false);
              }}
              className="w-full px-4 py-2 border border-red-500 hover:bg-red-500 text-white text-sm rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                logout();
                setShowDialog(false);
              }}
              className="w-full px-4 py-2 border border-indigo-500 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg"
            >
              Logout
            </button>
          </span>
        </div>
      </Dialog>
      <hr className="my-5 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
    </div>
  );
}
