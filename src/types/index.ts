export interface User {
  username: string;
  count: number;
  address: string;
  fees: number;
  feeAddress: string;
  pfp: string;
}

export interface Userv1 {
  username: string;
  count: number;
  address: string;
  price: number;
  isMarked: boolean;
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

interface BioText {
  text: string;
}

interface ProfileBio {
  bio: BioText;
}

interface VerifiedAddresses {
  eth_addresses: string[];
  sol_addresses: string[];
}

export interface FCUser {
  object: string;
  fid: number;
  custody_address: string;
  username: string;
  display_name: string;
  pfp: string;
  profile: ProfileBio;
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: VerifiedAddresses;
  active_status: string;
  power_badge: boolean;
}
