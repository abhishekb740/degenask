"use client";
import { useEffect, useState } from "react";
import TextArea from "@/components/form/textarea";
import Button from "@/components/form/button";
import { useAtomValue, useSetAtom } from "jotai";
import { feedAtom } from "@/store";
import { publicClient } from "@/utils/config";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { TokenABI, TokenContract } from "@/utils/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";

interface IAskQuestionProps {
  price: number;
}

export default function AskQuestion({ price }: IAskQuestionProps) {
  const [balance, setBalance] = useState<string>("");
  const [questionContent, setQuestionContent] = useState<string>();
  const feed = useAtomValue(feedAtom);
  const setFeed = useSetAtom(feedAtom);

  const { address } = useAccount();
  const getBalance = async () => {
    if (address) {
      try {
        const balance = await publicClient.readContract({
          address: TokenContract,
          abi: TokenABI,
          functionName: "balanceOf",
          args: [address],
        });
        setBalance(formatEther(balance as bigint));
      } catch (e) {
        toast.error("Error fetching wallet balance", {
          style: {
            borderRadius: "10px",
          },
        });
      }
    } else {
      setBalance("");
    }
  };

  useEffect(() => {
    getBalance();
  }, [address]);
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
        <Button
          id="button"
          title={`Pay ${price} DEGEN`}
          onClick={() => {
            if (address) {
            } else {
              toast.error("Connect wallet to ask question", {
                style: {
                  borderRadius: "10px",
                },
              });
            }
          }}
        />
      </div>
    </div>
  );
}
