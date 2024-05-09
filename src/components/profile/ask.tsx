"use client";
import { useState } from "react";
import TextArea from "@/components/form/textarea";
import Button from "@/components/form/button";

interface IAskQuestionProps {
  price: number;
}

export default function AskQuestion({ price }: IAskQuestionProps) {
  const [questionContent, setQuestionContent] = useState<string>();
  return (
    <div>
      <div className="mb-5">
        <TextArea
          id="content"
          name="content"
          label="Ask a question"
          placeholder="Degen IRL party wen?"
          value={questionContent}
          onChange={(e) => setQuestionContent(e.target.value)}
        />
      </div>
      <div>
        <Button id="button" title={`Pay ${price} DEGEN`} />
      </div>
    </div>
  );
}
