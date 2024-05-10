"use client";
import { useState } from "react";
import type { Question } from "@/types";
import Button from "@/components/form/button";
import { IoMdArrowBack } from "react-icons/io";
import TextArea from "../form/textarea";
import { useRouter } from "next/navigation";

export default function Questions({ question }: { question: Question }) {
  const [answerContent, setAnswerContent] = useState<string>("");
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen justify-center items-center px-3 sm:px-10">
      <div className="relative bg-[white] p-4 md:p-8 w-full sm:w-2/3 lg:w-2/4 max-h-[50rem] font-primary rounded-xl border border-neutral-400/60 shadow-xl">
        <div
          onClick={() => {
            router.push(`/${question.creatorUsername}`);
          }}
          className="cursor-pointer items-center flex flex-row w-fit text-sm text-neutral-700 gap-2 transition-transform duration-300 ease-in-out hover:scale-110"
        >
          <IoMdArrowBack size={25} />
          <div>Go Back</div>
        </div>
        <div
          key={question.questionId}
          className="bg-neutral-200 p-5 rounded-lg flex flex-col mt-3 mb-6"
        >
          <p className="mb-2 text-neutral-800">{question.content}</p>
          <span className="flex flex-row items-center justify-between">
            <div className="flex flex-row text-sm gap-1 items-center">
              asked by
              <p className="text-indigo-500 font-medium">{question.authorUsername}</p>
            </div>
            <p className="text-sm text-neutral-700">
              {question.isAnswered ? "Answered" : "Not Answered"}
            </p>
          </span>
        </div>
        <div className="mb-4">
          <TextArea
            id="content"
            name="content"
            label="Answer this question"
            placeholder="Hey anon!"
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
          />
        </div>
        <div className="">
          <Button id="button" title="Submit" />
        </div>
      </div>
    </div>
  );
}
