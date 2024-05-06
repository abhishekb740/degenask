import React, { ReactNode } from "react";

interface IButton {
  id: string;
  label?: string;
  title: string | ReactNode;
  helper?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ id, label, title, helper, onClick, disabled }: IButton) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-neutral-600 text-sm md:text-lg"
        style={{ marginRight: 0 }}
      >
        {label}
      </label>
      <button
        id={id}
        onClick={onClick}
        className="bg-indigo-500 hover:bg-indigo-600 text-white p-2.5 rounded-lg w-full disabled:cursor-progress"
        disabled={disabled}
      >
        <div className="font-medium font-primary text-sm md:text-md lg:text-lg">{title}</div>
      </button>
      <div className="text-sm mt-1 font-primary text-neutral-400">{helper}</div>
    </div>
  );
};

export default Button;
