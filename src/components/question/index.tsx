"use client";
import { useEffect, useState } from "react";
import type { Answer, Question } from "@/types";
import Button from "@/components/form/button";
import { IoMdArrowBack } from "react-icons/io";
import TextArea from "../form/textarea";
import { useRouter } from "next/navigation";
import { useLogin, usePrivy, useWallets } from "@privy-io/react-auth";
import toast from "react-hot-toast";
import { calculateDeadline, getDate } from "@/utils/helper";
import { publicClient, walletClient, account } from "@/utils/config";
import { DegenAskABI, DegenAskContract } from "@/utils/constants";
import generateUniqueId from "generate-unique-id";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useAtomValue, useSetAtom } from "jotai";
import { userAtom } from "@/store";
import Connect from "../shared/connect";

export default function Questions({ question }: { question: Question }) {
  const [answerContent, setAnswerContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<Answer>();
  const router = useRouter();
  const profile = useAtomValue(userAtom);
  const setProfile = useSetAtom(userAtom);
  const { wallets } = useWallets();
  const { address } = useAccount();
  const { authenticated, user, createWallet } = usePrivy();
  const { data, writeContractAsync, status } = useWriteContract();
  const {
    isSuccess,
    status: isValid,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

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
    const count = profile.user.count + 1;
    const response = await fetch("/api/setCreator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: profile.user.username,
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
        user: {
          username: profile.user.username,
          address: profile.user.address,
          price: profile.user.price,
          count: profile.user.count + 1,
          fid: profile.user.fid,
        },
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
      console.log(error);
      setIsLoading(false);
      toast.error("An error occurred while submitting your answer. Please try again.", {
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
    },
    onError(error) {
      console.log("🔑 🚨 Login error", { error });
    },
  });

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

  return (
    <div className="flex flex-col min-h-screen justify-center items-center px-3 sm:px-10">
      <div className="relative bg-[white] p-4 md:p-8 w-full sm:w-2/3 lg:w-2/4 max-h-[50rem] font-primary rounded-xl border border-neutral-400/60 shadow-xl">
        <div
          onClick={() => {
            router.push(`/${question.creatorUsername}`);
          }}
          className="cursor-pointer items-center flex flex-row w-fit text-sm text-neutral-700 gap-2 transition-transform duration-300 ease-in-out hover:scale-110"
        >
          <IoMdArrowBack size={25} />
          <div>Go Back</div>
        </div>
        <div key={question.questionId} className="bg-neutral-100 p-5 rounded-lg flex flex-col my-3">
          <p className="mb-2 text-neutral-800">{question.content}</p>
          <span className="flex flex-row items-center justify-between">
            <div className="flex flex-row text-sm gap-1 items-center">
              asked by
              <p className="text-indigo-500 font-medium">{question.authorUsername}</p>
            </div>
            <p className="text-sm text-neutral-700">
              {question.isAnswered ? "Answered" : `${calculateDeadline(question.createdAt)}`}
            </p>
          </span>
        </div>
        {answer && (address === question.authorAddress || address === question.creatorAddress) ? (
          <div className="bg-neutral-200 p-5 rounded-lg flex flex-col ml-8 my-3">
            <p className="mb-2 text-neutral-800">{answer.content}</p>
            <span className="flex flex-row items-center justify-between">
              <div className="flex flex-row text-sm gap-1 items-center">
                answered by
                <p className="text-indigo-500 font-medium">{answer.creatorUsername}</p>
              </div>
              <p className="text-sm text-neutral-700">{getDate(answer.createdAt)}</p>
            </span>
          </div>
        ) : (
          answer && (
            <div className="relative bg-neutral-200 p-5 rounded-lg flex flex-col ml-8 my-3">
              <p className="mb-2 blur select-none text-neutral-800">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro facilis praesentium
                minima natus fugiat nobis quidem suscipit, vel recusandae deserunt cupiditate!
              </p>
              <p className="absolute items-center justify-center">
                Unlock this answer by connecting your wallet
              </p>
              <span className="flex flex-row items-center justify-between">
                <div className="flex flex-row text-sm gap-1 items-center">
                  answered by
                  <p className="text-indigo-500 font-medium">{answer.creatorUsername}</p>
                </div>
                <p className="text-sm text-neutral-700">{getDate(answer.createdAt)}</p>
              </span>
            </div>
          )
        )}
        {!question.isAnswered && calculateDeadline(question.createdAt) !== "Expired" && (
          <div>
            <div className="my-3">
              <TextArea
                id="content"
                name="content"
                label="Answer this question"
                placeholder="Hey anon!"
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                disabled={user?.farcaster?.username !== question.creatorUsername}
              />
            </div>
            {user?.farcaster?.username ? (
              user?.farcaster?.username === question.creatorUsername ? (
                <Button
                  id="button"
                  title={isLoading ? "Posting answer..." : "Submit"}
                  disabled={isLoading}
                  onClick={() => {
                    if (answerContent) {
                      setIsLoading(true);
                      submitAnswer();
                    } else {
                      toast.error("Please enter an answer", {
                        style: {
                          borderRadius: "10px",
                        },
                      });
                    }
                  }}
                />
              ) : (
                <Button id="button" title="You're not creator of this account." />
              )
            ) : (
              <Button id="button" title="Connect Farcaster" onClick={login} />
            )}
          </div>
        )}
        {question.isAnswered && <Connect />}
        {calculateDeadline(question.createdAt) === "Expired" && !question.isAnswered && address ? (
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
          calculateDeadline(question.createdAt) === "Expired" && !question.isAnswered && <Connect />
        )}
      </div>
    </div>
  );
}
