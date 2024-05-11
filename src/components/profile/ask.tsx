/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import TextArea from "@/components/form/textarea";
import Button from "@/components/form/button";
import { useAtomValue, useSetAtom } from "jotai";
import { feedAtom, questionsAtom } from "@/store";
import { publicClient } from "@/utils/config";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { DegenAskABI, DegenAskContract, TokenABI, TokenContract } from "@/utils/constants";
import { formatEther, parseEther } from "viem";
import generateUniqueId from "generate-unique-id";
import { useLogin, usePrivy, useWallets } from "@privy-io/react-auth";
import Connect from "../shared/connect";
import { Question } from "@/types";

interface IAskQuestionProps {
  price: number;
  creatorAddress: string;
  creatorUsername: string;
}

export default function AskQuestion({ price, creatorAddress, creatorUsername }: IAskQuestionProps) {
  const [balance, setBalance] = useState<number>();
  const [questionId, setQuestionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questionContent, setQuestionContent] = useState<string>("");
  const setFeed = useSetAtom(feedAtom);
  const questionsData = useAtomValue(questionsAtom);
  const setQuestions = useSetAtom(questionsAtom);
  const { address } = useAccount();
  const { authenticated, user, createWallet } = usePrivy();
  const { wallets } = useWallets();
  const { data, writeContractAsync, status } = useWriteContract();
  const {
    data: approvalData,
    writeContractAsync: writeApprovalContractAsync,
    status: approvalStatus,
  } = useWriteContract();
  const {
    isSuccess,
    status: isValid,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash: data,
  });
  const {
    isSuccess: isApprovalSuccess,
    status: isApprovalValid,
    isError: isApprovalTxError,
  } = useWaitForTransactionReceipt({
    hash: approvalData,
  });

  const getBalance = async () => {
    if (address) {
      try {
        const balance = await publicClient.readContract({
          address: TokenContract,
          abi: TokenABI,
          functionName: "balanceOf",
          args: [address],
        });
        setBalance(Number(formatEther(balance as bigint)));
      } catch (e) {
        toast.error("Error fetching wallet balance", {
          style: {
            borderRadius: "10px",
          },
        });
      }
    } else {
      setBalance(0);
    }
  };

  const getApproval = async () => {
    writeApprovalContractAsync({
      account: address,
      address: TokenContract,
      abi: TokenABI,
      functionName: "approve",
      args: [DegenAskContract, parseEther(String(price))],
    }).catch((error) => {
      setIsLoading(false);
      toast.error("User rejected the request", {
        style: {
          borderRadius: "10px",
        },
      });
    });
  };

  const generateQuestion = async () => {
    const questionId = generateUniqueId({
      length: 7,
      useLetters: false,
      useNumbers: true,
    });
    setQuestionId(questionId);
    writeContractAsync({
      account: address,
      address: DegenAskContract,
      abi: DegenAskABI,
      functionName: "askQuestion",
      args: [Number(questionId), creatorAddress, parseEther(String(price))],
    }).catch((error) => {
      setIsLoading(false);
      toast.error("User rejected the request", {
        style: {
          borderRadius: "10px",
        },
      });
    });
  };

  const store = async () => {
    const response = await fetch("/api/setQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId,
        content: questionContent,
        creatorUsername,
        creatorAddress,
        authorUsername: user?.farcaster?.username,
        authorAddress: address,
        isAnswered: false,
        price,
      }),
    });
    if (response.status === 200) {
      toast.success("Saved successfully", {
        style: {
          borderRadius: "10px",
        },
      });
    }
    setIsLoading(false);
    const question: Question = {
      questionId,
      content: questionContent,
      creatorUsername,
      authorUsername: user?.farcaster?.username ?? "",
      price,
      createdAt: new Date().toISOString(),
      creatorAddress,
      authorAddress: address as string,
      isAnswered: false,
    };
    setQuestions([...questionsData, question]);
    setFeed("feed");
  };

  useEffect(() => {
    if (status === "success" && isSuccess && isValid === "success") {
      store();
    } else if (isTxError) {
      setIsLoading(false);
      toast.error("Something went wrong", {
        style: {
          borderRadius: "10px",
        },
      });
    }
  }, [status, isSuccess, isValid, isTxError]);

  useEffect(() => {
    if (approvalStatus === "success" && isApprovalSuccess && isApprovalValid === "success") {
      generateQuestion();
    } else if (isApprovalTxError) {
      setIsLoading(false);
      toast.error("Something went wrong", {
        style: {
          borderRadius: "10px",
        },
      });
    }
  }, [approvalStatus, isApprovalSuccess, isApprovalValid, isApprovalTxError]);

  useEffect(() => {
    getBalance();
  }, [address]);

  const setProfile = async () => {
    const response = await fetch("/api/setCreator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user?.farcaster?.username,
        fid: user?.farcaster?.fid,
      }),
    });
    if (response.status === 200) {
      toast.success("User created successfully", {
        style: {
          borderRadius: "10px",
        },
      });
    }
  };

  const { login } = useLogin({
    async onComplete(user) {
      if (authenticated) {
        if (wallets.length === 0) {
          const res = createWallet();
        }
      }
      await setProfile();
    },
    onError(error) {
      console.log("🔑 🚨 Login error", { error });
    },
  });
  return (
    <div>
      <div className="mb-3">
        <TextArea
          id="content"
          name="content"
          label="Ask a question"
          placeholder="Degen IRL party wen?"
          value={questionContent}
          onChange={(e) => setQuestionContent(e.target.value)}
        />
        <span className="flex flex-row justify-between items-center">
          <p className="text-indigo-500">Balance: {balance ? balance : 0}</p>
          <Connect padding="mt-1 p-2" />
        </span>
      </div>
      <div>
        {user?.farcaster?.username ? (
          <Button
            id="button"
            title={isLoading ? "Posting question..." : `Pay ${price} DEGEN`}
            disabled={isLoading}
            onClick={() => {
              if (address) {
                if (questionContent) {
                  if (balance && Number(balance) >= price) {
                    setIsLoading(true);
                    getApproval();
                  } else {
                    toast.error("Insufficient balance", {
                      style: {
                        borderRadius: "10px",
                      },
                    });
                  }
                } else {
                  toast.error("Please ask your question", {
                    style: {
                      borderRadius: "10px",
                    },
                  });
                }
              } else {
                toast.error("Connect wallet to ask question", {
                  style: {
                    borderRadius: "10px",
                  },
                });
              }
            }}
          />
        ) : (
          <Button id="button" title="Connect Farcaster" onClick={login} />
        )}
      </div>
    </div>
  );
}
