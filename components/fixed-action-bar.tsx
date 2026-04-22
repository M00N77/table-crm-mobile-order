import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

type FixedActionBarProps = {
  total: number;
  disabled: boolean;
  isLoading: boolean;
  onCreate: () => void;
  onCreateAndProcess: () => void;
};

export function FixedActionBar({ total, disabled, isLoading, onCreate, onCreateAndProcess }: FixedActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-[var(--bg)]/95 backdrop-blur-sm" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto w-full max-w-md px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3">
        <div className="space-y-2 rounded-t-xl border border-b-0 bg-[var(--card)] px-4 pt-3 shadow-[0_-8px_24px_rgba(112,87,61,0.06)]" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] text-[var(--text-secondary)]">Итого</span>
            <span className="text-lg font-semibold text-[var(--text)]">{formatPrice(total)}</span>
          </div>
          <Button className="w-full" onClick={onCreate} disabled={disabled || isLoading}>
            Создать продажу
          </Button>
          <Button className="w-full" variant="secondary" onClick={onCreateAndProcess} disabled={disabled || isLoading}>
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            Создать и провести
          </Button>
        </div>
      </div>
    </div>
  );
}
