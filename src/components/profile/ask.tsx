/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import Button from "@/components/form/button";
import { useAtomValue, useSetAtom } from "jotai";
import { degenPrice, headshotAtom, questionsAtom } from "@/store";
import { publicClient } from "@/utils/config";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { DegenaskABI, DegenaskContract, TokenABI, TokenContract } from "@/utils/constants";
import { formatEther, parseEther } from "viem";
import generateUniqueId from "generate-unique-id";
import { Question, User } from "@/types";
import dynamic from "next/dynamic";
import { fetchFCProfileByAddress, setQuestion } from "@/app/_actions/queries";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Input from "../form/input";
import { usePrivy } from "@privy-io/react-auth";
import { IoInformationCircle } from "react-icons/io5";
import { PiMoneyWavy } from "react-icons/pi";

const Connect = dynamic(() => import("@/components/shared/connect"), {
  ssr: false,
});

const customToolbar = [["bold", "italic", "underline", "code-block"]];

export default function AskQuestion({ user, isNew }: { user: User; isNew: boolean }) {
  const { fees: amount, username: creatorUsername, address: creatorAddress } = user;
  const headshotData = useAtomValue(headshotAtom);
  const { name } = headshotData;
  const [price, setPrice] = useState<number>();
  const [balance, setBalance] = useState<number>();
  const [allowance, setAllowance] = useState<number>();
  const [questionId, setQuestionId] = useState<string>("");
  const [isAnonAsk, setIsAnonAsk] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [questionContent, setQuestionContent] = useState<string>("");
  const questionsData = useAtomValue(questionsAtom);
  const degenPriceUsd = useAtomValue(degenPrice);
  const setQuestions = useSetAtom(questionsAtom);
  const { address, chainId } = useAccount();
  const { user: fcUser } = usePrivy();
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
    const fees = isNew ? price! : isAnonAsk ? amount + amount * 0.05 : amount;
    writeApprovalContractAsync({
      account: address,
      address: TokenContract,
      abi: TokenABI,
      functionName: "approve",
      args: [DegenaskContract, parseEther(String(fees))],
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
    const fees = isNew ? price! : isAnonAsk ? amount + amount * 0.05 : amount;
    const contract = isNew
      ? isAnonAsk
        ? "askNewAnonQuestion"
        : "askNewQuestion"
      : isAnonAsk
        ? "askAnonQuestion"
        : "askQuestion";
    const questionId = generateUniqueId({
      length: 7,
      useLetters: false,
      useNumbers: true,
    });
    setQuestionId(questionId);
    writeContractAsync({
      account: address,
      address: DegenaskContract,
      abi: DegenaskABI,
      functionName: contract,
      args: [Number(questionId), creatorAddress, TokenContract, parseEther(String(fees))],
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
    const fees = isNew ? price! : isAnonAsk ? amount + amount * 0.05 : amount;
    let authorPfp = "";
    let authorUsername = "";
    if (fcUser?.farcaster?.pfp && fcUser?.farcaster?.username) {
      authorPfp = fcUser.farcaster.pfp;
      authorUsername = fcUser.farcaster.username;
    } else {
      const response = await fetchFCProfileByAddress(String(address));
      if (response) {
        authorPfp = response.pfp_url;
        authorUsername = response.username;
      }
    }
    const response = await setQuestion(
      questionId,
      questionContent,
      creatorUsername,
      creatorAddress,
      address as string,
      fees,
      isAnonAsk,
      authorUsername,
      authorPfp,
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
      authorUsername: fcUser?.farcaster?.username!,
      price: fees,
      createdAt: new Date().toISOString(),
      creatorAddress,
      authorAddress: address as string,
      isAnswered: false,
      whitelistedAddresses: [],
      isAnonAsk,
      authorPfp,
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
    if (address) {
      getBalance();
      getAllowance();
    }
  }, [address]);

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  useEffect(() => {
    setPrice(amount);
  }, [amount]);

  return (
    <div className="flex flex-col w-full md:w-3/5 gap-5 font-primary">
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-row gap-4 items-center justify-between w-full">
          <h2 className="text-xl text-neutral-500">Ask {name} a question</h2>
          <div className="relative group">
            <IoInformationCircle size={25} className="text-neutral-600" />
            <div className="absolute bottom-full -left-20 md:right-0 transform -translate-x-1/2 mb-2 min-w-64 p-3 bg-white md:bg-violet-400 bg-opacity-90 md:bg-opacity-30 border border-violet-300 md:border-violet-400 text-neutral-800 md:text-neutral-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="flex flex-col gap-1.5 text-sm items-center justify-center">
                <PiMoneyWavy size={20} /> You can claim refund if creator doesn&apos;t answer your
                question in 2 days.
              </div>
            </div>
          </div>
        </div>
        <ReactQuill
          value={questionContent}
          onChange={setQuestionContent}
          modules={{ toolbar: customToolbar }}
          placeholder="Type a question here..."
          className="h-32"
        />
      </div>
      <div className="flex items-center mt-10">
        <input
          id="purple-checkbox"
          type="checkbox"
          value=""
          onChange={() => setIsAnonAsk(!isAnonAsk)}
          className={`w-4 h-4 bg-neutral-200 border-neutral-500 rounded focus:outline-none custom-checkbox ${isAnonAsk ? "checked" : ""}`}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            width: "1.2rem",
            height: "1.2rem",
            border: "1px solid #9c62ff",
            borderRadius: "0.25rem",
            transition: "background-color 0.3s, border-color 0.3s",
            position: "relative",
          }}
        />
        <label htmlFor="purple-checkbox" className="ms-2 text-sm font-medium text-neutral-500">
          Ask anonymously (5% extra fee)
        </label>
      </div>
      {isNew ? (
        <div className="flex flex-col xl:flex-row items-start xl:justify-between gap-2">
          <span className="w-full xl:w-[50%]">
            <Input
              id="price"
              name="price"
              placeholder="250"
              type="number"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              value={price}
              helper="Pay creator what you feel right"
              suffix={`${price ? `${(price * degenPriceUsd).toFixed(2)} USD` : ``}`}
            />
          </span>
          {isPageLoading ? (
            <Button id="askQuestion" title="Ask question" />
          ) : address && chainId === Number(process.env.NEXT_PUBLIC_CHAINID) ? (
            <Button
              id="askQuestion"
              title={isLoading ? "Sending question..." : `Ask with ${price ? price : 0} DEGEN`}
              disabled={
                isLoading ||
                !questionContent ||
                questionContent === "<p><br></p>" ||
                price! < (isAnonAsk ? amount + amount * 0.05 : amount)
              }
              onClick={() => {
                if (questionContent !== "<p><br></p>") {
                  if (price! >= (isAnonAsk ? amount + amount * 0.05 : amount)) {
                    if (balance && Number(balance) >= price!) {
                      setIsLoading(true);
                      if (allowance! >= price!) {
                        generateQuestion();
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
                  } else {
                    toast.error("Amount should be greater or equal to creator's fees", {
                      style: {
                        borderRadius: "10px",
                      },
                    });
                  }
                } else {
                  toast.error("Please enter your question", {
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
      ) : (
        <>
          {isPageLoading ? (
            <Button id="askQuestion" title="Ask question" />
          ) : address && chainId === Number(process.env.NEXT_PUBLIC_CHAINID) ? (
            <Button
              id="askQuestion"
              title={
                isLoading
                  ? "Sending question..."
                  : `Ask with ${isAnonAsk ? amount + amount * 0.05 : amount} DEGEN`
              }
              disabled={isLoading || !questionContent || questionContent === "<p><br></p>"}
              onClick={() => {
                if (questionContent !== "<p><br></p>") {
                  if (balance && Number(balance) >= (isAnonAsk ? amount + amount * 0.05 : amount)) {
                    setIsLoading(true);
                    if (allowance! >= (isAnonAsk ? amount + amount * 0.05 : amount)) {
                      generateQuestion();
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
                } else {
                  toast.error("Please enter your question", {
                    style: {
                      borderRadius: "10px",
                    },
                  });
                }
              }}
            />
          ) : (
            <Connect label={`Ask with ${isAnonAsk ? amount + amount * 0.05 : amount} DEGEN`} />
          )}
        </>
      )}
    </div>
  );
}
