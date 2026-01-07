import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700 font-bold",
        journal:
          "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-orange-700 text-white shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700 font-bold",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/40 hover:from-red-600 hover:to-red-700 hover:scale-105 active:scale-95 focus-visible:ring-red-500/30 font-bold",
        outline:
          "border-2 border-amber-500/50 bg-white/50 text-amber-800 shadow-md hover:bg-amber-50 hover:border-amber-500 hover:text-amber-900 backdrop-blur-md hover:shadow-lg hover:shadow-amber-500/20 hover:scale-105 active:scale-95 font-semibold",
        secondary:
          "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 shadow-md hover:shadow-lg hover:from-amber-200 hover:to-orange-200 hover:scale-105 active:scale-95 font-semibold",
        ghost:
          "hover:bg-amber-100/80 hover:text-amber-900 hover:scale-105 active:scale-95 font-medium",
        link: "text-amber-700 underline-offset-4 hover:underline hover:text-orange-600 font-semibold",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-4 text-sm",
        sm: "h-9 rounded-full gap-1.5 px-4 has-[>svg]:px-3 text-xs",
        lg: "h-14 rounded-full px-8 has-[>svg]:px-6 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
