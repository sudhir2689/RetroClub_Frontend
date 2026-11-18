import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  createAdminCategory,
  updateAdminCategory,
} from "@/features/admin/products/api";
import type { Category } from "@/features/admin/products/types";
import { Pencil, Tag } from "lucide-react";
import { useState } from "react";

const dialogContentClass =
  "sm:max-w-xl rounded-2xl border border-[#D4AF37]/50 bg-black text-white shadow-2xl p-6";

const contentWrap = "space-y-4 mt-2";

const formRow = "flex gap-3";

const categoriesList = "space-y-2 max-h-64 overflow-y-auto pr-1";

const categoryRow =
  "flex items-center justify-between rounded-xl border border-[#D4AF37]/30 bg-[#0d0d0d] px-4 py-3 hover:border-[#D4AF37]/60 transition-colors";

const categoryInfo = "flex items-center gap-2.5";

const categoryIcon = "h-4 w-4 text-[#D4AF37]";

const categoryName = "text-sm font-medium text-white";

const emptyStateClass =
  "rounded-xl border border-dashed border-[#D4AF37]/30 p-6 text-center text-sm text-muted-foreground";

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSaved: () => Promise<void>;
};

export function CategoryDialog({
  open,
  onOpenChange,
  categories,
  onSaved,
}: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;

    try {
      setSaving(true);

      if (editingCategory) {
        await updateAdminCategory(editingCategory._id, { name: name.trim() });
      } else {
        await createAdminCategory({ name: name.trim() });
      }

      setName("");
      setEditingCategory(null);
      await onSaved();
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(getCurrentCategory: Category) {
    setEditingCategory(getCurrentCategory);
    setName(getCurrentCategory.name);
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setName("");
      setEditingCategory(null);
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader className="border-b border-[#D4AF37]/20 pb-3">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
            Manage Categories
          </DialogTitle>
        </DialogHeader>

        <div className={contentWrap}>
          <div className={formRow}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vintage Hoodies, Denim, T-Shirts"
              className="rounded-xl border border-[#D4AF37]/40 bg-black/60 text-white placeholder:text-muted-foreground focus:border-[#D4AF37]"
            />
            <Button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] transition-colors shrink-0"
            >
              {saving ? "Saving..." : editingCategory ? "Update" : "Add"}
            </Button>
          </div>

          <Separator className="bg-[#D4AF37]/20" />

          <div className={categoriesList}>
            {!categories.length ? (
              <div className={emptyStateClass}>No categories found</div>
            ) : null}

            {categories.map((category) => (
              <div key={category._id} className={categoryRow}>
                <div className={categoryInfo}>
                  <Tag className={categoryIcon} />
                  <span className={categoryName}>{category.name}</span>
                </div>

                <Button
                  size={"sm"}
                  variant={"ghost"}
                  onClick={() => handleEdit(category)}
                  className="rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
