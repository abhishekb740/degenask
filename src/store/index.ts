import { Profile, UserData } from "@/types";
import { atom } from "jotai";

export const feedAtom = atom<string>("");

export const userAtom = atom<Profile>({
  user: {
    username: "",
    fid: 0,
    count: 0,
    address: "",
    price: 0,
  },
});

export const headshotAtom = atom<UserData>({
  username: "",
  name: "",
  bio: "",
  followers: 0,
  image: "",
  count: 0,
});
