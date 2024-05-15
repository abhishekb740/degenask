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
    url: process.env.NEXT_PUBLIC_HOST_URL,
    title: "DegenAsk",
    description:
      "Ask anything you're curious about, learn from the creator's thoughts, and earn $DEGEN for your questions.",
    images: {
      url: `${process.env.NEXT_PUBLIC_HOST_URL}/metadata.svg`,
      alt: "DegenAsk",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen bg-[#F8FAFC]">
        <Providers>{children}</Providers>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
