import React from 'react'
import Logo from './Logo';
import { FunctionComponent } from "react";

interface ButtonProps {
    buttonLogo: string;
    title: string
}

const Button: FunctionComponent<ButtonProps>  = ({ buttonLogo, title }) => {
    return (
        <div className='flex justify-center'>
            <button className='flex bg-[#6537B1] p-1.5 text-white w-3/4 justify-evenly items-center'>
                    <Logo src={buttonLogo} /> 
                    <div className='font-medium md:text-sm lg:text-lg xl:text-xl'>
                        {title}
                    </div>
            </button>
        </div>
    )
}

export default Button;