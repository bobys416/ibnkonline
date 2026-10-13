import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
      md: "text-sm px-4 py-2.5 gap-2 h-10",
      lg: "text-base px-6 py-3.5 gap-2.5 h-12",
    };

    const variantStyles = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md focus:ring-blue-500",
      secondary:
        "bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400",
      outline:
        "border border-slate-300 hover:border-slate-400 bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-slate-400",
      ghost:
        "bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md focus:ring-red-500",
      success:
        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md focus:ring-emerald-500",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
