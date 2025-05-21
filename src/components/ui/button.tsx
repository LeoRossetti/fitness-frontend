import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 disabled:opacity-50"
    
    const variants = {
      default: "bg-main text-white hover:bg-main-dark shadow-sm hover:shadow-md active:scale-[0.98]",
      outline: "border-2 border-main text-main bg-white hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-md active:scale-[0.98]"
    }

    const sizes = {
      default: "h-10 px-6 py-2 text-sm",
      sm: "h-8 px-4 text-xs",
      lg: "h-12 px-8 text-base"
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
