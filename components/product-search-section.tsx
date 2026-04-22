import { PackagePlus, Search } from "lucide-react";

import { FieldGroup } from "@/components/field-group";
import { FieldRow } from "@/components/field-row";
import { SectionCard } from "@/components/section-card";
import { SectionHeader } from "@/components/section-header";
import type { ProductOption } from "@/types/tablecrm";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/utils";

type ProductSearchSectionProps = {
  disabled?: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  products: ProductOption[];
  onAddProduct: (product: ProductOption) => void;
  error?: string | null;
  searched: boolean;
};

export function ProductSearchSection({ disabled, query, onQueryChange, onSearch, isLoading, products, onAddProduct, error, searched }: ProductSearchSectionProps) {
  return (
    <SectionCard as="section">
      <CardHeader>
        <SectionHeader title="4. Товары" description="Поиск и добавление номенклатуры" icon={PackagePlus} />
      </CardHeader>
      <CardContent className="space-y-3">
        <FieldGroup label="Поиск" htmlFor="product-search">
          <FieldRow>
            <Input
              id="product-search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Введите название товара"
              disabled={disabled}
            />
            <Button aria-label="Найти товар" size="sm" variant="secondary" onClick={onSearch} disabled={disabled || isLoading || query.trim().length < 2}>
              <Search className="h-3.5 w-3.5" />
            </Button>
          </FieldRow>
        </FieldGroup>

        <div className="min-h-36 rounded-lg border bg-[var(--card)] p-2" style={{ borderColor: "var(--border)" }}>
          {products.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center text-[12px] text-[var(--text-secondary)]">
              {searched ? "Товары не найдены" : "Товары не найдены"}
            </div>
          ) : (
            <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-2 rounded-lg border px-2.5 py-2" style={{ borderColor: "var(--border)" }}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[var(--text)]">{product.name}</p>
                    <p className="text-[12px] text-[var(--text-secondary)]">
                      {formatMoney(product.price)} ₽{product.unitName ? ` · ${product.unitName}` : ""}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => onAddProduct(product)} disabled={disabled}>
                    Добавить
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error ? <p className="text-[12px] text-[var(--primary)]">{error}</p> : null}
      </CardContent>
    </SectionCard>
  );
}
