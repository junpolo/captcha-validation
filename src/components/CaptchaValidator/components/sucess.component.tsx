import React from "react";

import { Button } from "@components";

type SuccessComponentProps = {
  onRecaptcha: () => void;
};

export const SuccessComponent: React.FC<Partial<SuccessComponentProps>> = ({
  onRecaptcha,
}) => {
  const handleClick = () => {
    if (onRecaptcha) onRecaptcha();
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center text-4xl font-semibold capitalize">
        Well done!
      </h1>

      <p className="text-center text-2xl font-semibold">
        You have proven your humanity.
      </p>

      <Button onClick={handleClick}>reCAPTCHA</Button>
    </div>
  );
};
