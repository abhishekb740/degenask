import React from "react";
import { useState } from "react";
import { FunctionComponent } from "react";
import TextArea from "../form/textarea";
import Button from "../form/button";

interface IAskAQuestionProps {
  price: number;
}

const AskAQuestion: FunctionComponent<IAskAQuestionProps> = ({ price }) => {
  const [questionContent, setQuestionContent] = useState<string>();

  return (
    <div>
      <div className="mb-6">
        <TextArea
          id="content"
          name="content"
          label="Ask a question"
          placeholder="What is your favourite colour?"
          value={questionContent}
          onChange={(e) => setQuestionContent(e.target.value)}
        />
      </div>
      <div>
        <Button id="button" title="Submit Your Question" />
      </div>
    </div>
  );
};

export default AskAQuestion;
