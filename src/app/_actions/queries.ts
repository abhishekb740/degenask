"use server";

import { publicClient } from "@/utils/config";
import { DegenaskABI, DegenaskContract, TokenContract } from "@/utils/constants";
import { formatAddress } from "@/utils/helper";
import { client, clientv1 } from "@/utils/supabase/client";
import { Hex, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

export const getUserData = async (username: string) => {
  const query = `query MyQuery {
        Socials(
        input: {filter: {dappName: {_eq: farcaster}, profileName: {_eq: "${username}"}}, blockchain: ethereum}
        ) {
        Social {
            profileBio
            profileDisplayName
            profileImage
            followingCount
            followerCount
        }
        }
    }`;

  const response = await fetch("https://api.airstack.xyz/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AIRSTACK_API_KEY!,
    },
    body: JSON.stringify({ query }),
  });

  const { data } = (await response.json()) as {
    data: {
      Socials: {
        Social: [
          {
            profileBio: string;
            profileDisplayName: string;
            profileImage: string;
            followingCount: number;
            followerCount: number;
          },
        ];
      };
    };
  };

  return data;
};

export const getAllUsers = async () => {
  const { data } = await client.from("creators").select("*");
  return data;
};

export const getAnswers = async (questionId: string) => {
  const { data } = await client.from("answers").select("*").eq("questionId", questionId);
  return data;
};

export const getUser = async (username: string) => {
  const { data } = await client.from("creators").select("*").eq("username", username);
  return data;
};

export const getQuestions = async (username: string) => {
  const { data } = await client.from("questions").select("*").eq("creatorUsername", username);
  return data;
};

export const getv1User = async (username: string) => {
  const { data } = await clientv1
    .from("farstackUser")
    .select("*")
    .eq("username", username)
    .eq("isMarked", false);
  return data;
};

export const updatev1User = async (username: string) => {
  const response = await clientv1
    .from("farstackUser")
    .update({ isMarked: true })
    .eq("username", username);
  return response;
};

export const setAnswer = async (
  questionId: string,
  content: string,
  creatorUsername: string,
  answerId: string,
) => {
  const response = await client.from("answers").insert({
    questionId,
    content,
    creatorUsername,
    answerId,
  });
  return response;
};

export const setCreator = async (username: string, pfp: string) => {
  const response = await client.from("creators").insert({
    username,
    pfp,
  });
  return response;
};

export const updateCreator = async (
  username: string,
  feeAddress: string,
  address: string,
  fees: number,
  pfp: string,
) => {
  const response = await client
    .from("creators")
    .update({
      address,
      feeAddress,
      fees,
      pfp,
    })
    .eq("username", username);
  return response;
};

export const updateCount = async (username: string, count: number) => {
  const response = await client
    .from("creators")
    .update({
      count,
    })
    .eq("username", username);
  return response;
};

export const setQuestion = async (
  questionId: string,
  content: string,
  creatorUsername: string,
  creatorAddress: string,
  address: string,
  price: number,
  isAnonAsk: boolean,
  authorUsername: string,
  authorPfp: string,
) => {
  const url = "https://api.neynar.com/v2/farcaster/cast";
  const response = await client.from("questions").insert({
    questionId,
    content,
    creatorUsername,
    authorUsername,
    authorPfp,
    creatorAddress,
    authorAddress: address,
    isAnswered: false,
    price,
    isAnonAsk,
    whitelistedAddresses: [],
  });
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      api_key: `${process.env.NEYNAR_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      parent_author_fid: 541325,
      signer_uuid: `${process.env.NEYNAR_SIGNER_UUID}`,
      text: `Hey @${creatorUsername}, You have been asked a new question by ${isAnonAsk ? "anon" : authorUsername ? `@${authorUsername}` : formatAddress(address)} on degenask.me/${creatorUsername}`,
      embeds: [
        {
          url: `https://degenask.me/${creatorUsername}`,
        },
      ],
    }),
  };
  if (response.status === 201) {
    await fetch(url, options)
      .then((res) => res.json())
      .catch((err) => console.error("error:" + err));
    return { status: 201 };
  } else {
    return { status: 400 };
  }
};

export const updateWhitelist = async (questionId: string, whitelistedAddresses: string[]) => {
  const response = await client
    .from("questions")
    .update({
      whitelistedAddresses,
    })
    .eq("questionId", questionId);
  return response;
};

export const updateStatus = async (questionId: string) => {
  const response = await client
    .from("questions")
    .update({
      isAnswered: true,
    })
    .eq("questionId", questionId);
  return response;
};

const account = privateKeyToAccount(`${process.env.PRIVATE_KEY as Hex}`);

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

export const signAnswer = async (questionId: string, isAnonAsk: boolean) => {
  const contract = isAnonAsk ? "anonAnswerQuestion" : "answerQuestion";
  try {
    const { request }: any = await publicClient.simulateContract({
      account,
      address: DegenaskContract,
      abi: DegenaskABI,
      functionName: contract,
      args: [questionId, TokenContract],
    });
    const transaction = await walletClient.writeContract(request);
    if (transaction) {
      return { status: 200 };
    }
  } catch (error) {
    return { status: 400 };
  }
};

export const fetchPrice = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=degen-base&vs_currencies=usd",
  );
  const data = await response.json();
  let price = 0;
  if (data?.status?.error_code === 429) {
    price = 0.008;
  } else {
    price = data["degen-base"]?.usd;
  }
  return price;
};

export const fetchProfile = async (query: string) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json", api_key: `${process.env.NEYNAR_API_KEY}` },
  };
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/search?q=${query}`,
      options,
    );
    const data = await response.json();
    return data.result.users;
  } catch (error) {
    return null;
  }
};

export const fetchFCProfile = async (username: string) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json", api_key: `${process.env.NEYNAR_API_KEY}` },
  };
  try {
    const response = await fetch(
      `https://api.neynar.com/v1/farcaster/user-by-username?username=${username}`,
      options,
    );
    const data = await response.json();
    if (data?.code) {
      return null;
    }
    return data.result.user;
  } catch (error) {
    return null;
  }
};

export const fetchFCProfileByAddress = async (address: string) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json", api_key: `${process.env.NEYNAR_API_KEY}` },
  };
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}`,
      options,
    );
    const data = await response.json();
    if (data?.code) {
      return null;
    }
    return data[address];
  } catch (error) {
    return null;
  }
};
