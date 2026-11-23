import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import CustomerCartItems from "./customer-cart-items";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useAuth, useUser } from "@clerk/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const contentClass =
  "ml-auto flex h-[90dvh] max-h-[90dvh] w-full overflow-hidden rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none border-l border-t sm:border-t-0 border-[#D4AF37] bg-white text-black p-0 shadow-2xl";

const shellClass = "grid h-full min-h-0 w-full lg:grid-cols-[1.7fr_1fr]";
const leftPaneClass =
  "min-h-0 border-b border-[#D4AF37]/20 lg:border-b-0 lg:border-r";
const rightPaneClass =
  "min-h-0 bg-white";
const rightInnerClass = "flex h-full min-h-0 flex-col p-5";

const panelClass =
  "flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#D4AF37] bg-white shadow-xs";
const panelHeaderClass = "border-b border-zinc-100 px-5 py-4";
const panelTitleClass = "flex items-center gap-2 text-left text-lg font-bold text-black";

const scrollClass = "min-h-0 flex-1";
const bodyClass = "space-y-4 px-5 py-4";

const sectionTitleClass = "text-xs font-bold uppercase tracking-wider text-[#997300]";
const helperClass = "text-xs text-zinc-500";
const cardClass = "rounded-xl border border-[#D4AF37]/40 bg-white p-3 text-sm text-black";
const rowClass = "flex items-center justify-between text-sm py-1";
const totalRowClass =
  "flex items-center justify-between border-t border-[#D4AF37]/30 pt-4 text-base font-bold text-black";

const promoRowClass = "flex gap-2";
const promoInputClass = "rounded-xl border border-[#D4AF37]/50 bg-white text-black text-xs font-medium";
const actionClass = "shrink-0 space-y-3 border-t border-zinc-100 px-5 py-4";
const primaryButtonClass =
  "h-11 w-full rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20";

const promoTitle =
  "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]";

const infoBoxClass =
  "rounded-2xl border border-dashed border-[#D4AF37]/30 bg-black/60 p-6 text-center text-sm text-muted-foreground";

function SummaryRow(props: { label: string; value: string | number }) {
  return (
    <div className={rowClass}>
      <span className="text-muted-foreground">{props.label}</span>
      <span className="font-medium text-white">{props.value}</span>
    </div>
  );
}

