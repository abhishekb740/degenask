"use client";

import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";
import { StaticImageData } from "next/image";

export interface ILogo {
  src: string;
  className?: string;
  height: number;
  width: number;
}

const Logo: FunctionComponent<ILogo> = ({ src, height, width }) => {
  return (
    <div>
      <Image
        src={src}
        alt="Logo"
        className="object-cover cursor-pointer"
        height={height}
        width={width}
      />
    </div>
  );
};

export default Logo;
