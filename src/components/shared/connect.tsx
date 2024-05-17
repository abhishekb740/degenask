import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Connect({ label }: { label: string }) {
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
                    className="bg-[#A36EFD] font-primary text-white rounded-3xl py-2.5 px-10 block w-fit hover:bg-[#9a61fc] hover:shadow-lg font-medium text-sm md:text-md lg:text-lg"
                    onClick={openConnectModal}
                    type="button"
                  >
                    {label}
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    className="bg-[#A36EFD] font-primary text-white rounded-3xl py-2.5 px-10 block w-fit hover:bg-[#9a61fc] hover:shadow-lg font-medium text-sm md:text-md lg:text-lg"
                    onClick={openChainModal}
                    type="button"
                  >
                    Change network
                  </button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    className="bg-[#A36EFD] font-primary text-white rounded-3xl py-2.5 px-10 block w-fit hover:bg-[#9a61fc] hover:shadow-lg font-medium text-sm md:text-md lg:text-lg"
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
