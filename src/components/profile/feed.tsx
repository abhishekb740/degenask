import React, { useEffect, useState } from "react";
import type { Answer, Question } from "@/types";
import { calculateDeadline, formatAddress } from "@/utils/helper";
import TextArea from "../form/textarea";
import { usePrivy } from "@privy-io/react-auth";
import Button from "../form/button";
import toast from "react-hot-toast";
import { DegenAskABI, DegenAskContract, TokenABI, TokenContract } from "@/utils/constants";
import { account, publicClient, walletClient } from "@/utils/config";
import generateUniqueId from "generate-unique-id";
import { questionsAtom, userAtom } from "@/store";
import { useAtomValue, useSetAtom } from "jotai";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import Connect from "../shared/connect";
import { FiLock } from "react-icons/fi";
import { formatEther, parseEther } from "viem";

export default function Feed({ key, question }: { key: string; question: Question }) {
  const [answerContent, setAnswerContent] = useState<string>("");
  const [answer, setAnswer] = useState<Answer>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>();
  const { user } = usePrivy();
  const { address } = useAccount();
  const profile = useAtomValue(userAtom);
  const setProfile = useSetAtom(userAtom);
  const questions = useAtomValue(questionsAtom);
  const setQuestions = useSetAtom(questionsAtom);
  const { data, writeContractAsync, status } = useWriteContract();
  const {
    isSuccess,
    status: isValid,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash: data,
  });
  const {
    data: unlockData,
    writeContractAsync: writeUnlockContractAsync,
    status: unlockStatus,
  } = useWriteContract();
  const {
    isSuccess: isUnlockSuccess,
    status: isUnlockValid,
    isError: isUnlockTxError,
  } = useWaitForTransactionReceipt({
    hash: unlockData,
  });
  const {
    data: approvalData,
    writeContractAsync: writeApprovalContractAsync,
    status: approvalStatus,
  } = useWriteContract();
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
    const price = question.price * 0.01;
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

  const unlockAnswer = async () => {
    writeUnlockContractAsync({
      account: address,
      address: DegenAskContract,
      abi: DegenAskABI,
      functionName: "peekIntoAnswer",
      args: [Number(question.questionId)],
    }).catch((error) => {
      setIsLoading(false);
      toast.error("User rejected the request", {
        style: {
          borderRadius: "10px",
        },
      });
    });
  };

  const unlockStore = async () => {
    const whitelistedAddresses: string[] = [...question.whitelistedAddresses, String(address)];
    const response = await fetch("/api/setQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: question.questionId,
        whitelistedAddresses,
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
    setQuestions((questions) => {
      return questions.map((q) => {
        if (q.questionId === question.questionId) {
          return {
            ...q,
            whitelistedAddresses,
          };
        }
        return q;
      });
    });
  };

  useEffect(() => {
    if (unlockStatus === "success" && isUnlockSuccess && isUnlockValid === "success") {
      unlockStore();
    } else if (isTxError) {
      setIsLoading(false);
      toast.error("Something went wrong", {
        style: {
          borderRadius: "10px",
        },
      });
    }
  }, [unlockStatus, isUnlockSuccess, isUnlockTxError, isUnlockValid]);

  useEffect(() => {
    if (approvalStatus === "success" && isApprovalSuccess && isApprovalValid === "success") {
      unlockAnswer();
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

  const claimRefund = () => {
    setIsLoading(true);
    writeContractAsync({
      account: address,
      address: DegenAskContract,
      abi: DegenAskABI,
      functionName: "refundPayment",
      args: [question.questionId],
    }).catch((error) => {
      setIsLoading(false);
      toast.error("User rejected the request", {
        style: {
          borderRadius: "10px",
        },
      });
    });
  };

  const updateUser = async () => {
    const count = profile.count + 1;
    const response = await fetch("/api/setCreator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: profile.username,
        count,
      }),
    });
    if (response.status === 200) {
      toast.success("Saved successfully", {
        style: {
          borderRadius: "10px",
        },
      });
      setProfile({
        username: profile.username,
        address: profile.address,
        price: profile.price,
        count: profile.count + 1,
      });
    }
    setIsLoading(false);
  };

  const store = async () => {
    const answerId = generateUniqueId({
      length: 7,
      useLetters: false,
      useNumbers: true,
    });
    const response = await fetch("/api/setAnswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answerId,
        questionId: question.questionId,
        content: answerContent,
        creatorUsername: question.creatorUsername,
      }),
    });
    if (response.status === 200) {
      const questionResponse = await fetch("/api/setQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.questionId,
          isAnswered: true,
        }),
      });
      if (questionResponse.status === 200) {
        updateUser();
      }
    }
    fetchAnswer();
  };

  const submitAnswer = async () => {
    const questionId = question.questionId;
    try {
      const { request }: any = await publicClient.simulateContract({
        account,
        address: DegenAskContract,
        abi: DegenAskABI,
        functionName: "answerQuestion",
        args: [questionId],
      });
      const transaction = await walletClient.writeContract(request);
      if (transaction) {
        store();
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred while submitting your answer. Please try again.", {
        style: {
          borderRadius: "10px",
        },
      });
    }
  };

  const fetchAnswer = async () => {
    const answer = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/getAnswer?questionId=${question.questionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const response = await answer.json();
    if (response?.data[0]) setAnswer(response?.data[0]);
  };

  useEffect(() => {
    if (question.isAnswered) {
      fetchAnswer();
    }
  }, [question.isAnswered]);

  useEffect(() => {
    if (status === "success" && isSuccess && isValid === "success") {
      setIsLoading(false);
      toast.success("Refund processed successfully", {
        style: {
          borderRadius: "10px",
        },
      });
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
    setIsPageLoading(false);
  }, []);

  return (
    <div
      key={key}
      className="flex flex-col bg-white p-4 sm:p-6 w-full mb-3.5 font-primary rounded-3xl shadow-xl"
    >
      <span className="flex flex-row gap-4 items-center">
        <span className="w-8 h-8 bg-gradient-to-b from-violet-500 to-blue-600 rounded-full"></span>
        {formatAddress(question.authorAddress)}
      </span>
      <p className="my-2">{question.content}</p>
      {!question.isAnswered && user?.farcaster?.username !== question.creatorUsername && (
        <div className="w-full flex justify-end items-end">
          <span className="bg-[#A36EFD] text-white w-fit p-2 rounded-lg">Not answered</span>
        </div>
      )}
      {answer &&
      (address === question.authorAddress ||
        address === question.creatorAddress ||
        (question.whitelistedAddresses &&
          question.whitelistedAddresses.includes(String(address)))) ? (
        <p className="text-neutral-800">{answer.content}</p>
      ) : (
        answer && (
          <div className="relative bg-transparent">
            <p className="mb-2 blur select-none text-neutral-800">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro facilis praesentium
              minima natus fugiat nobis quidem suscipit, vel recusandae deserunt cupiditate!
            </p>
            <span className="absolute bottom-2 items-center justify-center">
              {isPageLoading ? (
                <Button id="peek" title={`Unlock with ${question.price * 0.01} DEGEN`} />
              ) : address ? (
                <Button
                  id="button"
                  title={
                    isLoading ? (
                      "Unlocking answer..."
                    ) : (
                      <span className="inline-flex gap-2 items-center">
                        <FiLock /> Unlock with ${question.price * 0.01} DEGEN
                      </span>
                    )
                  }
                  onClick={() => {
                    if (balance && Number(balance) >= question.price * 0.01) {
                      setIsLoading(true);
                      getApproval();
                    } else {
                      toast.error("Insufficient balance", {
                        style: {
                          borderRadius: "10px",
                        },
                      });
                    }
                  }}
                />
              ) : (
                <Connect />
              )}
            </span>
          </div>
        )
      )}
      {calculateDeadline(question.createdAt) === "Expired" &&
        !question.isAnswered &&
        user?.farcaster?.username !== question.creatorUsername &&
        (isPageLoading ? (
          <Button id="claim" title="Claim refund" />
        ) : address ? (
          <Button
            id="button"
            title={isLoading ? "Processing refund..." : "Claim Refund"}
            onClick={() => {
              if (address === question.authorAddress) {
                claimRefund();
              } else {
                toast.error("This address doesn't belong to author", {
                  style: {
                    borderRadius: "10px",
                  },
                });
              }
            }}
          />
        ) : (
          <Connect />
        ))}
      {!question.isAnswered &&
        user?.farcaster?.username === question.creatorUsername &&
        calculateDeadline(question.createdAt) !== "Expired" && (
          <div className="flex flex-col gap-4">
            <TextArea
              id="content"
              name="content"
              label="Answer this question"
              placeholder="Type your answer here..."
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
            />
            {isPageLoading ? (
              <Button id="askQuestion" title="Ask question" />
            ) : address ? (
              <Button
                id="button"
                title={isLoading ? "Submitting answer..." : "Submit answer"}
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  submitAnswer();
                }}
              />
            ) : (
              <Connect />
            )}
          </div>
        )}
    </div>
  );
}
