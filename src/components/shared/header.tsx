/* eslint-disable @next/next/no-img-element */
import { fetchProfile, setCreator } from "@/app/_actions/queries";
import FarcasterIcon from "@/icons/farcaster";
import { authAtom, authMethodAtom } from "@/store";
import { FCUser, User } from "@/types";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
import { useAtomValue, useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdNotificationsActive } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { useDebounceValue } from "usehooks-ts";

export default function Header({ users }: { users: User[] }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [fcUsers, setFcUsers] = useState<FCUser[]>([]);
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const setAuth = useSetAtom(authAtom);
  const authMethod = useAtomValue(authMethodAtom);
  const setAuthMethod = useSetAtom(authMethodAtom);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useDebounceValue("", 500);
  const filteredUsers = users.filter((user) => user.username.includes(searchQuery.toLowerCase()));
  const globalUsers = [...filteredUsers, ...fcUsers];

  const { logout } = useLogout({
    onSuccess: () => {
      setIsDropdownOpen(false);
    },
  });

  const setProfile = async () => {
    const response = await setCreator(user?.farcaster?.username!, user?.farcaster?.pfp!);
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
      if (user) {
        const isExist = users.find(
          (profile: User) => profile.username === user?.farcaster?.username,
        );
        if (isExist) {
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

  useEffect(() => {
    const fetchProfiles = async () => {
      const response = await fetchProfile(debouncedSearchQuery);
      if (response && response.length > 0) {
        response.map((user: any) => {
          if (user.pfp_url) {
            user.pfp = user.pfp_url;
            delete user.pfp_url;
          }
        });
        // i also want that if username from users match with response username then that entry should be remove from response
        const filteredResponse = response.filter(
          (user: any) => !users.some((profile: User) => profile.username === user.username),
        );
        setFcUsers(filteredResponse);
      }
    };
    if (debouncedSearchQuery) {
      fetchProfiles();
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {authMethod === ("initial" || "edit") && (
        <div className="flex bg-violet-700 text-neutral-200 w-full py-2 px-5 sm:px-2 items-start sm:items-center justify-center">
          <Link
            className="flex flex-row text-center text-wrap items-start sm:items-center gap-0 sm:gap-1"
            href="https://warpcast.com/degenask"
            target="_blank"
          >
            <MdNotificationsActive className="w-9 h-9 sm:w-5 sm:h-5 text-white animate-wiggle mr-0 sm:mr-1.5" />{" "}
            Follow @degenask on Warpcast to get priority notification in your feed
          </Link>
        </div>
      )}
      <div className="w-full flex flex-col md:flex-row justify-between gap-y-10 mt-14 px-5 md:px-20 items-center">
        <span className="flex flex-row gap-2 items-center justify-center">
          <img src="/degenask.png" className="w-6 h-6 object-cover" alt="logo" />
          <p className="text-[#9c62ff] md:text-xl lg:text-2xl font-title">degenask.me</p>
        </span>
        <div className="relative flex flex-col items-center">
          <div className="flex flex-row max-w-64 rounded-3xl py-1 border border-neutral-200 px-5 items-center justify-center">
            <IoIosSearch size={22} className="text-neutral-500" />
            <input
              className="flex ml-2.5 w-full py-1.5 bg-transparent focus:outline-none"
              placeholder="Search creator"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDebouncedSearchQuery(e.target.value);
              }}
            />
          </div>
          {searchQuery && (
            <div className="absolute top-full flex flex-col z-10 mt-2 max-h-[13rem] border border-neutral-100 bg-white/90 backdrop-blur-lg w-full rounded-xl shadow-lg scroll-smooth scrollbar">
              {globalUsers.length ? (
                globalUsers.map((user, key) => {
                  return (
                    <button
                      key={key}
                      className="flex flex-row gap-3 hover:bg-neutral-100 items-center w-full px-5 py-2 cursor-pointer"
                      onClick={() => router.push(`/${user?.username}`)}
                    >
                      <img
                        alt={user?.username}
                        className="w-6 h-6 bg-gradient-to-br from-emerald-100 to-teal-300 rounded-full object-cover shadow"
                        src={user?.pfp ? user.pfp : "/icons/warpcast.svg"}
                      />
                      <p className="text-lg font-primary">{user?.username}</p>
                    </button>
                  );
                })
              ) : (
                <p className="ml-4 text-lg py-2 text-neutral-800 font-primary">No creator found</p>
              )}
            </div>
          )}
        </div>
        {authenticated ? (
          <div
            className="flex flex-row px-6 py-3 w-fit justify-center items-center font-bold gap-3 text-neutral-700 bg-white hover:cursor-pointer rounded-xl border border-neutral-100 shadow-md"
            onClick={() => {
              setIsDropdownOpen(true);
            }}
            ref={dropdownRef}
          >
            <img
              src={user?.farcaster?.pfp!}
              alt="icon"
              className="w-7 h-7 rounded-full object-cover"
            />
            {user?.farcaster?.username}
            <div
              className={`${
                isDropdownOpen ? "block absolute" : "hidden"
              }  mt-36 z-10 divide-y divide-gray-100 rounded-lg shadow w-40 bg-neutral-50 font-primary`}
            >
              <ul className="py-1 text-sm text-neutral-700" aria-labelledby="dropdown-button">
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-neutral-100 hover:text-neutral-800"
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
                    className="inline-flex w-full px-4 py-2 hover:bg-neutral-100 hover:text-neutral-800"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            className="flex my-5 w-fit gap-3 px-6 py-3 items-center font-primary text-neutral-700 bg-white hover:shadow-lg rounded-xl"
            onClick={login}
            disabled={!ready && authenticated}
          >
            <FarcasterIcon className="w-5 h-5" color="#9c62ff" />
            Sign in
          </button>
        )}
      </div>
    </>
  );
}
