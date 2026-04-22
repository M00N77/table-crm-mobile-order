import type { LucideIcon } from "lucide-react";

import { CardDescription, CardTitle } from "@/components/ui/card";

type SectionHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
};

export function SectionHeader({ title, description, icon: Icon }: SectionHeaderProps) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-[17px] w-[17px] shrink-0 text-[var(--mint-text)]" /> : null}
        <CardTitle>{title}</CardTitle>
      </div>
      {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
    </div>
  );
}
