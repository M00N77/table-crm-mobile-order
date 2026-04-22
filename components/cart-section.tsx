import { BadgePercent, ShoppingCart, Trash2 } from "lucide-react";

import { SectionCard } from "@/components/section-card";
import { SectionHeader } from "@/components/section-header";
import type { CartItem } from "@/types/tablecrm";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/utils";

type CartSectionProps = {
  disabled?: boolean;
  cart: CartItem[];
  onUpdateItem: (itemId: string, patch: Partial<CartItem>) => void;
  onRemoveItem: (itemId: string) => void;
};

export function CartSection({ disabled, cart, onUpdateItem, onRemoveItem }: CartSectionProps) {
  return (
    <SectionCard as="section">
      <CardHeader>
        <SectionHeader title="Корзина" description="Количество, цена и сумма по позициям" icon={ShoppingCart} />
      </CardHeader>
      <CardContent className="space-y-3">
        {cart.length === 0 ? <p className="text-[12px] text-[var(--text-secondary)]">Добавьте хотя бы один товар</p> : null}

        {cart.map((item) => {
          const lineTotal = Math.max(0, item.price * item.quantity - item.discount);

          return (
            <div key={item.id} className="space-y-2 rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--text)]">{item.name}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">ID {item.nomenclatureId}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onRemoveItem(item.id)} disabled={disabled}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <label className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                  <span>Цена</span>
                  <Input
                    inputMode="decimal"
                    value={String(item.price)}
                    onChange={(event) => onUpdateItem(item.id, { price: Number(event.target.value) || 0 })}
                    disabled={disabled}
                  />
                </label>
                <label className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                  <span>Количество</span>
                  <Input
                    inputMode="decimal"
                    value={String(item.quantity)}
                    onChange={(event) => onUpdateItem(item.id, { quantity: Number(event.target.value) || 0 })}
                    disabled={disabled}
                  />
                </label>
                <label className="space-y-1 text-[11px] text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1">
                    <BadgePercent className="h-3.5 w-3.5" />
                    Скидка
                  </span>
                  <Input
                    inputMode="decimal"
                    value={String(item.discount)}
                    onChange={(event) => onUpdateItem(item.id, { discount: Number(event.target.value) || 0 })}
                    disabled={disabled}
                  />
                </label>
              </div>

              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[var(--text-secondary)]">Сумма</span>
                <span className="font-medium text-[var(--text)]">{formatMoney(lineTotal)} ₽</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </SectionCard>
  );
}
