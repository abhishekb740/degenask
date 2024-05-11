import { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "DegenAsk",
  description:
    "Ask anything you're curious about, learn from the creator's thoughts, and earn $DEGEN for your questions.",
  icons: "/favicon.png",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://degenask.vercel.app/",
    title: "DegenAsk",
    description:
      "Ask anything you're curious about, learn from the creator's thoughts, and earn $DEGEN for your questions.",
    images: [
      {
        url: "/metadata.png",
        width: 800,
        height: 600,
        alt: "DegenAsk",
      },
    ],
  },
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
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
