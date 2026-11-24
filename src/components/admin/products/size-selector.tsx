import { Button } from "@/components/ui/button";
import { SIZE_OPTIONS } from "@/features/admin/products/constants";

const wrapperClass = "space-y-3";

const headerClass = "space-y-1";

const titleClass = "text-xs font-semibold uppercase tracking-wider text-[#997300]";

const gridClass = "grid grid-cols-3 sm:grid-cols-5 gap-2";

const sizeButtonClass = "h-11 rounded-xl font-semibold transition-all";

type SizeSelectorProps = {
  selectedSizes: string[];
  onToggle: (size: string) => void;
};

export function SizeSelector({ onToggle, selectedSizes }: SizeSelectorProps) {
  return (
    <div className={wrapperClass}>
      <div className={headerClass}>
        <h3 className={titleClass}>Available Sizes</h3>
      </div>
      <div className={gridClass}>
        {SIZE_OPTIONS.map((sizeItem) => {
          const active = selectedSizes.includes(sizeItem);

          return (
            <Button
              className={`${sizeButtonClass} ${
                active
                  ? "bg-[#D4AF37] text-black border border-[#D4AF37] hover:bg-[#e5c158]"
                  : "border border-[#D4AF37] bg-white text-black hover:bg-[#D4AF37]/10"
              }`}
              onClick={() => onToggle(sizeItem)}
              key={sizeItem}
              type="button"
              variant={active ? "default" : "outline"}
            >
              {sizeItem}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
