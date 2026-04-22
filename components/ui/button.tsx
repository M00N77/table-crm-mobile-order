import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  default: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] disabled:bg-[var(--primary-disabled)]",
  secondary:
    "bg-[var(--mint-soft)] text-[var(--mint-text)] hover:bg-[var(--mint-accent)] disabled:bg-[var(--mint-soft)]/80",
  outline:
    "border bg-transparent text-[var(--text)] hover:bg-[var(--mint-soft)]",
  ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--mint-soft)] hover:text-[var(--text)]",
  destructive: "bg-[var(--primary-hover)] text-white hover:bg-[var(--primary)]",
};

const buttonSizes = {
  default: "h-8 px-3 py-1.5 text-[12px]",
  sm: "h-8 px-2.5 text-[12px]",
  lg: "h-9 px-4 text-[12px]",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
        <button
          className={cn(
            "focus-visible-ring inline-flex items-center justify-center rounded-lg border border-transparent font-medium transition disabled:pointer-events-none",
            buttonVariants[variant],
            buttonSizes[size],
            className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
