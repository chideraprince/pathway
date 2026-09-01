import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "outline-light" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm",
  secondary: "bg-ink-900 text-white hover:bg-ink-800 active:bg-black shadow-sm",
  outline: "border border-ink-300 text-ink-800 bg-white hover:bg-ink-50 active:bg-ink-100",
  // For use on a dark surface (e.g. a dark CTA banner) — a plain "outline"
  // + className override collides on bg/text utilities unpredictably,
  // so this gets its own variant rather than being hacked in per call site.
  "outline-light": "border border-white/25 text-white bg-transparent hover:bg-white/10 active:bg-white/15",
  ghost: "text-ink-700 hover:bg-ink-100 active:bg-ink-200",
  danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5 rounded-lg gap-1.5",
  md: "text-sm px-4 py-2.5 rounded-lg gap-2",
  lg: "text-base px-5 py-3 rounded-xl gap-2",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className: string = "") {
  return cn(
    "inline-flex items-center justify-center font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-ring whitespace-nowrap",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(buttonClasses(variant, size), className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...rest }, ref) => (
    <Link ref={ref} className={cn(buttonClasses(variant, size), className)} {...rest}>
      {children}
    </Link>
  )
);
LinkButton.displayName = "LinkButton";
