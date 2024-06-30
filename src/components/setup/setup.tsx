import { useEffect, useState } from "react";
import Input from "../form/input";
import Button from "../form/button";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import dynamic from "next/dynamic";
import { DegenaskABI, DegenaskContract } from "@/utils/constants";
import { parseEther } from "viem";
import toast from "react-hot-toast";
import type { User, Userv1 } from "@/types";
import { authMethodAtom, degenPrice, userAtom } from "@/store";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { updateCreator, updatev1User } from "@/app/_actions/queries";
import { FiAlertCircle } from "react-icons/fi";
import { PiMoneyWavy } from "react-icons/pi";
import { IoInformationCircle } from "react-icons/io5";

const Connect = dynamic(() => import("@/components/shared/connect"), {
  ssr: false,
});

export default function SetProfile({ user, userv1 }: { user: User; userv1: Userv1 }) {
  const {
    username,
    feeAddress: userFeeAddress,
    fees: userFees,
    count,
    address: userAddress,
    pfp,
  } = user;
  const [fees, setFees] = useState<number>(0);
  const [feeAddress, setFeeAddress] = useState<string>();
  const { address, chainId } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setUser = useSetAtom(userAtom);
  const setAuthMethod = useSetAtom(authMethodAtom);
  const router = useRouter();
  const authMethod = useAtomValue(authMethodAtom);
  const degenPriceUsd = useAtomValue(degenPrice);
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
    if (userv1) {
      setFees(userv1.price);
      setFeeAddress(userv1.address);
    } else {
      setFees(userFees);
      setFeeAddress(userFeeAddress);
    }
  }, [userFees, userFeeAddress, userv1]);

  const setProfile = () => {
    if (userFees > 0) {
      writeContractAsync({
        account: address,
        address: DegenaskContract,
        abi: DegenaskABI,
        functionName: "editCreator",
        args: [feeAddress, parseEther(String(fees))],
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
        args: [feeAddress, parseEther(String(fees))],
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
    const response = await updateCreator(
      username,
      feeAddress!,
      String(address),
      fees,
      fcUser?.farcaster?.pfp!,
    );
    const updateResponse = await updatev1User(username);
    if (response.status === 204 && updateResponse.status === 204) {
      toast.success("Saved successfully", {
        style: {
          borderRadius: "10px",
        },
      });
      setUser({
        username,
        address: String(address),
        fees,
        feeAddress: String(feeAddress),
        count,
        pfp: String(fcUser?.farcaster?.pfp),
      });
    }
    setIsLoading(false);
    router.push(`/${user.username}`);
    setAuthMethod("");
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
          <div className="absolute bottom-full -left-20 md:right-0 transform -translate-x-1/2 mb-2 min-w-64 p-3 bg-white md:bg-violet-400 bg-opacity-90 md:bg-opacity-30 border border-violet-300 md:border-violet-400 text-neutral-800 md:text-neutral-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
        suffix={`DEGEN ${fees ? `(${(fees * degenPriceUsd).toFixed(2)} USD)` : ``}`}
      />
      <Input
        id="address"
        name="address"
        label="Fee Address"
        placeholder="0x345...c789"
        type="string"
        onChange={(e) => {
          setFeeAddress(e.target.value);
        }}
        value={feeAddress}
        helper="You will receive earnings on this address"
      />
      {authMethod === "initial" && (
        <span className="flex flex-row gap-2 text-sm items-start justify-start p-2 bg-yellow-400 bg-opacity-25 border border-amber-400 text-neutral-500 rounded-xl">
          <FiAlertCircle size={20} color="#d97706" /> NOTE: You can use any wallet to create page
          but your account will bind with the address that you will use to sign it.
        </span>
      )}
      <div className="flex flex-row gap-4 items-start">
        {isPageLoading ? (
          <Button
            id="setCreator"
            title={
              authMethod === "initial" ? (userv1 ? "Import data" : "Create a Page") : "Save price"
            }
          />
        ) : address && chainId === Number(process.env.NEXT_PUBLIC_CHAINID) ? (
          <Button
            id="setCreator"
            title={
              authMethod === "initial"
                ? userv1
                  ? isLoading
                    ? "Importing data..."
                    : "Import data"
                  : isLoading
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
                    toast.error("Please connect your initially signed account", {
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
                toast.error("You are not authorized to set fees form.", {
                  style: {
                    borderRadius: "10px",
                  },
                });
              }
            }}
          />
        ) : (
          <Connect
            label={`${authMethod === "initial" ? (userv1 ? "Import data" : "Create a Page") : "Save price"}`}
          />
        )}
        {authMethod === "edit" && (
          <button
            id="cancel"
            onClick={() => {
              router.push(`/${user.username}`);
              setAuthMethod("");
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
