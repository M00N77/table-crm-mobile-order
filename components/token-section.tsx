import { PlugZap } from "lucide-react";

import { FieldGroup } from "@/components/field-group";
import { FieldRow } from "@/components/field-row";
import { SectionCard } from "@/components/section-card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type TokenSectionProps = {
  token: string;
  onTokenChange: (value: string) => void;
  onConnect: () => void;
  isLoading: boolean;
};

export function TokenSection({ token, onTokenChange, onConnect, isLoading }: TokenSectionProps) {
  return (
    <SectionCard as="section">
      <CardHeader>
        <SectionHeader title="1. Подключение кассы" description="Введите токен и загрузите справочники" icon={PlugZap} />
      </CardHeader>
      <CardContent className="space-y-3">
        <FieldGroup label="Token" htmlFor="cash-token">
          <FieldRow>
            <Input
              id="cash-token"
              value={token}
              onChange={(event) => onTokenChange(event.target.value)}
              placeholder="Введите token кассы"
            />
          </FieldRow>
        </FieldGroup>
        <Button className="w-full" onClick={onConnect} disabled={isLoading}>
          Подключить
        </Button>
      </CardContent>
    </SectionCard>
  );
}
