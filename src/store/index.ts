import { Profile, Questions, UserData } from "@/types";
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
  followings: 0,
});

export const questionsAtom = atom<Questions>([]);
