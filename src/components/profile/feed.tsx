import React from "react";
import type { Question } from "@/types";

export default function Feed({ key, question }: { key: string; question: Question }) {
  function formatAddress(address: string): string {
    if (address.length <= 8) {
      return address;
    } else {
      const firstPart = address.substring(0, 4);
      const lastPart = address.substring(address.length - 4);
      return `${firstPart}...${lastPart}`;
    }
  }
  return (
    <div
      key={key}
      className="flex flex-col bg-white p-4 sm:p-6 w-full mb-3.5 font-primary rounded-3xl shadow-xl"
    >
      <span className="flex flex-row gap-4 items-center">
        <span className="w-8 h-8 bg-gradient-to-b from-violet-500 to-blue-600 rounded-full"></span>
        {formatAddress(question.authorAddress)}
      </span>
      <p className="mt-2">{question.content}</p>
    </div>
  );
}
