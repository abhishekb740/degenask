"use client";
/* eslint-disable @next/next/no-img-element */
import { useLogin, usePrivy, useWallets } from "@privy-io/react-auth";
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
    pfp: "https://i.imgur.com/rOy7TtZ.gif",
    username: "jessepolak",
  },
  {
    pfp: "https://i.imgur.com/liviil4.jpg",
    username: "jacek",
  },
  {
    pfp: "https://i.imgur.com/vHVlojT.gif",
    username: "markfishman",
  },
  {
    pfp: "https://i.imgur.com/Ut3XLfb.gif",
    username: "proxystudio.eth",
  },
];

export default function Hero({ users }: { users: User[] }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { ready, authenticated, user, createWallet } = usePrivy();
  const setAuth = useSetAtom(authAtom);
  const setAuthMethod = useSetAtom(authMethodAtom);
  const { wallets } = useWallets();

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
      setIsLoggedIn(true);
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-10 md:px-20 bg-[#4C2897]">
      <div className="mt-10 mb-20 text-white text-2xl font-title">degenask.me</div>
      <h1 className="text-[2rem] md:text-[3rem] text-center font-primary font-semibold text-neutral-200">
        Get paid to answer questions <br /> through <span className="text-[#A36EFD]">Degen</span>
      </h1>
      {!isLoggedIn ? (
        <button
          className="flex my-5 w-fit gap-3 px-5 py-3.5 items-center font-primary text-neutral-100 bg-[#A36EFD] hover:text-gray-50 hover:shadow-lg rounded-xl"
          onClick={login}
          disabled={!ready && authenticated}
        >
          <FarcasterIcon className="w-5 h-5" color="#ffffff" />
          Sign in to Create a Page
        </button>
      ) : (
        <div>
          <button className="block w-fit px-5 py-3 font-primary text-neutral-50 bg-[#A36EFD] rounded-lg">
            <span className="flex flex-row items-center gap-x-3">
              <img
                src={user?.farcaster?.pfp!}
                alt="icon"
                className="w-10 h-10 rounded-full object-cover"
              />
              {user?.farcaster?.username}
            </span>
          </button>
        </div>
      )}
      <div className="flex flex-col gap-10 mb-10 md:mb-5">
        <p className="text-white text-center text-lg font-primary">Ask some of our OGs</p>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
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
