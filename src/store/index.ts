import { Questions, User, UserData } from "@/types";
import { atom } from "jotai";

export const authAtom = atom<string>("");

export const authMethodAtom = atom<string>("");

export const userAtom = atom<User>({
  username: "",
  count: 0,
  address: "",
  price: 0,
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
