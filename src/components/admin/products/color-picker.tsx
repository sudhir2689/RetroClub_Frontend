import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";

const wrapperClass = "space-y-3";

const headerClass = "space-y-1";

const titleClass = "text-xs font-semibold uppercase tracking-wider text-[#997300]";

const actionsRowClass = "flex flex-wrap items-center gap-3";

const colorInputClass = "h-11 w-16 rounded-xl border border-[#D4AF37]/50 bg-white p-1 cursor-pointer";

const colorsListClass = "flex flex-wrap gap-2";

const colorChipClass =
  "group inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:border-[#D4AF37] shadow-xs";

const colorDotClass = "h-3.5 w-3.5 rounded-full border border-zinc-300";

const removeIconClass =
  "h-3.5 w-3.5 text-zinc-400 group-hover:text-red-500";

type ColorPickerProps = {
  colors: string[];
  onAdd: (color: string) => void;
  onRemove: (color: string) => void;
};

export function ColorPicker({ colors, onAdd, onRemove }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState("#111111");

  return (
    <div className={wrapperClass}>
      <div className={headerClass}>
        <h3 className={titleClass}>Available Colors</h3>
      </div>

      <div className={actionsRowClass}>
        <Input
          value={selectedColor}
          onChange={(event) => setSelectedColor(event.target.value)}
          type="color"
          className={colorInputClass}
        />

        <Button
          onClick={() => onAdd(selectedColor)}
          type="button"
          variant="secondary"
          className="rounded-xl border border-[#D4AF37] bg-white text-black hover:bg-[#D4AF37]/10"
        >
          Add Color
        </Button>
      </div>

      <div className={colorsListClass}>
        {colors.map((color) => (
          <span key={color} className={colorChipClass}>
            <span
              className={colorDotClass}
              style={{ backgroundColor: color }}
            />
            <span>{color}</span>
            <button
              onClick={() => onRemove(color)}
              type="button"
              className="ml-1 cursor-pointer"
            >
              <X className={removeIconClass} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
