import React from 'react'
import Logo from './Logo';
import { FunctionComponent } from "react";

interface ButtonProps {
    buttonLogo: string;
    title: string;
    height: number;
    width: number;
}

const Button: FunctionComponent<ButtonProps>  = ({ buttonLogo, title, height, width }) => {
    return (
        <div className='flex justify-center'>
            <button className='flex bg-[#6537B1] p-1.5 text-white w-3/4 justify-evenly items-center'>
                    <Logo src={buttonLogo} height={height} width={width} /> 
                    <div className='font-medium md:text-sm lg:text-lg xl:text-xl'>
                        {title}
                    </div>
            </button>
        </div>
    )
}

export default Button;