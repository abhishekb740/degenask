import { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Farstack",
  description: "Built at Based Fellowship",
  icons: "/farstack.png",
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
