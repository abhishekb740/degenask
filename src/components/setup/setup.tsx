import { useEffect, useState } from "react";
import Input from "../form/input";
import Button from "../form/button";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import dynamic from "next/dynamic";
import { DegenAskABI, DegenAskContract } from "@/utils/constants";
import { parseEther } from "viem";
import toast from "react-hot-toast";
import type { User } from "@/types";
import { authMethodAtom, userAtom } from "@/store";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { updateCreator } from "@/app/_actions/queries";

const Connect = dynamic(() => import("@/components/shared/connect"), {
  ssr: false,
});

export default function SetProfile({ user }: { user: User }) {
  const { username, address: savedAddress, price, count } = user;
  const [fees, setFees] = useState<number>();
  const { address, chainId } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setUser = useSetAtom(userAtom);
  const router = useRouter();
  const authMethod = useAtomValue(authMethodAtom);
  const { user: fcUser } = usePrivy();
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
    const response = await updateCreator(username, String(address), fees!);
    if (response.status === 204) {
      toast.success("Saved successfully", {
        style: {
          borderRadius: "10px",
        },
      });
      setUser({
        username,
        address: String(address),
        price: fees ?? 0,
        count,
        degen: user.degen,
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
        suffix={`DEGEN ${fees ? `(${(fees * user.degen).toFixed(2)} USD)` : ``}`}
      />
      <div className="inline-flex gap-4 items-center">
        {isPageLoading ? (
          <Button id="setPrice" title={authMethod === "initial" ? "Create a Page" : "Save price"} />
        ) : address && chainId === Number(process.env.NEXT_PUBLIC_CHAINID) ? (
          <Button
            id="setPrice"
            title={
              authMethod === "initial"
                ? isLoading
                  ? "Creating page..."
                  : "Create a Page"
                : isLoading
                  ? "Saving..."
                  : "Save price"
            }
            disabled={isLoading || !fees}
            onClick={() => {
              if (user.username === fcUser?.farcaster?.username) {
                if (user.address) {
                  if (user.address === address) {
                    setIsLoading(true);
                    setProfile();
                  } else {
                    toast.error("Please connect your initial signed account", {
                      style: {
                        borderRadius: "10px",
                      },
                    });
                  }
                } else {
                  setIsLoading(true);
                  setProfile();
                }
              } else {
                toast.error("You are not authorized to set price", {
                  style: {
                    borderRadius: "10px",
                  },
                });
              }
            }}
          />
        ) : (
          <Connect label={`${authMethod === "initial" ? "Create a Page" : "Save price"}`} />
        )}
        {authMethod === "edit" && (
          <Button
            id="cancel"
            title="Go back"
            onClick={() => {
              router.push(`/${user.username}`);
            }}
          />
        )}
      </div>
    </div>
  );
}
