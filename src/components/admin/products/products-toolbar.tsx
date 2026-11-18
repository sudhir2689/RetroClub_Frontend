import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

const wrapperClass =
  "flex flex-col gap-3 md:flex-row md:items-center md:justify-between";

const searchWrapClass = "relative w-full md:w-80";

const searchIconClass =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D4AF37]";

const searchInputClass =
  "pl-9 rounded-xl border border-[#D4AF37]/40 bg-black/60 text-white placeholder:text-muted-foreground focus:border-[#D4AF37]";

const actionsWrapClass = "flex flex-col sm:flex-row items-stretch sm:items-center gap-3";

const addIconClass = "mr-2 h-4 w-4";

type ProductsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onManageCategories: () => void;
  onAddProduct: () => void;
};

export function ProductToolbar({
  search,
  onSearchChange,
  onManageCategories,
  onAddProduct,
}: ProductsToolbarProps) {
  return (
    <div className={wrapperClass}>
      <div className={searchWrapClass}>
        <Search className={searchIconClass} />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products or clothes..."
          className={searchInputClass}
        />
      </div>

      <div className={actionsWrapClass}>
        <Button
          onClick={onManageCategories}
          variant="outline"
          className="rounded-xl border border-[#D4AF37]/40 bg-black text-white hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] text-xs font-semibold"
        >
          Manage Categories
        </Button>
        <Button
          onClick={onAddProduct}
          className="rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] transition-colors shadow-md shadow-[#D4AF37]/20"
        >
          <Plus className={addIconClass} />
          Add Product / Clothes
        </Button>
      </div>
    </div>
  );
}
