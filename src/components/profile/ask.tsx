"use client";
import { useEffect, useState } from "react";
import TextArea from "@/components/form/textarea";
import Button from "@/components/form/button";
import { useSetAtom } from "jotai";
import { feedAtom } from "@/store";
import { publicClient } from "@/utils/config";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import toast from "react-hot-toast";
import { DegenAskABI, DegenAskContract, TokenABI, TokenContract } from "@/utils/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther, parseEther } from "viem";
import generateUniqueId from "generate-unique-id";
import { useLogin, usePrivy, useWallets } from "@privy-io/react-auth";

interface IAskQuestionProps {
  price: number;
  creatorAddress: string;
  creatorUsername: string;
}

export default function AskQuestion({ price, creatorAddress, creatorUsername }: IAskQuestionProps) {
  const [balance, setBalance] = useState<number>();
  const [questionId, setQuestionId] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questionContent, setQuestionContent] = useState<string>();
  const setFeed = useSetAtom(feedAtom);
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
    setQuestionId(Number(questionId));
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
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          className="mt-1 bg-[#eaeaea] font-primary border border-neutral-400 text-neutral-800 text-sm rounded-lg focus:border-neutral-300 focus:ring-neutral-300 active:border-neutral-400 active:ring-neutral-400 block w-full p-2"
                          onClick={openConnectModal}
                          type="button"
                        >
                          Connect Wallet
                        </button>
                      );
                    }
                    if (chain.unsupported) {
                      return (
                        <button
                          className="mt-1 bg-[#eaeaea] font-primary border border-neutral-400 text-neutral-800 text-sm rounded-lg focus:border-neutral-300 focus:ring-neutral-300 active:border-neutral-400 active:ring-neutral-400 block w-full p-2"
                          onClick={openChainModal}
                          type="button"
                        >
                          Wrong network
                        </button>
                      );
                    }
                    return (
                      <div style={{ display: "flex", gap: 12 }}>
                        <button
                          className="mt-1 bg-[#eaeaea] font-primary border border-neutral-400 text-neutral-800 text-sm rounded-lg focus:border-neutral-300 focus:ring-neutral-300 active:border-neutral-400 active:ring-neutral-400 block w-full p-2"
                          onClick={openAccountModal}
                          type="button"
                        >
                          {account.displayName}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
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
