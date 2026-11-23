import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SIZE_OPTIONS } from "@/features/admin/products/constants";
import type { ProductCategory } from "@/features/admin/products/types";
import {
  BRAND_OPTIONS,
  getSwatchColor,
  type CustomerProductFilters,
  type FacetKey,
} from "@/features/customer/products/product-list.shared";

const panelWrapClass = "space-y-6 overflow-y-auto px-4 py-2 lg:px-0 lg:py-0";

const panelHeaderClass = "flex items-center justify-between gap-3";

const titleClass = "text-base font-bold text-black";

const clearButtonClass = "rounded-lg px-2 text-xs text-[#997300] hover:bg-[#D4AF37]/10 font-bold";

const sectionClass = "space-y-3";

const sectionTitleClass = "text-xs font-bold uppercase tracking-wider text-[#997300]";

const stackedOptionsClass = "space-y-1";

const fullWidthButtonClass =
  "w-full justify-start rounded-xl text-xs font-medium transition-colors";

const colorsWrapClass = "flex flex-wrap gap-3";

const colorButtonBaseClass =
  "flex flex-col items-center gap-2 text-xs text-zinc-600";

const colorButtonActiveClass = "text-black font-bold";

const colorSwatchBaseClass = "h-8 w-8 rounded-full border";

const colorSwatchActiveClass = "border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-110";

const colorSwatchInactiveClass = "border-zinc-300 hover:border-[#D4AF37]";

const helperTextClass = "text-xs text-muted-foreground";

const sizesWrapClass = "flex flex-wrap gap-2";

const sizeButtonClass = "min-w-12 rounded-xl text-xs font-semibold border transition-all";

type CustomerFiltersPanelProps = {
  categories: ProductCategory[];
  filters: CustomerProductFilters;
  availableColors: string[];
  hasActiveFilters: boolean;
  onToggleFacet: (key: FacetKey, value: string) => void;
  onClearFilters: () => void;
};

function CustomerFiltersPanel({
  categories,
  filters,
  availableColors,
  hasActiveFilters,
  onClearFilters,
  onToggleFacet,
}: CustomerFiltersPanelProps) {
  return (
    <div className={panelWrapClass}>
      <div className={panelHeaderClass}>
        <div>
          <h2 className={titleClass}>Filters</h2>
        </div>
        {hasActiveFilters ? (
          <Button
            variant={"ghost"}
            className={clearButtonClass}
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        ) : null}
      </div>

      <Separator className="bg-[#D4AF37]/30" />

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Categories</h3>

        <div className={stackedOptionsClass}>
          {categories.map((item) => {
            const isActive = filters.category === item._id;

            return (
              <Button
                key={item._id}
                type="button"
                variant={isActive ? "default" : "ghost"}
                className={`${fullWidthButtonClass} ${
                  isActive
                    ? "bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158]"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-black font-medium"
                }`}
                onClick={() => onToggleFacet("category", item._id)}
              >
                {item.name}
              </Button>
            );
          })}
        </div>
      </section>

      <Separator className="bg-[#D4AF37]/30" />

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Brands</h3>

        <div className={stackedOptionsClass}>
          {BRAND_OPTIONS.map((brand) => {
            const isActive = filters.brand === brand;

            return (
              <Button
                key={brand}
                type="button"
                variant={isActive ? "default" : "ghost"}
                className={`${fullWidthButtonClass} ${
                  isActive
                    ? "bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158]"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-black font-medium"
                }`}
                onClick={() => onToggleFacet("brand", brand)}
              >
                {brand}
              </Button>
            );
          })}
        </div>
      </section>

      <Separator className="bg-[#D4AF37]/30" />

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Colors</h3>

        {availableColors.length ? (
          <div className={colorsWrapClass}>
            {availableColors.map((color) => {
              const isActive = filters.color === color;

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onToggleFacet("color", color)}
                  className={`${colorButtonBaseClass} ${
                    isActive ? colorButtonActiveClass : ""
                  }`}
                >
                  <span
                    className={`${colorSwatchBaseClass} ${
                      isActive
                        ? colorSwatchActiveClass
                        : colorSwatchInactiveClass
                    }`}
                    style={{ backgroundColor: getSwatchColor(color) }}
                  />
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className={helperTextClass}>No colors available</p>
        )}
      </section>

      <Separator className="bg-[#D4AF37]/30" />

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Sizes</h3>

        <div className={sizesWrapClass}>
          {SIZE_OPTIONS.map((size) => {
            const isActive = filters.size === size;

            return (
              <Button
                key={size}
                type="button"
                variant={isActive ? "default" : "outline"}
                className={`${sizeButtonClass} ${
                  isActive
                    ? "bg-[#D4AF37] text-black font-semibold border-[#D4AF37] hover:bg-[#e5c158]"
                    : "border-[#D4AF37]/50 bg-white text-black hover:bg-[#D4AF37]/10"
                }`}
                onClick={() => onToggleFacet("size", size)}
              >
                {size}
              </Button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default CustomerFiltersPanel;
