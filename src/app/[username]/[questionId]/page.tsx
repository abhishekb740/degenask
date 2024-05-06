"use client";
import { useState } from "react";
import TextArea from "@/components/form/textarea";
import Button from "@/components/form/button";

export default function Answer() {
  const [AnswerContent, setAnswerContent] = useState<string>();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 p-20 w-full">
      <div className="mb-6 w-1/3">
        <TextArea
          id="content"
          name="content"
          label="Question Content"
          placeholder="surprise!"
          value={AnswerContent}
          onChange={(e) => setAnswerContent(e.target.value)}
        />
      </div>
      <div className="w-1/3">
        <Button id="button" title={"Answer this Question"} />
      </div>
    </div>
  );
}
