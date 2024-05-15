import { useEffect, useState } from "react";
import Input from "../form/input";
import Button from "../form/button";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import dynamic from "next/dynamic";
import { DegenAskABI, DegenAskContract } from "@/utils/constants";
import { parseEther } from "viem";
import toast from "react-hot-toast";
import type { User } from "@/types";
import { userAtom } from "@/store";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";

const ConnectButton = dynamic(() => import("@/components/shared/connect"), {
  ssr: false,
});

export default function SetProfile({ user }: { user: User }) {
  const { username, address: savedAddress, price, count } = user;
  const [fees, setFees] = useState<number>();
  const { address, chainId } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setUser = useSetAtom(userAtom);
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const { data, writeContractAsync, status } = useWriteContract();
  const {
    isSuccess,
    status: isValid,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  useEffect(() => {
    setFees(price);
  }, [price]);

  const setProfile = () => {
    if (price > 0) {
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
          price: fees ?? 0,
          count,
        },
      });
    }
    setIsLoading(false);
    router.push(`/${user.username}`);
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
    setIsPageLoading(false);
    console.log(chainId);
  }, []);

  return (
    <div className="flex flex-col w-full md:w-3/5 gap-5 items-start justify-start font-primary">
      <h2 className="text-xl text-neutral-500">Set-up Profile</h2>
      <Input
        id="price"
        name="price"
        label="Price to ask"
        placeholder="250"
        type="number"
        onChange={(e) => {
          setFees(e.target.value);
        }}
        value={fees}
        suffix={`DEGEN ${fees ? `(${(fees * 0.024).toFixed(2)} USD)` : ``}`}
      />
      {isPageLoading ? (
        <Button id="setPrice" title="Create a Page" />
      ) : address && chainId === 84532 ? (
        <Button
          id="setPrice"
          title="Create a Page"
          disabled={isLoading || !fees}
          onClick={() => {
            setIsLoading(true);
            setProfile();
          }}
        />
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
