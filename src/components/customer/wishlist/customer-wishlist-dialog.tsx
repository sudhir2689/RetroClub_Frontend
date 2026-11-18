import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { formatPrice } from "@/lib/utils";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const dialogClass =
  "sm:max-w-xl rounded-2xl border border-[#D4AF37]/50 bg-black text-white shadow-2xl p-6";
const contentClass = "space-y-4 mt-2";
const listClass = "space-y-3 max-h-[60vh] overflow-y-auto pr-1";
const itemClass =
  "flex items-start gap-3.5 rounded-xl border border-[#D4AF37]/30 bg-[#0d0d0d] p-3 transition-colors hover:border-[#D4AF37]";
const imageClass = "h-20 w-16 shrink-0 rounded-lg border border-[#D4AF37]/30 bg-black object-cover";
const noImageClass =
  "flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-xs text-muted-foreground";
const bodyClass = "min-w-0 flex-1 space-y-1";
const brandClass = "text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]";
const titleClass = "line-clamp-1 text-sm font-semibold text-white hover:text-[#D4AF37] transition-colors";
const priceClass = "text-sm font-semibold text-white";
const actionsClass = "flex gap-2 pt-1.5";
const buttonClass = "h-7 rounded-lg px-3 text-xs";
const emptyClass = "text-center text-sm text-muted-foreground py-8";
const iconClass = "h-4 w-4 text-[#D4AF37]";
const DialogTitleClass = "flex items-center gap-2 text-white font-bold text-lg";
const trashIcon = "mr-1 h-3.5 w-3.5";

function CustomerWishlistDialog() {
  const { isOpen, setOpen, items, removeItem } = useCustomerWishlistStore(
    (state) => state,
  );

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className={dialogClass}>
        <DialogHeader className="border-b border-[#D4AF37]/20 pb-3">
          <DialogTitle className={DialogTitleClass}>
            <Heart className={iconClass} />
            My Wishlist ({items.length})
          </DialogTitle>
        </DialogHeader>
        <div className={contentClass}>
          {!items.length ? (
            <p className={emptyClass}>No items saved in your wishlist yet.</p>
          ) : null}

          {items.length ? (
            <div className={listClass}>
              {items.map((item) => (
                <div key={item.productId} className={itemClass}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className={imageClass}
                    />
                  ) : (
                    <div className={noImageClass}>No Image</div>
                  )}

                  <div className={bodyClass}>
                    <p className={brandClass}>{item.brand}</p>
                    <Link
                      to={`/collection/${item.productId}`}
                      className={titleClass}
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </Link>
                    <p className={priceClass}>{formatPrice(item.finalPrice)}</p>
                    <div className={actionsClass}>
                      <Button
                        asChild
                        variant={"default"}
                        className={`${buttonClass} bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158]`}
                      >
                        <Link
                          onClick={() => setOpen(false)}
                          to={`/collection/${item.productId}`}
                        >
                          View
                        </Link>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className={`${buttonClass} border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500`}
                        onClick={() => void removeItem(item.productId)}
                      >
                        <Trash2 className={trashIcon} />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerWishlistDialog;
