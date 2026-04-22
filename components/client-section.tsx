import { CreditCard, Phone, Search } from "lucide-react";

import { FieldGroup } from "@/components/field-group";
import { FieldRow } from "@/components/field-row";
import { SectionCard } from "@/components/section-card";
import { SectionHeader } from "@/components/section-header";
import type { ClientOption } from "@/types/tablecrm";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ClientSectionProps = {
  disabled?: boolean;
  phone: string;
  onPhoneChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  clients: ClientOption[];
  selectedClientId?: number;
  onSelectClient: (client: ClientOption) => void;
  error?: string | null;
};

export function ClientSection({
  disabled,
  phone,
  onPhoneChange,
  onSearch,
  isLoading,
  clients,
  selectedClientId,
  onSelectClient,
  error,
}: ClientSectionProps) {
  const selectedClient = clients.find((client) => client.id === selectedClientId);

  return (
    <SectionCard as="section">
      <CardHeader>
        <SectionHeader title="2. Клиент" description="Поиск клиента по телефону" icon={Phone} />
      </CardHeader>
      <CardContent className="space-y-3">
        <FieldGroup label="Телефон" htmlFor="client-phone">
          <FieldRow>
            <Input
              id="client-phone"
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
              placeholder="+79990000000"
              disabled={disabled}
            />
            <Button aria-label="Найти клиента" size="sm" variant="secondary" onClick={onSearch} disabled={disabled || isLoading || phone.trim().length < 6}>
              <Search className="h-3.5 w-3.5" />
            </Button>
          </FieldRow>
        </FieldGroup>

        <FieldGroup label="Найденный клиент" labelId="found-client-label">
          <Select
            value={selectedClientId ? String(selectedClientId) : undefined}
            onValueChange={(value) => {
              const nextClient = clients.find((client) => client.id === Number(value));

              if (nextClient) {
                onSelectClient(nextClient);
              }
            }}
            disabled={disabled || clients.length === 0}
          >
            <SelectTrigger id="found-client" aria-labelledby="found-client-label">
              <SelectValue placeholder="Клиент не выбран" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={String(client.id)}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldGroup>

        {selectedClient?.loyaltyCardId ? (
          <p className="inline-flex items-center gap-1 text-[12px] text-[var(--mint-text)]">
            <CreditCard className="h-3.5 w-3.5" />
            Карта лояльности: #{selectedClient.loyaltyCardId}
          </p>
        ) : null}

        {error ? <p className="text-[12px] text-[var(--primary)]">{error}</p> : null}
      </CardContent>
    </SectionCard>
  );
}
