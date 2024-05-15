import { useEffect, useState } from "react";
import Input from "../form/input";
import Button from "../form/button";
import { useAccount } from "wagmi";
import dynamic from "next/dynamic";

const ConnectButton = dynamic(() => import("@/components/shared/connect"), {
  ssr: false,
});

export default function SetProfile() {
  const [price, setPrice] = useState<number>();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(false);
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
          setPrice(e.target.value);
        }}
        value={price}
        suffix={`DEGEN ${price ? `(${(price * 0.024).toFixed(2)} USD)` : ``}`}
      />
      {isLoading ? (
        <Button id="setPrice" title="Create a Page" />
      ) : address ? (
        <Button
          id="setPrice"
          title="Create a Page"
          onClick={() => {
            console.log("submitting");
          }}
        />
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
