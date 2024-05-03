"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import config from "@/utils/wagmi";
import { ConnectKitProvider } from "connectkit";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="retro">
          <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            config={{
              appearance: {
                theme: "dark",
                accentColor: "#676FFF",
                logo: "/farstack.png",
              },
              defaultChain: baseSepolia,
              loginMethods: ["farcaster"],
              embeddedWallets: {
                createOnLogin: "all-users",
              },
            }}
          >
            {children}
          </PrivyProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
