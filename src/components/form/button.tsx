import React from "react";
import { StaticImageData } from "next/image";
import { FunctionComponent } from "react";

interface IButton {
  id: string;
  label?: string;
  title: string;
}

const Button: FunctionComponent<IButton> = ({ id, label, title }) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-neutral-600 text-sm md:text-lg"
        style={{ marginRight: 0 }}
      >
        {label}
      </label>
      <button id={id} className={"bg-[#009DF5] w-full p-2 rounded-md text-white"}>
        <div className="font-medium md:text-sm lg:text-lg xl:text-sm">{title}</div>
      </button>
    </div>
  );
};
export default Button;
