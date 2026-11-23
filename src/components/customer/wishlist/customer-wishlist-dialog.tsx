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
  "sm:max-w-xl rounded-2xl border border-[#D4AF37] bg-white text-black shadow-2xl p-6";
const contentClass = "space-y-4 mt-2";
const listClass = "space-y-3 max-h-[60vh] overflow-y-auto pr-1";
const itemClass =
  "flex items-start gap-3.5 rounded-xl border border-[#D4AF37]/50 bg-white p-3 transition-colors hover:border-[#D4AF37]";
const imageClass = "h-20 w-16 shrink-0 rounded-lg border border-[#D4AF37]/30 bg-zinc-100 object-cover";
const noImageClass =
  "flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-400";
const bodyClass = "min-w-0 flex-1 space-y-1";
const brandClass = "text-[10px] font-bold uppercase tracking-[0.18em] text-[#997300]";
const titleClass = "line-clamp-1 text-sm font-semibold text-black hover:text-[#997300] transition-colors";
const priceClass = "text-sm font-bold text-black";
const actionsClass = "flex items-center gap-3 pt-1.5";
const buttonClass = "h-7 rounded-lg px-3 text-xs";
const emptyClass = "text-center text-sm text-zinc-500 py-8";
const iconClass = "h-4 w-4 text-[#997300]";
const DialogTitleClass = "flex items-center gap-2 text-black font-bold text-lg";
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

                      <button
                        type="button"
                        className="text-xs text-red-600 hover:text-red-700 bg-transparent hover:bg-transparent font-medium py-1 px-1 cursor-pointer inline-flex items-center"
                        onClick={() => void removeItem(item.productId)}
                      >
                        <Trash2 className={trashIcon} />
                        Remove
                      </button>
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
