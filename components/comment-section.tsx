import { FieldGroup } from "@/components/field-group";
import { SectionCard } from "@/components/section-card";
import { SectionHeader } from "@/components/section-header";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type CommentSectionProps = {
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
};

export function CommentSection({ disabled, value, onChange }: CommentSectionProps) {
  return (
    <SectionCard as="section">
      <CardHeader>
        <SectionHeader title="Комментарий" />
      </CardHeader>
      <CardContent>
        <FieldGroup label="Комментарий" htmlFor="sale-comment" className="space-y-0">
          <Textarea
            id="sale-comment"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Комментарий к заказу (необязательно)"
            disabled={disabled}
          />
        </FieldGroup>
      </CardContent>
    </SectionCard>
  );
}
