import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SectionCardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section";
};

export function SectionCard({ as: Tag = "section", className, ...props }: SectionCardProps) {
  return (
    <Tag
      className={cn("mb-3 rounded-xl border bg-[var(--card)] shadow-[var(--shadow-soft)]", className)}
      style={{ borderColor: "var(--border)" }}
      {...props}
    />
  );
}
