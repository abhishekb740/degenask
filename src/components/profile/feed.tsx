import React from "react";
import type { Questions } from "@/types";
import { useRouter } from "next/navigation";

export default function Feed({ questions }: { questions: Questions }) {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-col max-h-[30rem] overflow-auto font-primary rounded-lg scroll-smooth scrollbar">
        {questions.length > 0
          ? questions?.map((question) => (
              <div
                key={question.questionId}
                className="bg-neutral-100 p-5 my-1.5 rounded-xl flex flex-col border border-neutral-100 hover:cursor-pointer hover:shadow-lg hover:border-neutral-300"
                onClick={() => {
                  router.push(`/${question.creatorUsername}/${question.questionId}`);
                }}
              >
                <p className="mb-2 text-neutral-800">{question?.content}</p>
                <span className="flex flex-row items-center justify-between">
                  <div className="flex flex-row text-sm gap-1 items-center">
                    asked by
                    <p className="text-indigo-500 font-medium">{question?.authorUsername}</p>
                  </div>
                  <p className="text-sm text-neutral-700">
                    {question?.isAnswered ? "Answered" : "Not Answered"}
                  </p>
                </span>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
