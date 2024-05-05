import { useEffect, useState } from "react";
import Input from "../form/input";
import toast from "react-hot-toast";
import type { Profile } from "@/types";

export default function Setup({ user }: Profile) {
  const { username, address: savedAddress, price: savedPrice } = user;
  const [address, setAddress] = useState<string>();
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setAddress(savedAddress);
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
    window.location.reload();
  };
  return (
    <div>
      <div className="flex flex-col sm:flex-row w-full gap-3">
        <span className="w-[65%]">
          <Input
            id="address"
            name="address"
            label="Payment Address"
            placeholder="0x478...0803"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            helper="All payments will be received on this address"
          />
        </span>
        <span className="w-[35%]">
          <Input
            id="price"
            name="price"
            label="Set your price (ETH)"
            placeholder="0.003"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            helper="Asker will pay you this amount"
          />
        </span>
      </div>
      <button
        className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white p-2.5 rounded-lg w-full disabled:cursor-progress"
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          await setProfile();
        }}
      >
        {isLoading ? "Saving..." : <p>Save {price > 0 && `(${(price * 3100).toFixed(2)} USD)`}</p>}
      </button>
    </div>
  );
}
