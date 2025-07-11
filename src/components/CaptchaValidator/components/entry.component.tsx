import { Button } from "@components";
import React from "react";

type EntryComponentProps = {
  onContinue: () => void;
};

export const EntryComponent: React.FC<Partial<EntryComponentProps>> = ({
  onContinue,
}) => {
  const handleClick = () => {
    if (onContinue) onContinue();
  };

  return (
    <div className="grid justify-center items-center  gap-7">
      <div className="text-center">
        <p className="text-3xl">Welcome to the Captcha Validator</p>
        <p className="text-xl">This will test whether you're a robot or not</p>
      </div>
      <Button onClick={handleClick}>Continue</Button>
    </div>
  );
};
