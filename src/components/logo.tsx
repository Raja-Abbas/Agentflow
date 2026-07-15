import * as React from "react"
import { Bot } from "lucide-react"

import { cn } from "@/lib/utils"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
}

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
}

const iconSizeClasses = {
  sm: 16,
  md: 20,
  lg: 24,
}

function Logo({ className, size = "md", ...props }: LogoProps) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <div className="flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500">
        <Bot className={cn("text-white", sizeClasses[size])} size={iconSizeClasses[size]} />
      </div>
      <span
        className={cn(
          "font-bold tracking-tight text-slate-900 dark:text-slate-50",
          textSizeClasses[size]
        )}
      >
        AgentFlow
      </span>
    </div>
  )
}

export { Logo }
export type { LogoProps }
