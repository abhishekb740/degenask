import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";
import { StaticImageData } from 'next/image';

export interface ILogo {
    src: string | StaticImageData;
    className?: string;
}

const Logo: FunctionComponent<ILogo> = ({ src }) => {
    return (
        <div>
            <Image
                src={src}
                alt="Logo"
                className="object-cover cursor-pointer"
                height={20}
                width={20}
            />
        </div>
    );
};

export default Logo;