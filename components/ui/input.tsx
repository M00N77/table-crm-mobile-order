import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "focus-visible-ring flex h-8.5 w-full rounded-lg border bg-[var(--card)] px-3 py-1.5 text-[12px] text-[var(--text)] placeholder:text-[var(--placeholder)] disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        style={{ borderColor: "var(--border)", boxShadow: "0 1px 0 rgba(31,39,47,0.02)" }}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
