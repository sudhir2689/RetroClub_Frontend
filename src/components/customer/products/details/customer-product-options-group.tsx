import { getSwatchColor } from "@/features/customer/products/product-list.shared";
import type { ProductSize } from "@/features/customer/products/types";

const wrapClass = "flex flex-wrap gap-2";

const baseButtonClass =
  "inline-flex items-center justify-center gap-2 border px-4 py-2 text-sm font-medium transition";

const activeButtonClass =
  "border-amber-400 bg-amber-400/15 text-amber-300 ring-2 ring-amber-400/30 shadow-[0_0_12px_rgba(212,175,55,0.2)]";

const inactiveButtonClass =
  "border-amber-400/40 bg-zinc-950 text-foreground hover:border-amber-400 hover:bg-zinc-900";

const sizeButtonClass = "min-w-12 rounded-lg";

const colorButtonClass = "rounded-lg";

const swatchClass = "h-4 w-4 rounded-sm border border-amber-400/40";

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
