import type React from "react"
import { cn } from "cn"

export function Form({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form
      className={cn(
        "flex flex-col gap-3",
        className
      )}
      {...props}
    />
  )
}
