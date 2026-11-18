import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminBanner } from "@/features/admin/settings/types";
import { ExternalLink, Loader2, Package, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const tableWrapClass = "overflow-x-auto rounded-xl border border-[#D4AF37]/40 bg-card";
const previewWrapClass =
  "h-16 w-32 overflow-hidden rounded-lg border border-[#D4AF37]/50 bg-black";
const imageClass = "h-full w-full object-cover object-center";
const idTextClass = "max-w-[200px] truncate text-xs text-muted-foreground font-mono";

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

type AdminSettingsBannersTableProps = {
  items: AdminBanner[];
  onDelete: (id: string) => Promise<void>;
  deletingId?: string | null;
};

function AdminSettingsBannersTable({
  items,
  onDelete,
  deletingId,
}: AdminSettingsBannersTableProps) {
  return (
    <div className={tableWrapClass}>
      <Table>
        <TableHeader className="bg-black/40 border-b border-[#D4AF37]/30">
          <TableRow className="border-[#D4AF37]/30 hover:bg-transparent">
            <TableHead className="text-[#D4AF37] font-medium">Preview</TableHead>
            <TableHead className="text-[#D4AF37] font-medium">Type / Link</TableHead>
            <TableHead className="text-[#D4AF37] font-medium">Identifier</TableHead>
            <TableHead className="text-[#D4AF37] font-medium">Created</TableHead>
            <TableHead className="text-right text-[#D4AF37] font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => {
            const isDeleting = deletingId === item._id;
            return (
              <TableRow
                key={item._id}
                className="border-b border-[#D4AF37]/20 transition-colors hover:bg-white/[0.02]"
              >
                <TableCell>
                  <div className={previewWrapClass}>
                    <img
                      src={item.imageUrl}
                      alt={item.title || "banner"}
                      className={imageClass}
                    />
                  </div>
                </TableCell>

                <TableCell>
                  {item.productId ? (
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-2.5 py-0.5 text-xs font-medium text-[#D4AF37] w-fit">
                        <Package className="h-3 w-3" />
                        Product Banner
                      </span>
                      {item.productTitle ? (
                        <p className="text-sm font-medium text-foreground">
                          {item.productTitle}
                        </p>
                      ) : null}
                      <Link
                        to={`/collection/${item.productId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-[#D4AF37] transition-colors"
                      >
                        View Product <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  ) : item.linkUrl ? (
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/80 w-fit">
                        Linked Banner
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {item.linkUrl}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground">
                      Image Only
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  <p className={idTextClass} title={item.imagePublicId || item._id}>
                    {item.imagePublicId || item._id}
                  </p>
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {formatDateTime(item.createdAt)}
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => {
                      if (
                        window.confirm("Are you sure you want to delete this banner?")
                      ) {
                        void onDelete(item._id);
                      }
                    }}
                    className="border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500 rounded-lg transition-colors"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1 text-red-400" />
                        Delete
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminSettingsBannersTable;
