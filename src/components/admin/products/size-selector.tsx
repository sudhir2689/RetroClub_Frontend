import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SIZE_OPTIONS } from "@/features/admin/products/constants";

const wrapperClass = "space-y-3";

const headerClass = "space-y-1";

const titleClass = "text-xs font-semibold uppercase tracking-wider text-[#997300]";

const gridClass = "grid grid-cols-3 sm:grid-cols-5 gap-2.5";

const sizeButtonClass = "h-11 rounded-xl font-semibold transition-all";

type SizeSelectorProps = {
  selectedSizes: string[];
  sizeStock?: Record<string, number | "">;
  onToggle: (size: string) => void;
  onSizeStockChange?: (size: string, val: string) => void;
};

export function SizeSelector({
  onToggle,
  selectedSizes,
  sizeStock,
  onSizeStockChange,
}: SizeSelectorProps) {
  return (
    <div className={wrapperClass}>
      <div className={headerClass}>
        <div className="flex items-center justify-between">
          <h3 className={titleClass}>Available Sizes & Stock</h3>
          <span className="text-[11px] text-zinc-500 font-medium">
            (Qty per size optional)
          </span>
        </div>
      </div>
      <div className={gridClass}>
        {SIZE_OPTIONS.map((sizeItem) => {
          const active = selectedSizes.includes(sizeItem);
          const currentQty = sizeStock?.[sizeItem];

          return (
            <div key={sizeItem} className="flex flex-col gap-1.5 items-center">
              <Button
                className={`w-full ${sizeButtonClass} ${
                  active
                    ? "bg-[#D4AF37] text-black border border-[#D4AF37] hover:bg-[#e5c158]"
                    : "border border-[#D4AF37] bg-white text-black hover:bg-[#D4AF37]/10"
                }`}
                onClick={() => onToggle(sizeItem)}
                type="button"
                variant={active ? "default" : "outline"}
              >
                {sizeItem}
              </Button>

              {active ? (
                <div className="w-full">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Qty"
                    value={currentQty ?? ""}
                    onChange={(e) =>
                      onSizeStockChange?.(sizeItem, e.target.value)
                    }
                    className="h-8 text-center text-xs font-semibold rounded-lg border border-[#D4AF37]/60 bg-white text-black focus:border-[#D4AF37] p-1 shadow-2xs"
                    title={`Available stock for size ${sizeItem}`}
                  />
                </div>
              ) : (
                <div className="h-8 flex items-center justify-center text-[11px] text-zinc-400">
                  —
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-zinc-500 italic">
        💡 Optional: Enter stock for each size. Total stock auto-calculates from size quantities unless manually overridden.
      </p>
    </div>
  );
}
