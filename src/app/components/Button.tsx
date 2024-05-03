"use client";
import React from 'react'
import Logo from './Logo';
import { FunctionComponent } from "react";
import { StaticImageData } from 'next/image';

interface ButtonProps {
    buttonLogo: string | StaticImageData;
    title: string;
    height: number;
    width: number;
    buttonColor?: string;
    buttonHeight?: number;
    buttonWidth?: number;
    textColor?: string;
}

const Button: FunctionComponent<ButtonProps>  = ({ buttonLogo, title, height, width, buttonColor, buttonHeight, buttonWidth, textColor }) => {
    return (
        <div className='flex justify-center'>
            <button className={`flex bg-[${buttonColor}] p-1.5 text-[${textColor}] w-[${buttonWidth}] h-[${buttonHeight}] justify-evenly items-center gap-2 rounded-md`}>
                    <Logo src={buttonLogo} height={height} width={width} />
                    <div className='font-medium md:text-sm lg:text-lg xl:text-sm'>
                        {title}
                    </div>
            </button>
        </div>
    )
}

export default Button;