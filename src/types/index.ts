export interface User {
  username: string;
  fid: number;
  count: number;
  address: string;
  price: number;
}

export interface Profile {
  user: User;
}

export interface Question {
  questionId: string;
  content: string;
  creatorUsername: string;
  authorUsername: string;
  price: number;
  createdAt: string;
  creatorAddress: string;
  authorAddress: string;
  isAnswered: boolean;
}

export type Questions = Question[];

export interface UserData {
  username: string;
  name: string;
  bio: string;
  followers: number;
  image: string;
  count: number;
}
