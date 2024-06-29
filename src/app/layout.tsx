import { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Degenask",
  description:
    "Earn $DEGEN for answering questions and ask anything to your favourite creators that you're curious about",
  icons: "/degenask.png",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_HOST_URL,
    title: "Degenask",
    description:
      "Earn $DEGEN for answering questions and ask anything to your favourite creators that you're curious about",
    images: {
      url: `${process.env.NEXT_PUBLIC_HOST_URL}/metadata/degenaskv2.gif`,
      alt: "Degenask",
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
      <body className="bg-[#ffffff]">
        <Providers>{children}</Providers>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
