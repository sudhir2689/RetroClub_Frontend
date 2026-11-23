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

const wrapperClass = "overflow-x-auto rounded-xl border border-[#D4AF37] bg-white";

const tableHeaderClass = "bg-zinc-50 border-b border-[#D4AF37]/30";

const imageHeadClass = "w-[90px] text-[#997300] font-bold";

const editHeadClass = "w-[80px] text-right text-[#997300] font-bold";

const stateCellClass = "h-28 text-center text-zinc-500";

const imageBoxClass =
  "h-14 w-14 overflow-hidden rounded-lg border border-[#D4AF37]/40 bg-zinc-100";

const imageClass = "h-full w-full object-cover";

const titleWrapClass = "space-y-1";

const titleClass = "font-bold text-black line-clamp-1";

const descriptionClass = "line-clamp-1 text-xs text-zinc-500 max-w-xs";

const editCellWrapClass = "flex justify-end";

const editIconClass = "h-4 w-4 mr-1 text-[#997300]";

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
            <TableHead className="text-[#997300] font-bold">Title</TableHead>
            <TableHead className="text-[#997300] font-bold">Brand</TableHead>
            <TableHead className="text-[#997300] font-bold">Category</TableHead>
            <TableHead className="text-[#997300] font-bold">Price</TableHead>
            <TableHead className="text-[#997300] font-bold">Status</TableHead>
            <TableHead className="text-[#997300] font-bold">Stock</TableHead>
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
                  className="border-b border-[#D4AF37]/20 hover:bg-zinc-50/60 transition-colors"
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
                  <TableCell className="text-sm font-medium text-zinc-800">{product.brand}</TableCell>
                  <TableCell className="text-sm text-zinc-700">
                    <span className="rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-2.5 py-0.5 text-xs font-bold text-[#997300]">
                      {product.category?.name || "Uncategorized"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-bold text-black">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
                        product.status === "active"
                          ? "border border-green-500/40 bg-green-50 text-green-700"
                          : "border border-zinc-300 bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-800">
                    <span className={product.stock <= 5 ? "text-red-600 font-bold" : "font-medium"}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className={editCellWrapClass}>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => onEdit(product)}
                      className="rounded-xl border border-[#D4AF37] bg-white text-black hover:bg-[#D4AF37]/10 transition-colors font-semibold cursor-pointer"
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
