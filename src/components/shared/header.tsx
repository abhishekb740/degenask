/* eslint-disable @next/next/no-img-element */
import { User } from "@/types";
import { useLogout, usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

export default function Header({ color }: { color: string }) {
  const { user, authenticated } = usePrivy();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
  const { logout } = useLogout({
    onSuccess: () => {
      setIsLoggedIn(false);
      setIsDropdownOpen(false);
    },
  });

  return (
    <div className="absolute w-full grid grid-row-[0fr_1fr_1fr] gap-y-4 sm:grid-cols-[0.8fr_2fr_1fr] md:grid-cols-[1fr_2.5fr_1fr] lg:grid-cols-[1fr_3fr_1fr] xl:grid-cols-[2.2fr_8fr_2fr] mt-14 items-center justify-center">
      <span className="hidden sm:visible sm:flex"></span>
      <span className="flex flex-row gap-2 items-center justify-center">
        <img src="/degenask.png" className="w-6 h-6 object-cover" alt="logo" />
        <p className={`text-${color} md:text-xl lg:text-2xl font-title`}>degenask.me</p>
      </span>
      {authenticated ? (
        <div
          className="relative flex flex-row px-6 py-3 w-fit justify-center items-center font-bold gap-3 text-neutral-700 bg-white hover:cursor-pointer rounded-xl"
          onClick={toggleDropdown}
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
            }  mt-28 z-10 divide-y divide-gray-100 rounded-lg shadow w-40 bg-neutral-50 font-primary`}
          >
            <ul className="py-1 text-sm text-neutral-700" aria-labelledby="dropdown-button">
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
        <span></span>
      )}
    </div>
  );
}
