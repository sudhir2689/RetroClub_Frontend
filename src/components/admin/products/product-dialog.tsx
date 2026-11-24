import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BRANDS } from "@/features/admin/products/constants";
import type {
  Category,
  Product,
  ProductStatus,
} from "@/features/admin/products/types";
import { ColorPicker } from "./color-picker";
import { SizeSelector } from "./size-selector";
import { ImagePicker } from "./image-picker";
import { Button } from "@/components/ui/button";
import { useProductForm } from "@/features/admin/products/use-product-form";

type ProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  product: Product | null;
  onSaved: () => Promise<void>;
};

const dialogContentClass =
  "max-h-[92vh] w-[95vw] sm:max-w-4xl overflow-y-auto rounded-2xl border border-[#D4AF37] bg-white text-black shadow-2xl p-6";

const contentWrapClass = "grid gap-6 mt-4";

const twoColumnGridClass = "grid gap-4 sm:grid-cols-2";

const threeColumnGridClass = "grid gap-4 sm:grid-cols-3";

const fieldGroupClass = "space-y-2";

const sectionGridClass = "grid gap-6 sm:grid-cols-2";

const statusGroupClass =
  "flex gap-6 rounded-xl border border-[#D4AF37]/40 bg-zinc-50 px-4 py-3 text-black";

const statusItemClass = "flex items-center space-x-2";

const actionsRowClass = "flex justify-end gap-3 pt-4 border-t border-[#D4AF37]/20";

const inputClass =
  "rounded-xl border border-[#D4AF37]/50 bg-white text-black placeholder:text-zinc-400 focus:border-[#D4AF37]";

export function ProductDialog({
  open,
  onOpenChange,
  categories,
  product,
  onSaved,
}: ProductDialogProps) {
  const {
    form,
    saving,
    isEditMode,
    updateField,
    toggleSize,
    updateSizeStock,
    addColor,
    removeColor,
    addFiles,
    submit,
    removeExistingImage,
    changeCoverImage,
  } = useProductForm({
    open,
    onClose: () => onOpenChange(false),
    onSaved,
    product,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader className="border-b border-[#D4AF37]/20 pb-4">
          <DialogTitle className="text-xl font-bold text-black flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />
            {isEditMode ? "Update Product" : "Create New Product / Clothes"}
          </DialogTitle>
        </DialogHeader>
        <div className={contentWrapClass}>
          <div className={twoColumnGridClass}>
            <div className={fieldGroupClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Title</Label>
              <Input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Product title (e.g. Classic Denim Jacket)"
                className={inputClass}
              />
            </div>

            <div className={fieldGroupClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Brand</Label>
              <Select
                value={form.brand}
                onValueChange={(val) => updateField("brand", val)}
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>

                <SelectContent className="border border-[#D4AF37]/40 bg-white text-black">
                  {BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className={fieldGroupClass}>
            <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Description</Label>
            <Textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={4}
              placeholder="Detailed description of the product or clothes..."
              className={inputClass}
            />
          </div>

          <div className={twoColumnGridClass}>
            <div className={fieldGroupClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Category</Label>
              <Select
                value={form.category}
                onValueChange={(val) => updateField("category", val)}
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="border border-[#D4AF37]/40 bg-white text-black">
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={fieldGroupClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Status</Label>
              <RadioGroup
                value={form.status}
                onValueChange={(value) =>
                  updateField("status", value as ProductStatus)
                }
                className={statusGroupClass}
              >
                <div className={statusItemClass}>
                  <RadioGroupItem value="active" id="product-status-active" />
                  <Label htmlFor="product-status-active" className="cursor-pointer">Active</Label>
                </div>

                <div className={statusItemClass}>
                  <RadioGroupItem
                    value="inactive"
                    id="product-status-inactive"
                  />
                  <Label htmlFor="product-status-inactive" className="cursor-pointer">Inactive</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className={threeColumnGridClass}>
            <div className={fieldGroupClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Price (₹)</Label>
              <Input
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                type="number"
                min="0"
                placeholder="0"
                className={inputClass}
              />
            </div>

            <div className={fieldGroupClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Sale Percentage (%)</Label>
              <Input
                value={form.salePercentage}
                onChange={(e) => updateField("salePercentage", e.target.value)}
                type="number"
                min="0"
                max="100"
                placeholder="0"
                className={inputClass}
              />
            </div>

            <div className={fieldGroupClass}>
              <Label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Stock Quantity</Label>
              <Input
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                type="number"
                min="0"
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          <div className={sectionGridClass}>
            <ColorPicker
              colors={form.colors}
              onAdd={addColor}
              onRemove={removeColor}
            />

            <SizeSelector
              selectedSizes={form.sizes}
              sizeStock={form.sizeStock}
              onToggle={toggleSize}
              onSizeStockChange={updateSizeStock}
            />
          </div>

          <ImagePicker
            existingImages={form.existingImages}
            newFiles={form.newFiles}
            coverImagePublicId={form.coverImagePublicId}
            onFilesAdd={addFiles}
            onExistingRemove={removeExistingImage}
            onCoverImageChange={changeCoverImage}
          />

          <div className={actionsRowClass}>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-[#D4AF37] text-black hover:bg-zinc-100"
            >
              Cancel
            </Button>

            <Button
              onClick={submit}
              disabled={saving}
              className="rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] transition-colors shadow-md shadow-[#D4AF37]/20"
            >
              {saving
                ? "Saving Product..."
                : isEditMode
                  ? "Update Product"
                  : "Save & Publish Product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
