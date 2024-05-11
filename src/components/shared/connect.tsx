import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Connect({ padding }: { padding: string }) {
  return (
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
                    className={`${padding} bg-[#eaeaea] font-primary border border-neutral-400 text-neutral-800 text-sm rounded-lg focus:border-neutral-300 focus:ring-neutral-300 active:border-neutral-400 active:ring-neutral-400 block w-full`}
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
                    className={`${padding} bg-[#eaeaea] font-primary border border-neutral-400 text-neutral-800 text-sm rounded-lg focus:border-neutral-300 focus:ring-neutral-300 active:border-neutral-400 active:ring-neutral-400 block w-full`}
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
                    className={`${padding} bg-[#eaeaea] font-primary border border-neutral-400 text-neutral-800 text-sm rounded-lg focus:border-neutral-300 focus:ring-neutral-300 active:border-neutral-400 active:ring-neutral-400 block w-full`}
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
  );
}
