/* eslint-disable @next/next/no-img-element */
"use client";
import { useLogout } from "@privy-io/react-auth";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { FiCopy, FiLogOut } from "react-icons/fi";
import { MdPeople } from "react-icons/md";
import { SiAnswer } from "react-icons/si";

interface IHeadshotProps {
  username: string;
  count: number;
  setSetup: (value: boolean) => void;
}

export default function Headshot({ username, count, setSetup }: IHeadshotProps) {
  const { logout } = useLogout();
  return (
    <div>
      <div className="flex flex-row items-start justify-between">
        <span className="flex gap-2 md:gap-8">
          <img
            src={"/farstack.png"}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-sky-200 rounded-full object-fill"
            alt="icon"
          />
          <div className="flex flex-col mt-2">
            <div className="font-bold font-title text-xl md:text-3xl">Neel Patel</div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-end">
              <div className="text-lg text-indigo-500">@{username}</div>
              <div className="flex gap-4">
                <span className="flex flex-row gap-1 text-neutral-700 items-center">
                  <MdPeople />
                  169 Followers
                </span>
                <span className="flex flex-row gap-1 text-neutral-700 items-center">
                  <SiAnswer size={15} />
                  {!count ? 0 : count} Answers
                </span>
              </div>
            </div>
            <div className="mt-2 text-sm md:text-md text-neutral-600 max-h-[4rem] truncate text-wrap">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, voluptatibus dolorum
              ducimus, excepturi recusandae distinctio tempore iure expedita a corrupti officia,
              cupiditate atque eveniet nihil possimus aliquam iusto saepe. Aut.
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
          className="absolute right-[6.8rem] bg-lime-100 hover:bg-lime-200 hover:text-lime-800 p-2.5 rounded-full cursor-pointer"
        >
          <FiCopy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
        <span
          onClick={() => {
            setSetup(true);
          }}
          className="absolute right-[4rem] bg-indigo-100 hover:bg-indigo-200 hover:text-indigo-800 p-2.5 rounded-full cursor-pointer"
        >
          <FaRegEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
        <span
          onClick={logout}
          className="absolute right-5 bg-red-100 hover:bg-red-200 hover:text-red-600 p-2.5 rounded-full cursor-pointer"
        >
          <FiLogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
      </div>
      <hr className="my-5 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
    </div>
  );
}
