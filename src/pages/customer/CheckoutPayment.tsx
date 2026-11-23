import { Commonloader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { formatPrice } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/react";
import {
  CreditCard,
  Edit2,
  Gift,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  TicketPercent,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function CheckoutPaymentPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const {
    cart,
    addresses,
    selectedAddressId,
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
    loadCart,
  } = useCustomerCartAndCheckoutStore((state) => state);

  useEffect(() => {
    if (isLoaded) {
      void loadCart(Boolean(isSignedIn));
    }
  }, [isLoaded, isSignedIn, loadCart]);

  useEffect(() => {
    if (isLoaded && !selectedAddressId && addresses.length === 0) {
      navigate("/checkout/address");
    }
  }, [isLoaded, selectedAddressId, addresses, navigate]);

  const selectedAddress =
    addresses.find((item) => item._id === selectedAddressId) || addresses[0] || null;

  const items = cart.items || [];
  const subTotal = items.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0,
  );

  const discountAmount = appliedPromo
    ? Math.round((subTotal * appliedPromo.percentage) / 100)
    : 0;

  const finalTotal = Math.max(subTotal - discountAmount, 0);

  const userEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";
  const userName = user?.fullName || user?.username || "Customer";

  const handleRazorpay = async () => {
    await startRazorpayCheckout({
      isSignedIn: Boolean(isSignedIn),
      name: userName,
      email: userEmail,
      onSuccess: () => navigate("/order-success"),
    });
  };

  const handlePoints = async () => {
    await startPointsCheckout({
      isSignedIn: Boolean(isSignedIn),
      onSuccess: () => navigate("/order-success"),
    });
  };

  if (loading && !items.length) {
    return <Commonloader />;
  }

  return (
    <div className="w-full text-black">
      {/* Amazon-style Stepper */}
        <div className="mb-8 flex items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm font-semibold">
          <Link
            to="/cart"
            className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
              ✓
            </span>
            <span>1. Cart</span>
          </Link>
          <span className="text-zinc-300">───</span>
          <Link
            to="/checkout/address"
            className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
              ✓
            </span>
            <span>2. Address</span>
          </Link>
          <span className="text-zinc-300">───</span>
          <div className="flex items-center gap-2 text-black font-bold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37] text-black text-xs font-bold shadow-xs">
              3
            </span>
            <span className="border-b-2 border-[#D4AF37] pb-0.5">
              3. Payment
            </span>
          </div>
        </div>

        <div className="mb-6 border-b border-[#D4AF37]/30 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Review Order & Payment
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Verify your delivery address, apply coupons, and choose your preferred payment method
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left Column: Details & Payment Choices */}
          <div className="space-y-6">
            {/* 1. Delivery Address Card */}
            <div className="rounded-2xl border border-[#D4AF37] bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#997300]">
                    <MapPin className="h-4 w-4" /> Delivering To
                  </div>
                  {selectedAddress ? (
                    <div className="pt-1 text-sm text-zinc-800">
                      <p className="text-base font-bold text-black">
                        {selectedAddress.fullName}
                      </p>
                      <p className="text-zinc-600">
                        {selectedAddress.address}, {selectedAddress.state} - {selectedAddress.postalCode}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">No address selected</p>
                  )}
                </div>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl border border-[#D4AF37]/50 text-xs font-semibold hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
                >
                  <Link to="/checkout/address">
                    <Edit2 className="mr-1.5 h-3.5 w-3.5 text-[#997300]" /> Change
                  </Link>
                </Button>
              </div>
            </div>

            {/* 2. Items Review Card */}
            <div className="rounded-2xl border border-[#D4AF37] bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#997300]">
                  <Package className="h-4 w-4" /> Items in Order ({cart.totalQuantity})
                </div>
                <Link
                  to="/cart"
                  className="text-xs text-[#997300] font-semibold hover:underline"
                >
                  Edit Cart
                </Link>
              </div>

              <div className="mt-4 divide-y divide-zinc-100">
                {items.map((item, idx) => (
                  <div
                    key={`${item.productId}-${idx}`}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-[#D4AF37]/30 bg-zinc-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">
                          Item
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#997300]">
                        {item.brand}
                      </p>
                      <p className="truncate text-sm font-bold text-black">
                        {item.title}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Qty: {item.quantity}{" "}
                        {item.size ? `• Size: ${item.size}` : ""}{" "}
                        {item.color ? `• Color: ${item.color}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-black">
                        {formatPrice(item.finalPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Coupon / Promo Section */}
            <div className="rounded-2xl border border-[#D4AF37] bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#997300] mb-3">
                <TicketPercent className="h-4 w-4" /> Apply Coupon Code
              </div>

              {!appliedPromo ? (
                <div className="flex gap-2">
                  <Input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon (e.g. RETRO10)"
                    className="rounded-xl border border-[#D4AF37]/50 bg-white text-black font-semibold"
                  />
                  <Button
                    onClick={() => void applyPromo()}
                    disabled={promoLoading || !promoInput.trim()}
                    className="rounded-xl bg-black text-white hover:bg-zinc-800 font-semibold px-5"
                  >
                    {promoLoading ? "Applying..." : "Apply"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-50/50 p-3 text-xs">
                  <div>
                    <span className="font-bold text-emerald-800">
                      {appliedPromo.code}
                    </span>{" "}
                    applied ({appliedPromo.percentage}% discount)
                  </div>
                  {/* Remove in red text with NO background as requested */}
                  <button
                    type="button"
                    onClick={clearPromo}
                    className="text-red-600 hover:text-red-700 bg-transparent hover:bg-transparent font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* 4. Payment Methods Card */}
            <div className="rounded-2xl border border-[#D4AF37] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#997300]">
                <CreditCard className="h-4 w-4" /> Select Payment Method
              </div>

              <div className="space-y-3">
                {/* Razorpay Button - Explicitly requested to be BLUE */}
                <div className="rounded-xl border border-blue-500/30 bg-blue-50/30 p-4">
                  <div className="mb-3">
                    <p className="text-sm font-bold text-black">
                      Cards, UPI, NetBanking & Wallets
                    </p>
                    <p className="text-xs text-zinc-500">
                      Instant, 100% secure payment powered by Razorpay
                    </p>
                  </div>
                  <Button
                    onClick={handleRazorpay}
                    disabled={checkoutLoading || !items.length || !selectedAddress}
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold h-12 shadow-md shadow-blue-500/20 text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <CreditCard className="h-5 w-5" />
                    {checkoutLoading
                      ? "Processing Payment..."
                      : `Pay with Razorpay (${formatPrice(finalTotal)})`}
                  </Button>
                </div>

                {/* Points Option (if available) */}
                {points > 0 && (
                  <div className="rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-black flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-[#997300]" />
                          RetroClub Reward Points
                        </p>
                        <p className="text-xs text-zinc-600">
                          You have <strong>{points}</strong> points available (₹{points} value)
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handlePoints}
                      disabled={
                        pointsCheckoutLoading ||
                        points < finalTotal ||
                        !items.length ||
                        !selectedAddress
                      }
                      variant="outline"
                      className="w-full rounded-xl border border-black text-black hover:bg-black hover:text-white font-bold h-11 text-xs sm:text-sm transition-all"
                    >
                      {pointsCheckoutLoading
                        ? "Processing with Points..."
                        : points < finalTotal
                          ? `Insufficient Points (Need ₹${finalTotal})`
                          : `Pay Full Amount with Points (₹${finalTotal})`}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary Box */}
          <div className="space-y-4">
            <div className="sticky top-24 rounded-2xl border border-[#D4AF37] bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-black border-b border-zinc-100 pb-3">
                  Checkout Summary
                </h3>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Items Total:</span>
                    <span className="font-semibold text-black">{formatPrice(subTotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Promo Discount ({appliedPromo?.percentage}%):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-600">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold text-emerald-700">FREE</span>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-baseline justify-between">
                    <span className="text-base font-bold text-black">Order Total:</span>
                    <span className="text-2xl font-black text-black">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Direct Pay with Razorpay button in blue */}
                <Button
                  onClick={handleRazorpay}
                  disabled={checkoutLoading || !items.length || !selectedAddress}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold h-12 shadow-md shadow-blue-500/20 text-sm transition-all"
                >
                  {checkoutLoading ? "Processing..." : `Pay ${formatPrice(finalTotal)}`}
                </Button>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-center gap-2 text-xs text-zinc-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default CheckoutPaymentPage;
