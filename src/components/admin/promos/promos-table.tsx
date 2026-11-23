import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Promo } from "@/features/admin/promo/types";
import { formatPrice } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

type PromoTableProps = {
  promos: Promo[];
  loading: boolean;
  deletingPromoId: string;
  onEdit: (promo: Promo) => void;
  onDelete: (promoId: string) => Promise<void>;
};

const wrapClass = "overflow-x-auto rounded-xl border border-[#D4AF37] bg-white";

const tableHeaderClass = "bg-zinc-50 border-b border-[#D4AF37]/30";

const loadingCellClass = "h-28 text-center text-zinc-500";

const codeCellClass = "font-mono font-bold text-[#997300] text-sm";

const rightWrapClass = "flex justify-end";

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

function PromoTable({
  promos,
  loading,
  onDelete,
  onEdit,
  deletingPromoId,
}: PromoTableProps) {
  return (
    <div className={wrapClass}>
      <Table>
        <TableHeader className={tableHeaderClass}>
          <TableRow className="border-[#D4AF37]/30 hover:bg-transparent">
            <TableHead className="text-[#997300] font-bold">Code</TableHead>
            <TableHead className="text-[#997300] font-bold">Discount</TableHead>
            <TableHead className="text-[#997300] font-bold">Uses Left</TableHead>
            <TableHead className="text-[#997300] font-bold">Min Order</TableHead>
            <TableHead className="text-[#997300] font-bold">Valid From</TableHead>
            <TableHead className="text-[#997300] font-bold">Valid Till</TableHead>
            <TableHead className="w-[80px] text-right text-[#997300] font-bold">Edit</TableHead>
            <TableHead className="w-[80px] text-right text-[#997300] font-bold">Delete</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className={loadingCellClass}>
                Loading Promos...
              </TableCell>
            </TableRow>
          ) : promos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className={loadingCellClass}>
                No promo codes created yet. Click "Add Promo Code" to create one.
              </TableCell>
            </TableRow>
          ) : (
            promos.map((promo) => (
              <TableRow
                key={promo._id}
                className="border-b border-[#D4AF37]/20 hover:bg-zinc-50/60 transition-colors"
              >
                <TableCell className={codeCellClass}>{promo.code}</TableCell>
                <TableCell className="font-bold text-black">
                  {promo.percentage}% OFF
                </TableCell>
                <TableCell className="text-zinc-800 font-medium">{promo.count}</TableCell>
                <TableCell className="text-zinc-800 font-medium">
                  {formatPrice(promo.minimumOrderValue)}
                </TableCell>
                <TableCell className="text-xs text-zinc-500">
                  {formatDateTime(promo.startsAt)}
                </TableCell>
                <TableCell className="text-xs text-zinc-500">
                  {formatDateTime(promo.endsAt)}
                </TableCell>
                <TableCell>
                  <div className={rightWrapClass}>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      className="rounded-xl border border-[#D4AF37] bg-white text-black hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
                      onClick={() => onEdit(promo)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={rightWrapClass}>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      disabled={deletingPromoId === promo._id}
                      className="rounded-xl border border-red-500/40 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete promo ${promo.code}?`,
                          )
                        ) {
                          void onDelete(promo._id);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default PromoTable;
