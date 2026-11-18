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

const wrapClass = "overflow-x-auto rounded-xl border border-[#D4AF37]/40 bg-card";

const tableHeaderClass = "bg-black/60 border-b border-[#D4AF37]/30";

const loadingCellClass = "h-28 text-center text-muted-foreground";

const codeCellClass = "font-mono font-bold text-[#D4AF37] text-sm";

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
            <TableHead className="text-[#D4AF37]">Code</TableHead>
            <TableHead className="text-[#D4AF37]">Discount</TableHead>
            <TableHead className="text-[#D4AF37]">Uses Left</TableHead>
            <TableHead className="text-[#D4AF37]">Min Order</TableHead>
            <TableHead className="text-[#D4AF37]">Valid From</TableHead>
            <TableHead className="text-[#D4AF37]">Valid Till</TableHead>
            <TableHead className="w-[80px] text-right text-[#D4AF37]">Edit</TableHead>
            <TableHead className="w-[80px] text-right text-[#D4AF37]">Delete</TableHead>
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
                className="border-b border-[#D4AF37]/20 hover:bg-white/[0.02] transition-colors"
              >
                <TableCell className={codeCellClass}>{promo.code}</TableCell>
                <TableCell className="font-semibold text-white">
                  {promo.percentage}% OFF
                </TableCell>
                <TableCell className="text-white/90">{promo.count}</TableCell>
                <TableCell className="text-white/90">
                  {formatPrice(promo.minimumOrderValue)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDateTime(promo.startsAt)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDateTime(promo.endsAt)}
                </TableCell>
                <TableCell>
                  <div className={rightWrapClass}>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      className="rounded-xl border border-[#D4AF37]/40 bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
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
                      className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500 transition-colors"
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
                      <Trash2 className="h-3.5 w-3.5" />
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
