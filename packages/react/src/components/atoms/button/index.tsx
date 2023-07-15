import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"
import { cn } from "../../../lib"
import buttonVariants from "./utils"
import { Loader } from "lucide-react"


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, isLoading, disabled,loadingText,  ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {
            isLoading ? <div className="flex flex-row items-center justify-center space-x-2">
                <Loader className="text-white animate-spin" size={20} />
                <span className="text-white font-inter font-semibold" >
                    {loadingText ? loadingText : "Loading"}...
                </span>
            </div> : 
            children
        }
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }
