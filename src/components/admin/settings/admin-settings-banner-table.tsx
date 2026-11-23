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

const tableWrapClass = "overflow-x-auto rounded-xl border border-[#D4AF37] bg-white";
const previewWrapClass =
  "h-16 w-32 overflow-hidden rounded-lg border border-[#D4AF37]/50 bg-zinc-100";
const imageClass = "h-full w-full object-cover object-center";
const idTextClass = "max-w-[200px] truncate text-xs text-zinc-500 font-mono";

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
        <TableHeader className="bg-zinc-50 border-b border-[#D4AF37]/30">
          <TableRow className="border-[#D4AF37]/30 hover:bg-transparent">
            <TableHead className="text-[#997300] font-bold">Preview</TableHead>
            <TableHead className="text-[#997300] font-bold">Type / Link</TableHead>
            <TableHead className="text-[#997300] font-bold">Identifier</TableHead>
            <TableHead className="text-[#997300] font-bold">Created</TableHead>
            <TableHead className="text-right text-[#997300] font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => {
            const isDeleting = deletingId === item._id;
            return (
              <TableRow
                key={item._id}
                className="border-b border-[#D4AF37]/20 transition-colors hover:bg-zinc-50/60"
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
                        <p className="text-sm font-semibold text-black">
                          {item.productTitle}
                        </p>
                      ) : null}
                      <Link
                        to={`/collection/${item.productId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-[#997300] transition-colors"
                      >
                        View Product <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  ) : item.linkUrl ? (
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2.5 py-0.5 text-xs font-medium text-[#997300] w-fit">
                        Linked Banner
                      </span>
                      <span className="text-xs text-zinc-500 truncate max-w-[180px]">
                        {item.linkUrl}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
                      Image Only
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  <p className={idTextClass} title={item.imagePublicId || item._id}>
                    {item.imagePublicId || item._id}
                  </p>
                </TableCell>

                <TableCell className="text-sm text-zinc-600">
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
                    className="border-red-500/40 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1 text-red-600" />
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
