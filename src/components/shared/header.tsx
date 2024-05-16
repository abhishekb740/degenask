import { User } from "@/types";
import { useLogout, usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

export default function Header({ color }: { color: string }) {
  const { user, authenticated } = usePrivy();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  console.log(isLoggedIn);

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
    <div className="w-full flex flex-col md:flex-row items-center justify-between mt-20 mb-20">
      <span></span>
      <div className={`text-${color} text-2xl font-title`}>degenask.me</div>
      {authenticated && (
        <div
          className="relative flex flex-row px-6 py-3 w-fit justify-center items-center font-bold gap-3 text-neutral-700 bg-white hover:cursor-pointer rounded-xl"
          onClick={toggleDropdown}
        >
          <img src={user?.farcaster?.pfp!} alt="icon" className="w-7 h-7 rounded-full" />
          {user?.farcaster?.username}
          <div
            className={`${
              isDropdownOpen ? "block absolute" : "hidden"
            }  mt-24 z-10 divide-y divide-gray-100 rounded-lg shadow w-44 bg-neutral-100 font-primary`}
          >
            <ul className="py-1 text-sm text-neutral-700" aria-labelledby="dropdown-button">
              <li>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-neutral-300 hover:text-neutral-800"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
