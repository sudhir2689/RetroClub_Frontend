import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

const wrapClass =
  "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";

const searchWrapClass = "relative w-full max-w-sm";

const searchIconClass =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#997300]";

const searchInputClass =
  "rounded-xl border border-[#D4AF37]/50 bg-white pl-9 text-black placeholder:text-zinc-400 focus:border-[#D4AF37]";

const addButtonClass =
  "rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] transition-colors shadow-md shadow-[#D4AF37]/20";

const addButtonIconClass = "mr-2 h-4 w-4";

type PromoToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onAddPromo: () => void;
};

function PromoToolbar({
  search,
  onSearchChange,
  onAddPromo,
}: PromoToolbarProps) {
  return (
    <div className={wrapClass}>
      <div className={searchWrapClass}>
        <Search className={searchIconClass} />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search promo codes..."
          className={searchInputClass}
        />
      </div>

      <Button onClick={onAddPromo} className={addButtonClass}>
        <Plus className={addButtonIconClass} />
        Add Promo Code
      </Button>
    </div>
  );
}

export default PromoToolbar;
