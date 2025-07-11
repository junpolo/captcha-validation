"use client";
import React, { PropsWithChildren } from "react";

type ButtonProps = Required<PropsWithChildren> & {
  className?: string | undefined;
  onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-6 px-4 rounded cursor-pointer text-xl ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
