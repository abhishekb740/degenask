import { useEffect, useState } from "react";
import Input from "../form/input";
import Button from "../form/button";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import dynamic from "next/dynamic";
import { DegenaskABI, DegenaskContract } from "@/utils/constants";
import { parseEther } from "viem";
import toast from "react-hot-toast";
import type { User } from "@/types";
import { authMethodAtom, userAtom } from "@/store";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { updateCreator } from "@/app/_actions/queries";
import { FiAlertCircle } from "react-icons/fi";
import { PiMoneyWavy } from "react-icons/pi";
import { IoInformationCircle } from "react-icons/io5";

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
        address: DegenaskContract,
        abi: DegenaskABI,
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
        address: DegenaskContract,
        abi: DegenaskABI,
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
      <div className="flex flex-row gap-4 items-center justify-between w-full">
        <h2 className="text-xl text-neutral-500">Setup Profile</h2>
        <div className="relative group">
          <IoInformationCircle size={25} className="text-neutral-600" />
          <div className="absolute bottom-full -left-20 md:left-1/2 transform -translate-x-1/2 mb-2 min-w-64 p-3 bg-white md:bg-violet-400 bg-opacity-90 md:bg-opacity-30 border border-violet-300 md:border-violet-400 text-neutral-800 md:text-neutral-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="flex flex-col gap-1.5 text-sm items-center justify-center">
              <PiMoneyWavy size={20} /> For a smooth and well-maintained experience, we apply a 10%
              service fee to cover maintenance costs.
            </div>
          </div>
        </div>
      </div>
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
        helper="Asker will pay you this amount to ask question"
        suffix={`DEGEN ${fees ? `(${(fees * user.degen).toFixed(2)} USD)` : ``}`}
      />

      {authMethod === "initial" && (
        <span className="flex flex-row gap-2 text-sm items-start justify-start p-2 bg-yellow-400 bg-opacity-25 border border-amber-400 text-neutral-500 rounded-xl">
          <FiAlertCircle size={20} color="#d97706" /> NOTE: You won&apos;t be able to change wallet
          address again. Please use your account accordingly.
        </span>
      )}
      <div className="flex flex-row gap-4 items-start">
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
          <button
            id="cancel"
            onClick={() => {
              router.push(`/${user.username}`);
            }}
            className="font-medium font-primary border border-[#A36EFD] hover:bg-[#9a61fc] hover:shadow-lg hover:text-white text-sm md:text-md lg:text-lg py-[0.575rem] px-10 rounded-3xl w-fit"
          >
            Go back
          </button>
        )}
      </div>
    </div>
  );
}
