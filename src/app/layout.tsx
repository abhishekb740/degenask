import { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "DegenAsk.me",
  description: "Get paid to ask questions.",
  icons: "/DegenAsk.meLogo.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen bg-gradient-radial from-[#80e5f7] via-[#2dd1fe] to-[#06acff]">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
