import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Small building blocks that match the canvas design system ("Shad" bundle)
 * exactly: 36px buttons with a 0.8×radius corner, 20px pill badges, 32px
 * avatars. The phone screens keep using src/components/ui.
 */

type BtnVariant = "default" | "outline" | "secondary" | "ghost"
type BtnSize = "default" | "sm" | "lg" | "icon"

const btnBase =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[calc(var(--radius)*0.8)] border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer"

const btnVariant: Record<BtnVariant, string> = {
  default: "bg-primary text-primary-foreground",
  outline: "border-border bg-background text-foreground shadow-xs hover:bg-muted",
  secondary: "bg-secondary text-secondary-foreground",
  ghost: "text-foreground hover:bg-muted",
}

const btnSize: Record<BtnSize, string> = {
  default: "h-9 px-2.5",
  sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5",
  lg: "h-10 px-2.5",
  icon: "size-9",
}

export function btnClass(variant: BtnVariant = "default", size: BtnSize = "default", className?: string) {
  return cn(btnBase, btnVariant[variant], btnSize[size], className)
}

type BtnProps = { variant?: BtnVariant; size?: BtnSize; className?: string; children?: ReactNode }

/** A link styled as a button (the design's Shad.Button with href). */
export function LinkBtn({ variant, size, className, ...props }: BtnProps & ComponentProps<"a">) {
  return <a data-slot="button" className={btnClass(variant, size, className)} {...props} />
}

/** A real button (the design's Shad.Button without href). */
export function Btn({ variant, size, className, type = "button", ...props }: BtnProps & ComponentProps<"button">) {
  return <button data-slot="button" type={type} className={btnClass(variant, size, className)} {...props} />
}

export function Badge({
  variant = "secondary",
  className,
  ...props
}: { variant?: "secondary" | "outline" } & ComponentProps<"span">) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1 rounded-[calc(var(--radius)*2.6)] border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        variant === "secondary" ? "bg-secondary text-secondary-foreground" : "border-border text-foreground",
        className,
      )}
      {...props}
    />
  )
}

export function Avatar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      data-slot="avatar"
      className={cn("flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm text-muted-foreground", className)}
    >
      {children}
    </span>
  )
}

/** The design's Shad.Input: 36px, input border, xs shadow. */
export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-[calc(var(--radius)*0.8)] border border-input bg-transparent px-2.5 py-1 text-base shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    />
  )
}
