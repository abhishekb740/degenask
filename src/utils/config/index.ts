import { createWalletClient, http, createPublicClient, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

export const account = privateKeyToAccount(`${process.env.NEXT_PUBLIC_PRIVATE_KEY as Hex}`);

export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});
