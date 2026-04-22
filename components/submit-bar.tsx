import { CheckCircle2, LoaderCircle, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

type SubmitBarProps = {
  total: number;
  disabled: boolean;
  isLoading: boolean;
  onCreate: () => void;
  onCreateAndProcess: () => void;
};

export function SubmitBar({ total, disabled, isLoading, onCreate, onCreateAndProcess }: SubmitBarProps) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3 px-4 pt-1">
      <div
        className="rounded-[28px] border px-4 py-3 shadow-[var(--shadow-soft)]"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            <ReceiptText className="h-[13px] w-[13px]" />
            Итого
          </p>
          <p className="mt-1 text-[24px] font-semibold leading-none text-[var(--text)]">{formatMoney(total)} ₽</p>
        </div>
      </div>
      <Button className="w-full" onClick={onCreate} disabled={disabled || isLoading}>
        {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
        Создать продажу
      </Button>
      <Button className="w-full" variant="secondary" onClick={onCreateAndProcess} disabled={disabled || isLoading}>
        {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
        Создать и провести
      </Button>
    </div>
  );
}
