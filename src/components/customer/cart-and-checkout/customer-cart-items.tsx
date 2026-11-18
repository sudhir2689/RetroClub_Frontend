import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@clerk/react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const wrapClass = "flex h-full min-h-0 flex-col bg-black text-white";
const headClass = "border-b border-[#D4AF37]/20 bg-black/80 px-6 py-4";
const headingTextClass =
  "flex items-center gap-2 text-left text-sm font-semibold uppercase tracking-wider text-[#D4AF37]";
const headingIconClass = "h-4 w-4 text-[#D4AF37]";

const scrollClass = "min-h-0 flex-1";
const listClass = "space-y-4 p-5";

const itemClass =
  "group flex gap-4 rounded-2xl border border-[#D4AF37]/30 bg-[#0d0d0d] p-3 shadow-md transition-all hover:border-[#D4AF37] hover:bg-[#121212]";
const imageClass = "h-24 w-20 shrink-0 rounded-xl border border-[#D4AF37]/30 bg-black object-cover";

const textWrapClass = "min-w-0 flex-1 space-y-1.5";
const brandClass =
  "text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]";
const titleClass =
  "block line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-[#D4AF37]";
const metaClass = "text-xs text-muted-foreground";
const priceClass = "text-sm font-bold text-white";

const footerRowClass = "flex flex-wrap items-center justify-between gap-3 pt-2";
const qtyWrapClass =
  "flex items-center overflow-hidden rounded-xl border border-[#D4AF37]/40 bg-black";
const qtyButtonClass = "h-8 w-8 rounded-none p-0 bg-transparent text-white hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]";
const qtyIconClass = "h-3.5 w-3.5";
const qtyValueClass =
  "flex h-8 min-w-8 items-center justify-center border-x border-[#D4AF37]/30 px-2 text-xs font-semibold text-white";

const removeButtonClass = "h-8 rounded-xl border border-red-500/40 bg-red-500/10 px-3 text-xs text-red-400 hover:bg-red-500/20 hover:border-red-500 transition-colors";
const removeIconClass = "mr-1.5 h-3.5 w-3.5";

const emptyWrapClass =
  "flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D4AF37]/30 bg-[#0d0d0d] px-6 text-center";

const emptyTitleClass = "text-base font-semibold text-white";

function CustomerCartItems() {
  const { isSignedIn } = useAuth();

  const { cart, setOpen, increase, decrease, remove } =
    useCustomerCartAndCheckoutStore((state) => state);

  return (
    <div className={wrapClass}>
      <div className={headClass}>
        <p className={headingTextClass}>
          <ShoppingCart className={headingIconClass} />
          Your Cart ({cart.totalQuantity} items)
        </p>
      </div>

      <ScrollArea className={scrollClass}>
        <div className={listClass}>
          {!cart.items.length ? (
            <div className={emptyWrapClass}>
              <ShoppingCart className="h-10 w-10 text-[#D4AF37]/50 mb-3" />
              <p className={emptyTitleClass}>Your shopping cart is empty</p>
              <p className="text-xs text-muted-foreground mt-1">
                Explore our retro collection and add your favorite items.
              </p>
            </div>
          ) : (
            cart.items.map((item, index) => (
              <div key={`${item.productId}-${index + 1}`} className={itemClass}>
                <img src={item.image} alt={item.title} className={imageClass} />

                <div className={textWrapClass}>
                  <p className={brandClass}>{item.brand}</p>

                  <Link
                    to={`/collection/${item.productId}`}
                    className={titleClass}
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>
                  <p className={metaClass}>
                    {[item.color, item.size].filter(Boolean).join(" • ") ||
                      "Standard"}
                  </p>
                  <p className={priceClass}>{formatPrice(item.finalPrice)}</p>

                  <div className={footerRowClass}>
                    <div className={qtyWrapClass}>
                      <button
                        type="button"
                        className={qtyButtonClass}
                        onClick={() => void decrease(item, Boolean(isSignedIn))}
                      >
                        <Minus className="h-3 w-3 mx-auto" />
                      </button>
                      <span className={qtyValueClass}>{item.quantity}</span>
                      <button
                        type="button"
                        className={qtyButtonClass}
                        onClick={() => void increase(item, Boolean(isSignedIn))}
                      >
                        <Plus className="h-3 w-3 mx-auto" />
                      </button>
                    </div>

                    <Button
                      type="button"
                      variant={"outline"}
                      className={removeButtonClass}
                      onClick={() => void remove(item, Boolean(isSignedIn))}
                    >
                      <Trash2 className={removeIconClass} />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default CustomerCartItems;
