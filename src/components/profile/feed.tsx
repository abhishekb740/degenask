/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import type { Answer, Question } from "@/types";
import { calculateDeadline, formatAddress } from "@/utils/helper";
import TextArea from "../form/textarea";
import { usePrivy } from "@privy-io/react-auth";
import Button from "../form/button";
import toast from "react-hot-toast";
import {
  DegenaskABI,
  DegenaskContract,
  GradientBucket,
  TokenABI,
  TokenContract,
} from "@/utils/constants";
import { publicClient } from "@/utils/config";
import generateUniqueId from "generate-unique-id";
import { questionsAtom, userAtom } from "@/store";
import { useAtomValue, useSetAtom } from "jotai";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import Connect from "../shared/connect";
import { FiLock } from "react-icons/fi";
import { formatEther, parseEther } from "viem";
import {
  getAnswers,
  setAnswer,
  signAnswer,
  updateCount,
  updateStatus,
  updateWhitelist,
} from "@/app/_actions/queries";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

export default function Feed({ key, question }: { key: string; question: Question }) {
  const [answerContent, setAnswerContent] = useState<string>("");
  const [answer, setAnswers] = useState<Answer>();
  const [allowance, setAllowance] = useState<number>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>();
  const { user } = usePrivy();
  const { address } = useAccount();
  const profile = useAtomValue(userAtom);
  const setProfile = useSetAtom(userAtom);
  const setQuestions = useSetAtom(questionsAtom);
  const randomIndex = Math.floor(Math.random() * GradientBucket.length);
  const gradient = GradientBucket[randomIndex];
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
  };

  const getAllowance = async () => {
    try {
      const allowance = await publicClient.readContract({
        address: TokenContract,
        abi: TokenABI,
        functionName: "allowance",
        args: [address, DegenaskContract],
      });
      setAllowance(Number(formatEther(allowance as bigint)));
    } catch (e) {
      toast.error("Error fetching wallet allowance", {
        style: {
          borderRadius: "10px",
        },
      });
    }
  };

  const getApproval = async () => {
    const price = question.price * 0.02;
    writeApprovalContractAsync({
      account: address,
      address: TokenContract,
      abi: TokenABI,
      functionName: "approve",
      args: [DegenaskContract, parseEther(String(price))],
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
      address: DegenaskContract,
      abi: DegenaskABI,
      functionName: "peekIntoAnswer",
      args: [Number(question.questionId), TokenContract],
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
    const response = await updateWhitelist(question.questionId, whitelistedAddresses);
    if (response.status === 204) {
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
    if (address) {
      getBalance();
      getAllowance();
    }
  }, [address]);

  const claimRefund = () => {
    setIsLoading(true);
    writeContractAsync({
      account: address,
      address: DegenaskContract,
      abi: DegenaskABI,
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
    const response = await updateCount(profile.username, count);
    if (response.status === 204) {
      toast.success("Saved successfully", {
        style: {
          borderRadius: "10px",
        },
      });
      setProfile({
        username: profile.username,
        address: profile.address,
        fees: profile.fees,
        count: profile.count + 1,
        feeAddress: profile.feeAddress,
        pfp: profile.pfp,
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
    const response = await setAnswer(
      question.questionId,
      answerContent,
      user?.farcaster?.username as string,
      answerId,
    );
    if (response.status === 201) {
      const questionResponse = await updateStatus(question.questionId);
      if (questionResponse.status === 204) {
        setQuestions((questions) => {
          return questions.map((q) => {
            if (q.questionId === question.questionId) {
              return {
                ...q,
                isAnswered: true,
              };
            }
            return q;
          });
        });
        updateUser();
      }
    }
    fetchAnswer();
  };

  const submitAnswer = async () => {
    const questionId = question.questionId;
    const response = await signAnswer(questionId, question.isAnonAsk);
    if (response?.status === 200) {
      store();
    } else {
      setIsLoading(false);
      toast.error("An error occurred while submitting your answer. Please try again.", {
        style: {
          borderRadius: "10px",
        },
      });
    }
  };

  const fetchAnswer = async () => {
    const answer = await getAnswers(question.questionId);
    if (answer) setAnswers(answer?.[0]);
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
      className="flex flex-col bg-white p-4 sm:p-6 w-full mb-3.5 font-primary rounded-3xl shadow-xl "
    >
      <span className="flex flex-row gap-4 items-center">
        {!question.isAnonAsk ? (
          question?.authorPfp ? (
            <img
              src={question.authorPfp}
              alt="profile"
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <span
              className="w-7 h-7 rounded-full"
              style={{
                background: gradient,
              }}
            />
          )
        ) : (
          <span
            className="w-7 h-7 rounded-full"
            style={{
              background: gradient,
            }}
          />
        )}
        {question.isAnonAsk
          ? "Anon"
          : question.authorUsername
            ? question.authorUsername
            : formatAddress(question.authorAddress)}
      </span>
      <p className="my-2">{parse(DOMPurify.sanitize(question.content))}</p>
      {!question.isAnswered && user?.farcaster?.username !== question.creatorUsername && (
        <div className="w-full flex justify-end items-end">
          <span className="bg-[#A36EFD] text-white w-fit p-2 rounded-lg">Not answered</span>
        </div>
      )}
      {answer &&
      (address === question.authorAddress ||
        address === question.creatorAddress ||
        question.creatorUsername === user?.farcaster?.username ||
        question?.authorUsername === user?.farcaster?.username ||
        (question.whitelistedAddresses &&
          question.whitelistedAddresses.includes(String(address)))) ? (
        <p className="text-neutral-800">{answer.content}</p>
      ) : (
        answer && (
          <div className="relative bg-transparent 3xl:mt-8">
            <p className="mb-2 blur select-none text-neutral-800">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro facilis praesentium
              minima natus fugiat nobis quidem suscipit, vel recusandae deserunt cupiditate!
            </p>
            <span className="absolute bottom-2 items-center justify-center">
              {isPageLoading ? (
                <Button
                  id="peek"
                  title={`Unlock with ${(question.price * 0.02).toFixed(3)} DEGEN`}
                />
              ) : address ? (
                <Button
                  id="peek"
                  title={
                    isLoading ? (
                      "Unlocking answer..."
                    ) : (
                      <span className="inline-flex gap-2 items-center">
                        <FiLock /> Unlock with {(question.price * 0.02).toFixed(3)} DEGEN
                      </span>
                    )
                  }
                  onClick={() => {
                    if (balance && Number(balance) >= question.price * 0.02) {
                      setIsLoading(true);
                      if (allowance! >= question.price * 0.02) {
                        unlockAnswer();
                      } else {
                        getApproval();
                      }
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
                <Connect label={`Unlock with ${(question.price * 0.01).toFixed(3)} DEGEN`} />
              )}
            </span>
          </div>
        )
      )}
      {calculateDeadline(question.createdAt) === "Expired" &&
        !question.isAnswered &&
        user?.farcaster?.username === question.creatorUsername && (
          <div className="w-full flex justify-end items-end">
            <span className="bg-[#A36EFD] text-white w-fit py-1.5 px-3 rounded-lg">Expired</span>
          </div>
        )}
      {calculateDeadline(question.createdAt) === "Expired" &&
        !question.isAnswered &&
        user?.farcaster?.username !== question.creatorUsername &&
        (question?.authorUsername === user?.farcaster?.username ||
          question.authorAddress === address) &&
        (isPageLoading ? (
          <Button id="claim" title="Claim refund" />
        ) : address ? (
          <Button
            id="claim"
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
          <Connect label="Claim refund" />
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
              <Button id="submit" title="Submit answer" />
            ) : address ? (
              <Button
                id="submit"
                title={isLoading ? "Submitting answer..." : "Submit answer"}
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  submitAnswer();
                }}
              />
            ) : (
              <Connect label="Submit answer" />
            )}
          </div>
        )}
    </div>
  );
}
