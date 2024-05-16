import React from "react";

interface IInput {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  onChange: (e: any) => void;
  value?: string | number;
  helper?: string;
  suffix?: string;
}

const Input = ({ id, name, label, placeholder, type, onChange, value, helper, suffix }: IInput) => {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="text-neutral-500 text-sm md:text-lg"
        style={{ marginRight: 0 }}
      >
        {label}
      </label>
      <div className="flex flex-row w-full items-center justify-between mt-2 bg-[#F6F6F6] text-neutral-500 rounded-xl px-2.5">
        <input
          id={id}
          name={name}
          onChange={onChange}
          className="font-primary text-neutral-800 bg-[#F6F6F6] text-sm placeholder:text-neutral-400 focus:outline-none block w-[60%] xl:w-[70%] px-2.5 py-3.5"
          placeholder={placeholder}
          type={type}
          value={value}
          required
        />
        <p className="min-w-[10%]">{suffix}</p>
      </div>
      <div className="text-sm mt-1 font-primary text-neutral-400">{helper}</div>
    </div>
  );
};

export default Input;
