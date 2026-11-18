import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/features/admin/products/types";
import { getCoverImage } from "@/features/admin/products/use-product-form";
import { formatPrice } from "@/lib/utils";
import { Pencil } from "lucide-react";

const wrapperClass = "overflow-x-auto rounded-xl border border-[#D4AF37]/40 bg-card";

const tableHeaderClass = "bg-black/50 border-b border-[#D4AF37]/30";

const imageHeadClass = "w-[90px] text-[#D4AF37]";

const editHeadClass = "w-[80px] text-right text-[#D4AF37]";

const stateCellClass = "h-28 text-center text-muted-foreground";

const imageBoxClass =
  "h-14 w-14 overflow-hidden rounded-lg border border-[#D4AF37]/40 bg-black";

const imageClass = "h-full w-full object-cover";

const titleWrapClass = "space-y-1";

const titleClass = "font-medium text-white line-clamp-1";

const descriptionClass = "line-clamp-1 text-xs text-muted-foreground max-w-xs";

const editCellWrapClass = "flex justify-end";

const editIconClass = "h-4 w-4 mr-1 text-[#D4AF37]";

type ProductsTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  loading: boolean;
};

export function ProductsTable({
  products,
  onEdit,
  loading,
}: ProductsTableProps) {
  return (
    <div className={wrapperClass}>
      <Table>
        <TableHeader className={tableHeaderClass}>
          <TableRow className="border-[#D4AF37]/30 hover:bg-transparent">
            <TableHead className={imageHeadClass}>Image</TableHead>
            <TableHead className="text-[#D4AF37]">Title</TableHead>
            <TableHead className="text-[#D4AF37]">Brand</TableHead>
            <TableHead className="text-[#D4AF37]">Category</TableHead>
            <TableHead className="text-[#D4AF37]">Price</TableHead>
            <TableHead className="text-[#D4AF37]">Status</TableHead>
            <TableHead className="text-[#D4AF37]">Stock</TableHead>
            <TableHead className={editHeadClass}>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className={stateCellClass}>
                Loading Products...
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className={stateCellClass}>
                No products found. Click "Add Product / Clothes" to add your first item!
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const cover = getCoverImage(product.images);
              return (
                <TableRow
                  key={product._id}
                  className="border-b border-[#D4AF37]/20 hover:bg-white/[0.02] transition-colors"
                >
                  <TableCell>
                    <div className={imageBoxClass}>
                      {cover ? (
                        <img
                          src={cover.url}
                          alt={product.title}
                          className={imageClass}
                        />
                      ) : null}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className={titleWrapClass}>
                      <p className={titleClass}>{product.title}</p>
                      <p className={descriptionClass}>{product.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-white/90">{product.brand}</TableCell>
                  <TableCell className="text-sm text-white/90">
                    <span className="rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2.5 py-0.5 text-xs text-[#D4AF37]">
                      {product.category?.name || "Uncategorized"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-white">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
                        product.status === "active"
                          ? "border border-green-500/40 bg-green-500/10 text-green-400"
                          : "border border-zinc-700 bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-white/90">
                    <span className={product.stock <= 5 ? "text-amber-400 font-bold" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className={editCellWrapClass}>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => onEdit(product)}
                      className="rounded-xl border border-[#D4AF37]/40 bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
                    >
                      <Pencil className={editIconClass} />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
