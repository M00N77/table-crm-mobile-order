import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "focus-visible-ring flex min-h-[88px] w-full rounded-lg border bg-[var(--card)] px-3 py-2 text-[12px] text-[var(--text)] placeholder:text-[var(--placeholder)] disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        style={{ borderColor: "var(--border)", boxShadow: "0 1px 0 rgba(31,39,47,0.02)" }}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
