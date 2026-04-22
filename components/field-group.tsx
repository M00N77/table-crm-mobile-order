import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FieldGroupProps = {
  label: string;
  htmlFor?: string;
  labelId?: string;
  children: ReactNode;
  className?: string;
};

export function FieldGroup({ label, htmlFor, labelId, children, className }: FieldGroupProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label id={labelId} htmlFor={htmlFor} className="block text-[12px] text-[var(--text-secondary)]">
        {label}
      </label>
      {children}
    </div>
  );
}
