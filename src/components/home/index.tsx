"use client";
/* eslint-disable @next/next/no-img-element */
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FarcasterIcon from "@/icons/farcaster";
import toast from "react-hot-toast";
import { User } from "@/types";
import { useSetAtom } from "jotai";
import { authAtom, authMethodAtom } from "@/store";
import { getAllUsers, setCreator } from "@/app/_actions/queries";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";
import { featuredProfiles } from "@/utils/constants";

export default function Hero() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { ready, authenticated, user } = usePrivy();
  const setAuth = useSetAtom(authAtom);
  const setAuthMethod = useSetAtom(authMethodAtom);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const setProfile = async () => {
    const response = await setCreator(user?.farcaster?.username!);
    if (response.status === 201) {
      toast.success("User created successfully", {
        style: {
          borderRadius: "10px",
        },
      });
      setAuth("setup");
      setAuthMethod("initial");
      router.push(`/setup/${user?.farcaster?.username}`);
      return;
    }
  };

  const { login } = useLogin({
    async onComplete(user) {
      const users = (await getAllUsers()) as User[];
      if (user) {
        const isExist = users.find(
          (profile: User) => profile.username === user?.farcaster?.username,
        );
        if (isExist) {
          router.push(`/${user?.farcaster?.username}`);
          return;
        }
      }
      await setProfile();
    },
    onError(error) {
      toast.error("Failed to login, try again!", {
        style: {
          borderRadius: "10px",
        },
      });
      console.log("🚨 Login error", { error });
    },
  });

  const { logout } = useLogout({
    onSuccess: () => {
      setIsDropdownOpen(false);
    },
  });

  return (
    <main className="flex h-[100vh] overflow-hidden flex-col items-center justify-center gap-5 px-7 md:px-20">
      <span className="flex flex-row gap-2 items-center justify-center mb-20">
        <img src="/degenask.png" className="w-6 h-6 object-cover" alt="logo" />
        <p className="text-2xl font-primary font-semibold">degenask.me</p>
      </span>
      <h1 className="text-[2rem] md:text-[4rem] text-center font-title font-semibold leading-snug text-neutral-800">
        Get paid <span className="text-[#9c62ff] font-primary">$DEGEN</span> <br /> to answer
        questions
      </h1>
      {!authenticated ? (
        <button
          className="flex my-5 w-fit gap-3 px-8 py-3.5 items-center font-medium font-primary text-neutral-100 bg-[#9c62ff] hover:text-gray-50 shadow hover:shadow-xl rounded-[2rem] z-30"
          onClick={login}
          disabled={!ready && authenticated}
        >
          <FarcasterIcon className="w-5 h-5" color="#ffffff" />
          Start earning
        </button>
      ) : (
        <button
          className="relative flex flex-row items-center gap-x-3 w-fit px-5 py-3 font-primary text-neutral-50 bg-[#9c62ff] rounded-lg z-30"
          onClick={toggleDropdown}
        >
          <img
            src={user?.farcaster?.pfp!}
            alt="icon"
            className="w-10 h-10 rounded-full object-cover"
          />
          {user?.farcaster?.username}
          <div
            className={`${
              isDropdownOpen ? "block absolute" : "hidden"
            }  mt-[9.5rem] left-0 z-10 divide-y divide-gray-100 rounded-lg shadow w-40 bg-neutral-50 font-primary`}
          >
            <ul className="py-1 text-sm text-neutral-700" aria-labelledby="dropdown-button">
              <li>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-neutral-200 hover:text-neutral-800 z-30"
                  onClick={() => {
                    router.push(`/${user?.farcaster?.username}`);
                  }}
                >
                  My profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-neutral-200 hover:text-neutral-800 z-30"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </button>
      )}
      <img
        src={featuredProfiles[0].pfp}
        alt="pfp"
        className="absolute w-12 h-12 md:w-16 md:h-16 top-[10rem] sm:top-[8rem] md:top-[10rem] left-[2rem] sm:left-[8rem] md:left-[5rem] lg:left-[10rem] xl:left-[12rem] 2xl:left-[19rem] object-cover rounded-full cursor-pointer border border-neutral-100 shadow-xl z-30 animate-float"
        onClick={() => {
          router.push(`/${featuredProfiles[0].username}`);
        }}
      />
      <img
        src={featuredProfiles[1].pfp}
        alt="pfp"
        className="absolute w-12 h-12 md:w-16 md:h-16 bottom-[9rem] sm:bottom-[14rem] md:bottom-[8rem] lg:bottom-[10rem] left-[3rem] sm:left-[8rem] md:left-[10rem] lg:left-[19rem] xl:left-[23rem] 2xl:left-[35rem] object-cover rounded-full cursor-pointer border border-neutral-100 shadow-xl z-30 animate-wiggle"
        onClick={() => {
          router.push(`/${featuredProfiles[1].username}`);
        }}
      />
      <img
        src={featuredProfiles[3].pfp}
        alt="pfp"
        className="absolute w-12 h-12 md:w-16 md:h-16 top-[8rem] sm:top-[14rem] md:top-[10rem] right-[3rem] sm:right-[8rem] md:right-[5rem] lg:right-[19rem] xl:right-[23rem] 2xl:right-[35rem] object-cover rounded-full cursor-pointer border border-neutral-100 shadow-xl z-30 animate-float"
        onClick={() => {
          router.push(`/${featuredProfiles[3].username}`);
        }}
      />
      <img
        src={featuredProfiles[2].pfp}
        alt="pfp"
        className="absolute w-12 h-12 md:w-16 md:h-16 bottom-[8rem] sm:bottom-[8rem] md:bottom-[10rem] right-[3rem] sm:right-[6rem] md:right-[5rem] lg:right-[10rem] xl:right-[12rem] 2xl:right-[19rem] object-cover rounded-full cursor-pointer border border-neutral-100 shadow-xl z-30 animate-float"
        onClick={() => {
          router.push(`/${featuredProfiles[2].username}`);
        }}
      />
      <Link
        className="flex w-fit gap-3 text-[#9c62ff] font-medium items-center z-30 hover-arrow"
        href=""
        target="_blank"
      >
        Watch video <FaArrowRightLong className="mt-[2px] arrow" />
      </Link>
      <img
        src="/assets/ring.png"
        alt="ring"
        className="absolute hidden lg:flex w-full h-full z-10"
      />
      <img
        src="/assets/ringMed.png"
        alt="ring"
        className="absolute hidden sm:flex lg:hidden w-full h-full z-10"
      />
      <img
        src="/assets/ringMob.png"
        alt="ring"
        className="absolute flex sm:hidden w-full h-full z-10"
      />
    </main>
  );
}
