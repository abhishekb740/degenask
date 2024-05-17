export interface User {
  username: string;
  count: number;
  address: string;
  price: number;
  degen: number;
}

export interface Profile {
  user: User;
}

export interface Question {
  questionId: string;
  content: string;
  creatorUsername: string;
  price: number;
  createdAt: string;
  creatorAddress: string;
  authorAddress: string;
  isAnswered: boolean;
  whitelistedAddresses: string[];
}

export type Questions = Question[];

export interface UserData {
  username: string;
  name: string;
  bio: string;
  followers: number;
  image: string;
  followings: number;
}

export interface Answer {
  answerId: string;
  questionId: string;
  content: string;
  creatorUsername: string;
  createdAt: string;
}
