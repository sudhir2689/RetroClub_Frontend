import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Promo, PromoFormValues } from "@/features/admin/promo/types";
import { useEffect, useState } from "react";

const dialogContentClass =
  "max-h-[92vh] w-[95vw] sm:max-w-2xl overflow-y-auto rounded-2xl border border-[#D4AF37]/50 bg-black text-white shadow-2xl p-6";

const layoutClass = "grid gap-5 mt-4";

const firstRowClass = "grid gap-4 sm:grid-cols-2";

const secondRowClass = "grid gap-4 sm:grid-cols-2";

const thirdRowClass = "grid gap-4 sm:grid-cols-2";

const fieldWrapClass = "space-y-1.5";

const inputClass =
  "rounded-xl border border-[#D4AF37]/40 bg-black/60 text-white placeholder:text-muted-foreground focus:border-[#D4AF37]";

const errorTextClass = "text-xs text-red-400";

const footerClass = "flex justify-end gap-3 pt-4 border-t border-[#D4AF37]/20";

const outlineButtonClass = "rounded-xl border border-[#D4AF37]/40 text-white hover:bg-[#D4AF37]/10";

const primaryButtonClass =
  "rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] transition-colors shadow-md shadow-[#D4AF37]/20";

type PromoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promo: Promo | null;
  saving: boolean;
  onSaved: (values: PromoFormValues) => Promise<void>;
};

const defaultForm: PromoFormValues = {
  code: "",
  percentage: "",
  count: "",
  minimumOrderValue: "",
  startsAt: "",
  endsAt: "",
};

function toDateTimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function PromoDialog({
  open,
  onOpenChange,
  promo,
  saving,
  onSaved,
}: PromoDialogProps) {
  const [form, setForm] = useState<PromoFormValues>(defaultForm);
  const isEditMode = !!promo;

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      return;
    }

    if (promo) {
      setForm({
        code: promo.code,
        percentage: String(promo.percentage),
        count: String(promo.count),
        minimumOrderValue: String(promo.minimumOrderValue),
        startsAt: toDateTimeLocal(promo.startsAt),
        endsAt: toDateTimeLocal(promo.endsAt),
      });

      return;
    }

    setForm(defaultForm);
  }, [open, promo]);

  function updateField<K extends keyof PromoFormValues>(
    key: K,
    value: PromoFormValues[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit() {
    await onSaved(form);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader className="border-b border-[#D4AF37]/20 pb-3">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
            {isEditMode ? "Update Promo Code" : "Create New Promo Code"}
          </DialogTitle>
        </DialogHeader>

        <div className={layoutClass}>
          <div className={firstRowClass}>
            <div className={fieldWrapClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Promo Code
              </Label>
              <Input
                value={form.code}
                onChange={(event) =>
                  updateField("code", event.target.value.toUpperCase())
                }
                placeholder="e.g. RETRO25"
                className={inputClass}
              />
            </div>

            <div className={fieldWrapClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Discount Percentage (%)
              </Label>
              <Input
                value={form.percentage}
                onChange={(event) =>
                  updateField("percentage", event.target.value)
                }
                type="number"
                min="1"
                max="100"
                placeholder="10"
                className={inputClass}
              />
            </div>
          </div>

          <div className={secondRowClass}>
            <div className={fieldWrapClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Usage Count Limit
              </Label>
              <Input
                value={form.count}
                onChange={(event) => updateField("count", event.target.value)}
                type="number"
                min="1"
                placeholder="100"
                className={inputClass}
              />
            </div>

            <div className={fieldWrapClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Minimum Order Value (₹)
              </Label>
              <Input
                value={form.minimumOrderValue}
                onChange={(event) =>
                  updateField("minimumOrderValue", event.target.value)
                }
                type="number"
                min="0"
                placeholder="500"
                className={inputClass}
              />
            </div>
          </div>

          <div className={thirdRowClass}>
            <div className={fieldWrapClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Valid From
              </Label>
              <Input
                value={form.startsAt}
                onChange={(event) =>
                  updateField("startsAt", event.target.value)
                }
                type="datetime-local"
                className={inputClass}
              />
            </div>

            <div className={fieldWrapClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Valid Till
              </Label>
              <Input
                value={form.endsAt}
                onChange={(event) => updateField("endsAt", event.target.value)}
                type="datetime-local"
                className={inputClass}
              />
            </div>
          </div>

          <div className={footerClass}>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={outlineButtonClass}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={saving}
              className={primaryButtonClass}
            >
              {saving
                ? "Saving..."
                : isEditMode
                  ? "Update Promo Code"
                  : "Create Promo Code"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PromoDialog;
