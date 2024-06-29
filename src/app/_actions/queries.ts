"use server";

import { account, publicClient, walletClient } from "@/utils/config";
import { DegenaskABI, DegenaskContract } from "@/utils/constants";
import { formatAddress } from "@/utils/helper";
import { client } from "@/utils/supabase/client";

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

export const setCreator = async (username: string) => {
  const response = await client.from("creators").insert({
    username,
  });
  return response;
};

export const updateCreator = async (username: string, address: string, price: number) => {
  const response = await client
    .from("creators")
    .update({
      address,
      price,
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
) => {
  const url = "https://api.neynar.com/v2/farcaster/cast";
  const response = await client.from("questions").insert({
    questionId,
    content,
    creatorUsername,
    creatorAddress,
    authorAddress: address,
    isAnswered: false,
    price,
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
      text: `Hey @${creatorUsername}, You have been asked a new question by ${formatAddress(address)} on degenask.me/${creatorUsername}`,
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

export const signAnswer = async (questionId: string) => {
  try {
    const { request }: any = await publicClient.simulateContract({
      account,
      address: DegenaskContract,
      abi: DegenaskABI,
      functionName: "answerQuestion",
      args: [questionId],
    });
    const transaction = await walletClient.writeContract(request);
    if (transaction) {
      return { status: 200 };
    }
  } catch (error) {
    return { status: 400 };
  }
};
