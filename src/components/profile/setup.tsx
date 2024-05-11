"use client";
import { useEffect, useState } from "react";
import Input from "@/components/form/input";
import toast from "react-hot-toast";
import Button from "@/components/form/button";
import type { Profile } from "@/types";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useSetAtom } from "jotai";
import { feedAtom, userAtom } from "@/store";
import { DegenAskABI, DegenAskContract } from "@/utils/constants";
import { parseEther } from "viem";
import Connect from "../shared/connect";

export default function Setup({ user }: Profile) {
  const { username, address: savedAddress, price: savedPrice, count, fid } = user;
  const [fees, setFees] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address } = useAccount();
  const setFeed = useSetAtom(feedAtom);
  const setUser = useSetAtom(userAtom);
  const { data, writeContractAsync, status } = useWriteContract();
  const {
    isSuccess,
    status: isValid,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  useEffect(() => {
    setFees(savedPrice);
  }, [savedAddress, savedPrice]);

  const setProfile = () => {
    if (savedPrice > 0) {
      writeContractAsync({
        account: address,
        address: DegenAskContract,
        abi: DegenAskABI,
        functionName: "editCreatorFee",
        args: [parseEther(String(fees))],
      }).catch((error) => {
        setIsLoading(false);
        toast.error("User rejected the request", {
          style: {
            borderRadius: "10px",
          },
        });
      });
    } else {
      writeContractAsync({
        account: address,
        address: DegenAskContract,
        abi: DegenAskABI,
        functionName: "createCreator",
        args: [parseEther(String(fees))],
      }).catch((error) => {
        setIsLoading(false);
        toast.error("User rejected the request", {
          style: {
            borderRadius: "10px",
          },
        });
      });
    }
  };

  const store = async () => {
    const response = await fetch("/api/setCreator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        address,
        price: fees,
      }),
    });
    if (response.status === 200) {
      toast.success("Saved successfully", {
        style: {
          borderRadius: "10px",
        },
      });
      setUser({
        user: {
          username,
          address: String(address),
          price: fees,
          count,
          fid,
        },
      });
      setFeed("feed");
    }
    setIsLoading(false);
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row w-full gap-3 mb-3">
        <span className="w-full sm:w-[60%]">
          <p className="text-neutral-600 text-sm md:text-lg">Payment Address</p>
          <Connect padding="mt-2 p-2.5" />
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
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            helper="Asker will pay you this amount"
          />
        </span>
      </div>
      <Button
        id="button"
        title={
          isLoading ? "Saving..." : <p>Save {fees > 0 && `(${(fees * 0.024).toFixed(2)} USD)`}</p>
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
