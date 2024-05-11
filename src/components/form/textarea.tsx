import React from "react";

interface ITextarea {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  onChange: (e: any) => void;
  value?: string | number;
  helper?: string;
  disabled?: boolean;
}

const TextArea = ({
  id,
  name,
  label,
  placeholder,
  onChange,
  value,
  helper,
  disabled,
}: ITextarea) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-neutral-600 text-sm md:text-lg"
        style={{ marginRight: 0 }}
      >
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        onChange={onChange}
        className="mt-2 bg-[#eaeaea] font-primary border border-neutral-400 text-neutral-800 text-sm placeholder:text-neutral-500 rounded-lg focus:border-neutral-300 focus:ring-neutral-300 active:border-neutral-400 active:ring-neutral-400 block w-full p-2.5 disabled:cursor-not-allowed"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        required
      />
      <div className="text-sm mt-1 font-primary text-neutral-400">{helper}</div>
    </div>
  );
};

export default TextArea;
