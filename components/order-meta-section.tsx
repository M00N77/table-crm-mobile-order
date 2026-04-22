import type { CatalogOption, OrderMeta } from "@/types/tablecrm";

import { FieldGroup } from "@/components/field-group";
import { SectionCard } from "@/components/section-card";
import { SectionHeader } from "@/components/section-header";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OrderMetaSectionProps = {
  disabled?: boolean;
  meta: OrderMeta;
  organizations: CatalogOption[];
  warehouses: CatalogOption[];
  payboxes: CatalogOption[];
  priceTypes: CatalogOption[];
  onChange: (nextMeta: OrderMeta) => void;
};

type MetaFieldProps = {
  label: string;
  value: number | undefined;
  placeholder: string;
  options: CatalogOption[];
  onValueChange: (value: number | undefined) => void;
  disabled?: boolean;
  id: string;
  labelId: string;
};

function MetaField({ label, value, placeholder, options, onValueChange, disabled, id, labelId }: MetaFieldProps) {
  return (
    <FieldGroup label={label} labelId={labelId}>
      <Select value={value ? String(value) : undefined} onValueChange={(nextValue) => onValueChange(nextValue ? Number(nextValue) : undefined)} disabled={disabled}>
        <SelectTrigger id={id} aria-labelledby={labelId}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={String(option.id)}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldGroup>
  );
}

export function OrderMetaSection({ disabled, meta, organizations, warehouses, payboxes, priceTypes, onChange }: OrderMetaSectionProps) {
  return (
    <SectionCard as="section">
      <CardHeader>
        <SectionHeader title="3. Параметры продажи" description="Счёт, организация, склад и тип цены" />
      </CardHeader>
      <CardContent className="space-y-3">
        <MetaField
          id="organization"
          labelId="organization-label"
          label="Организация"
          placeholder="Выберите организацию"
          value={meta.organizationId}
          options={organizations}
          onValueChange={(organizationId) => onChange({ ...meta, organizationId })}
          disabled={disabled}
        />
        <MetaField
          id="paybox"
          labelId="paybox-label"
          label="Счёт"
          placeholder="Выберите счёт"
          value={meta.payboxId}
          options={payboxes}
          onValueChange={(payboxId) => onChange({ ...meta, payboxId })}
          disabled={disabled}
        />
        <MetaField
          id="warehouse"
          labelId="warehouse-label"
          label="Склад"
          placeholder="Выберите склад"
          value={meta.warehouseId}
          options={warehouses}
          onValueChange={(warehouseId) => onChange({ ...meta, warehouseId })}
          disabled={disabled}
        />
        <MetaField
          id="price-type"
          labelId="price-type-label"
          label="Тип цены"
          placeholder="Выберите тип цены"
          value={meta.priceTypeId}
          options={priceTypes}
          onValueChange={(priceTypeId) => onChange({ ...meta, priceTypeId })}
          disabled={disabled || priceTypes.length === 0}
        />
      </CardContent>
    </SectionCard>
  );
}
