import { useEffect, useState } from "react";
import Input from "@/components/form/input";
import toast from "react-hot-toast";
import Button from "@/components/form/button";
import type { Profile } from "@/types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useSetAtom } from "jotai";
import { feedAtom } from "@/store";

export default function Setup({ user }: Profile) {
  const { username, address: savedAddress, price: savedPrice } = user;
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address } = useAccount();
  const setFeed = useSetAtom(feedAtom);

  useEffect(() => {
    setPrice(savedPrice);
  }, [savedAddress, savedPrice]);

  const setProfile = async () => {
    const response = await fetch("/api/setCreator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        address,
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row w-full gap-3 mb-3">
        <span className="w-full sm:w-[60%]">
          <p className="text-neutral-600 text-sm md:text-lg">Payment Address</p>
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
                          className="mt-2 bg-[#eaeaea] font-primary border border-neutral-400 text-neutral-800 text-sm rounded-lg focus:border-neutral-300 focus:ring-neutral-300 active:border-neutral-400 active:ring-neutral-400 block w-full p-2.5"
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
                          className="mt-2 bg-[#eaeaea] font-primary border border-neutral-400 text-neutral-800 text-sm rounded-lg focus:border-neutral-300 focus:ring-neutral-300 active:border-neutral-400 active:ring-neutral-400 block w-full p-2.5"
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
                          className="mt-2 bg-[#eaeaea] font-primary border border-neutral-400 text-neutral-800 text-sm rounded-lg focus:border-neutral-300 focus:ring-neutral-300 active:border-neutral-400 active:ring-neutral-400 block w-full p-2.5"
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
          <div className="text-sm mt-1 font-primary text-neutral-400">
            You will receive payment on this address
          </div>
        </span>
        <span className="w-full sm:w-[40%]">
          <Input
            id="price"
            name="price"
            label="Set your price (DEGEN)"
            placeholder="250"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            helper="Asker will pay you this amount"
          />
        </span>
      </div>
      <Button
        id="button"
        title={
          isLoading ? "Saving..." : <p>Save {price > 0 && `(${(price * 0.027).toFixed(2)} USD)`}</p>
        }
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          if (address) {
            await setProfile();
          } else {
            toast.error("Please connect your wallet", {
              style: {
                borderRadius: "10px",
              },
            });
            setIsLoading(false);
          }
        }}
      />
    </div>
  );
}
