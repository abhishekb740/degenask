"use client";
/* eslint-disable @next/next/no-img-element */
import { useLogin, useLogout, usePrivy, useWallets } from "@privy-io/react-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FarcasterIcon from "@/icons/farcaster";
import toast from "react-hot-toast";
import { User } from "@/types";
import { useSetAtom } from "jotai";
import { authAtom, authMethodAtom } from "@/store";
import { setCreator } from "@/app/_actions/queries";

const OGs = [
  {
    pfp: "https://i.imgur.com/Ut3XLfb.gif",
    username: "proxystudio.eth",
  },
  {
    pfp: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/240a4980-8bce-494f-370b-d652bfd1c200/original",
    username: "purp",
  },
  {
    pfp: "https://i.imgur.com/qK6MQG4.jpg",
    username: "kugusha.eth",
  },
  {
    pfp: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/3765900c-48ad-4580-932d-bed17d58ae00/original",
    username: "saxenasaheb.eth",
  },
];

export default function Hero({ users }: { users: User[] }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { ready, authenticated, user, createWallet } = usePrivy();
  const setAuth = useSetAtom(authAtom);
  const setAuthMethod = useSetAtom(authMethodAtom);
  const { wallets } = useWallets();

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
      if (authenticated) {
        if (wallets.length === 0) {
          const res = createWallet();
        }
      }
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
      toast.error("Encountered with login error, try again!", {
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
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-10 md:px-20 bg-[#4C2897]">
      <span className="flex flex-row gap-2 items-center justify-center mt-10 mb-20">
        <img src="/degenask.png" className="w-6 h-6 object-cover" alt="logo" />
        <p className="text-white text-2xl font-title">degenask.me</p>
      </span>
      <h1 className="text-[2rem] md:text-[3rem] text-center font-primary font-semibold text-neutral-200">
        Get paid <span className="text-[#A36EFD]">$Degen</span> to answer questions
      </h1>
      {!authenticated ? (
        <button
          className="flex my-5 w-fit gap-3 px-5 py-3.5 items-center font-primary text-neutral-100 bg-[#A36EFD] hover:text-gray-50 hover:shadow-lg rounded-xl"
          onClick={login}
          disabled={!ready && authenticated}
        >
          <FarcasterIcon className="w-5 h-5" color="#ffffff" />
          Sign in to Create a Page
        </button>
      ) : (
        <button
          className="relative flex flex-row items-center gap-x-3 w-fit px-5 py-3 font-primary text-neutral-50 bg-[#A36EFD] rounded-lg"
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
                  className="inline-flex w-full px-4 py-2 hover:bg-neutral-200 hover:text-neutral-800"
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
                  className="inline-flex w-full px-4 py-2 hover:bg-neutral-200 hover:text-neutral-800"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </button>
      )}
      <div className="flex flex-col gap-10 mb-10 md:mb-5">
        <p className="text-white text-center text-lg font-primary">Ask some of our OGs</p>
        <div className="flex flex-row flex-wrap gap-6 md:gap-10 items-center justify-center">
          {OGs.map((og) => (
            <div key={og.username} className="flex flex-col justify-center items-center gap-2">
              <img
                src={og.pfp}
                alt="pfp"
                className="w-16 h-16 rounded-full cursor-pointer"
                onClick={() => {
                  router.push(`/${og.username}`);
                }}
              />
              <span className="text-white">{og.username}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
