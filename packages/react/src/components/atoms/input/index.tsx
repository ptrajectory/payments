import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const inputVariants = cva(
    "font-inter font-medium  w-full px-[8px] border-2 border-gray-300 focus:outline-none",
    {
        variants: {
            variant: {
                default: "rounded-[6px]",
            },
            input_size: {
                sm: "text-[16px] h-8",
                md: "text-[18px] h-10",
                lg: "text-[20px] h-12",
            }
        },
        defaultVariants: {
            variant: "default",
            input_size: "md",
        }
    }
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {

}


const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, variant = "default", input_size = "md", ...props}, ref) => {
        return (
            <input 
                ref={ref}
                className={`${inputVariants({variant, input_size})} ${className}`}
                {...props}
            />
        )
    }
)

Input.displayName = "Input"

export default Input