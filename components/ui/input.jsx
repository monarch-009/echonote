import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-amber-800 placeholder:text-amber-500/60 selection:bg-amber-200 selection:text-amber-900 border-amber-200/60 flex h-11 w-full min-w-0 rounded-xl border bg-white/80 px-4 py-2 text-base text-amber-900 shadow-sm transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-amber-400 focus-visible:ring-amber-400/30 focus-visible:ring-[3px]",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500",
        className
      )}
      {...props} />
  );
}

export { Input }
