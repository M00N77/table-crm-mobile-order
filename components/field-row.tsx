import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FieldRowProps = {
  children: ReactNode;
  className?: string;
};

export function FieldRow({ children, className }: FieldRowProps) {
  return <div className={cn("flex items-center gap-2", className)}>{children}</div>;
}
