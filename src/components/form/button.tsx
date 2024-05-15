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
        className="text-neutral-500 text-sm md:text-lg"
        style={{ marginRight: 0 }}
      >
        {label}
      </label>
      <button
        id={id}
        onClick={onClick}
        className="bg-[#A36EFD] hover:bg-[#9a61fc] disabled:opacity-75 hover:shadow-lg text-white py-2.5 px-10 rounded-3xl w-fit disabled:cursor-progress"
        disabled={disabled}
      >
        <div className="font-medium font-primary text-sm md:text-md lg:text-lg justify-center">
          {title}
        </div>
      </button>
      <div className="text-sm mt-1 font-primary text-neutral-400">{helper}</div>
    </div>
  );
};

export default Button;
