/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import TextArea from "@/components/form/textarea";
import Button from "@/components/form/button";
import { useAtomValue, useSetAtom } from "jotai";
import { headshotAtom, questionsAtom } from "@/store";
import { publicClient } from "@/utils/config";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { DegenAskABI, DegenAskContract, TokenABI, TokenContract } from "@/utils/constants";
import { formatEther, parseEther } from "viem";
import generateUniqueId from "generate-unique-id";
import { Question, User } from "@/types";
import dynamic from "next/dynamic";
import { setQuestion } from "@/app/_actions/queries";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Connect = dynamic(() => import("@/components/shared/connect"), {
  ssr: false,
});

const customToolbar = [["bold", "italic", "underline", "code-block"]];

export default function AskQuestion({ user }: { user: User }) {
  const { price, username: creatorUsername, address: creatorAddress } = user;
  const headshotData = useAtomValue(headshotAtom);
  const { name } = headshotData;
  const [balance, setBalance] = useState<number>();
  const [questionId, setQuestionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [questionContent, setQuestionContent] = useState<string>("");
  console.log("questionContent", questionContent);
  const questionsData = useAtomValue(questionsAtom);
  const setQuestions = useSetAtom(questionsAtom);
  const { address, chainId } = useAccount();
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
    const response = await setQuestion(
      questionId,
      questionContent,
      creatorUsername,
      creatorAddress,
      address as string,
      price,
    );
    if (response.status === 201) {
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
      price,
      createdAt: new Date().toISOString(),
      creatorAddress,
      authorAddress: address as string,
      isAnswered: false,
      whitelistedAddresses: [],
    };
    setQuestions([question, ...questionsData]);
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

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  return (
    <div className="flex flex-col w-full md:w-3/5 gap-16 font-primary">
      <div className="flex flex-col w-full gap-2">
        <h3 className="text-xl text-neutral-500">Ask {name} a question</h3>
        <ReactQuill
          value={questionContent}
          onChange={setQuestionContent}
          modules={{ toolbar: customToolbar }}
          placeholder="Type a question here..."
          className="h-48"
        />
      </div>
      {isPageLoading ? (
        <Button id="askQuestion" title="Ask question" />
      ) : address && chainId === Number(process.env.NEXT_PUBLIC_CHAINID) ? (
        <Button
          id="askQuestion"
          title={isLoading ? "Posting question..." : `Ask with ${price} DEGEN`}
          disabled={isLoading || !questionContent}
          onClick={() => {
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
          }}
        />
      ) : (
        <Connect label={`Ask with ${price} DEGEN`} />
      )}
    </div>
  );
}
