import { getSwatchColor } from "@/features/customer/products/product-list.shared";
import type { ProductSize } from "@/features/customer/products/types";

const wrapClass = "flex flex-wrap gap-2";

const baseButtonClass =
  "inline-flex items-center justify-center gap-2 border px-4 py-2 text-sm font-medium transition";

const activeButtonClass =
  "border-[#D4AF37] bg-[#D4AF37]/20 text-black font-bold ring-2 ring-[#D4AF37]/40 shadow-xs";

const inactiveButtonClass =
  "border-[#D4AF37]/40 bg-white text-black hover:border-[#D4AF37] hover:bg-zinc-50";

const sizeButtonClass = "min-w-12 rounded-lg";

const colorButtonClass = "rounded-lg";

const swatchClass = "h-4 w-4 rounded-sm border border-zinc-300";

type CustomerProductOptionsGroupProps = {
  values: string[];
  selectedValue: string;
  onSelect: (value: ProductSize) => void;
  variant: "color" | "size";
};

function CustomerProductOptionsGroup({
  values,
  variant,
  selectedValue,
  onSelect,
}: CustomerProductOptionsGroupProps) {
  return (
    <div role="group" className={wrapClass}>
      {values.map((value) => {
        const isActive = selectedValue === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value as ProductSize)}
            className={`${baseButtonClass} ${
              variant === "color" ? colorButtonClass : sizeButtonClass
            } ${isActive ? activeButtonClass : inactiveButtonClass}`}
          >
            {variant === "color" ? (
              <>
                <span
                  className={swatchClass}
                  style={{ backgroundColor: getSwatchColor(value) }}
                />
              </>
            ) : (
              value
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CustomerProductOptionsGroup;