function CustomerCartAndCheckoutDrawer() {
  const { isBootstrapped } = useAuthStore();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    isOpen,
    setOpen,
    loadCart,
    selectedAddressId,
    addresses,
    promoInput,
    appliedPromo,
    points,
    promoLoading,
    checkoutLoading,
    pointsCheckoutLoading,
    setPromoInput,
    clearPromo,
    applyPromo,
    startRazorpayCheckout,
    startPointsCheckout,
    loading,
    cart,
  } = useCustomerCartAndCheckoutStore((state) => state);

  useEffect(() => {
    if (!isOpen || !isLoaded || !isBootstrapped) return;

    void loadCart(Boolean(isSignedIn));
  }, [isBootstrapped, isLoaded, isOpen, isSignedIn, loadCart]);

  const selectedAddress =
    addresses.find((item) => item._id === selectedAddressId) || null;

  const subTotal = cart.items.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0,
  );

  const discountAmount = appliedPromo
    ? Math.round((subTotal * appliedPromo.percentage) / 100)
    : 0;

  const totalAmount = Math.max(subTotal - discountAmount, 0);

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerContent className={contentClass}>
        <div className={shellClass}>
          <div className={leftPaneClass}>
            <CustomerCartItems />
          </div>
          <aside className={rightPaneClass}>
            <div className={rightInnerClass}>
              <div className={panelClass}>
                <DrawerHeader className={panelHeaderClass}>
                  <DrawerTitle className={panelTitleClass}>
                    Checkout Summary
                  </DrawerTitle>
                </DrawerHeader>

                {isSignedIn ? (
                  <>
                    <ScrollArea className={scrollClass}>
                      <div className={bodyClass}>
                        <section className="space-y-2">
                          <p className={sectionTitleClass}>Delivery Address</p>

                          {selectedAddress ? (
                            <div className={cardClass}>
                              <p className="font-semibold text-white">
                                {selectedAddress.fullName}
                              </p>
                              <p className={helperClass}>
                                {selectedAddress.address}, {selectedAddress.state}
                              </p>
                              <p className={helperClass}>
                                Postal Code: {selectedAddress.postalCode}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              No default address selected. Add or select one from profile.
                            </p>
                          )}
                        </section>

                        <section className="space-y-2">
                          <p className={promoTitle}>Coupon & Promo</p>
                          {!appliedPromo ? (
                            <div className={promoRowClass}>
                              <Input
                                value={promoInput}
                                onChange={(e) =>
                                  setPromoInput(e.target.value.toUpperCase())
                                }
                                placeholder="Enter coupon code"
                                className={promoInputClass}
                              />
                              <Button
                                size="sm"
                                onClick={() => void applyPromo()}
                                disabled={promoLoading || !promoInput.trim()}
                                className="rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] text-xs"
                              >
                                {promoLoading ? "Applying..." : "Apply"}
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-2.5 text-xs">
                              <div>
                                <span className="font-semibold text-[#D4AF37]">
                                  {appliedPromo.code}
                                </span>{" "}
                                applied ({appliedPromo.percentage}% OFF)
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearPromo}
                                className="h-6 px-2 text-xs text-muted-foreground hover:text-white"
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </section>

                        <div className="space-y-1.5 pt-2">
                          <SummaryRow label="Total Items" value={cart.totalQuantity} />
                          <SummaryRow label="Subtotal" value={formatPrice(subTotal)} />
                          {discountAmount > 0 ? (
                            <SummaryRow
                              label="Promo Discount"
                              value={`-${formatPrice(discountAmount)}`}
                            />
                          ) : null}
                          <SummaryRow label="Available Reward Points" value={points} />
                          <div className={totalRowClass}>
                            <span>Total Payable</span>
                            <span className="text-[#D4AF37] text-lg font-bold">
                              {formatPrice(totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>

                    <DrawerFooter className={actionClass}>
                      <Button
                        onClick={() => {
                          void setOpen(false);
                          void startRazorpayCheckout({
                            isSignedIn: Boolean(isSignedIn),
                            name: user?.fullName || "Customer",
                            email:
                              user?.primaryEmailAddress?.emailAddress || "",
                            onSuccess: () => navigate("/order-success"),
                          });
                        }}
                        type="button"
                        className={primaryButtonClass}
                        disabled={
                          loading ||
                          !cart.items.length ||
                          !selectedAddressId ||
                          checkoutLoading ||
                          pointsCheckoutLoading
                        }
                      >
                        {checkoutLoading
                          ? "Connecting to Razorpay..."
                          : "Pay with Razorpay (Cards / UPI)"}
                      </Button>
                      <Button
                        onClick={() => {
                          void startPointsCheckout({
                            isSignedIn: Boolean(isSignedIn),
                            onSuccess: () => navigate("/order-success"),
                          });
                        }}
                        disabled={
                          !(
                            Boolean(isSignedIn) &&
                            Boolean(selectedAddressId) &&
                            Boolean(cart.items.length) &&
                            points >= totalAmount &&
                            !checkoutLoading &&
                            !pointsCheckoutLoading
                          )
                        }
                        type="button"
                        variant="outline"
                        className="h-11 w-full rounded-xl border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-white font-semibold transition-colors"
                      >
                        {pointsCheckoutLoading
                          ? "Processing Points..."
                          : `Pay with Points (${points} available)`}
                      </Button>
                    </DrawerFooter>
                  </>
                ) : (
                  <div className={bodyClass}>
                    <div className={infoBoxClass}>
                      Sign in to your account to review address and complete checkout.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CustomerCartAndCheckoutDrawer;
