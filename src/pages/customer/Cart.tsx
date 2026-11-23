import { Commonloader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@clerk/react";
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export function CartPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  const {
    cart,
    loading,
    loadCart,
    increase,
    decrease,
    remove,
  } = useCustomerCartAndCheckoutStore((state) => state);

  useEffect(() => {
    if (isLoaded) {
      void loadCart(Boolean(isSignedIn));
    }
  }, [isLoaded, isSignedIn, loadCart]);

  const items = cart.items || [];
  const subTotal = items.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0,
  );

  const handleProceed = () => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }
    navigate("/checkout/address");
  };

  if (loading && !items.length) {
    return <Commonloader />;
  }

  return (
    <div className="w-full text-black">
      {/* Amazon-style Breadcrumb / Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#D4AF37]/30 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              {items.length > 0
                ? `${cart.totalQuantity} items in your cart`
                : "Your cart is currently empty"}
            </p>
          </div>

          {items.length > 0 && (
            <div className="text-left sm:text-right">
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                Price
              </span>
            </div>
          )}
        </div>

        {!items.length ? (
          <div className="rounded-2xl border border-[#D4AF37] bg-white p-10 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-black">
              Your RetroClub Cart is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
              Explore our vintage football kits and retro apparel to add your favorite items to your cart.
            </p>
            <Button
              asChild
              className="mt-6 rounded-xl bg-black text-white hover:bg-zinc-800 px-6 font-semibold"
            >
              <Link to="/collections">
                Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Left Column: Cart Items (Amazon style) */}
            <div className="space-y-4">
              {items.map((item, index) => {
                return (
                  <Card
                    key={`${item.productId}-${item.size}-${item.color}-${index}`}
                    className="overflow-hidden rounded-2xl border border-[#D4AF37] bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-md"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Product Image */}
                      <Link
                        to={`/collection/${item.productId}`}
                        className="h-28 w-24 shrink-0 sm:h-36 sm:w-32 overflow-hidden rounded-xl border border-[#D4AF37]/30 bg-zinc-100"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover object-center transition-transform hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                            No image
                          </div>
                        )}
                      </Link>

                      {/* Product Details */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          {/* Brand & Title */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wider text-[#997300]">
                                {item.brand}
                              </p>
                              <Link
                                to={`/collection/${item.productId}`}
                                className="line-clamp-2 text-base font-bold text-black hover:text-[#997300] transition-colors sm:text-lg"
                              >
                                {item.title}
                              </Link>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-lg font-bold text-black sm:text-xl">
                                {formatPrice(item.finalPrice)}
                              </p>
                            </div>
                          </div>

                          {/* Selected Options */}
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                            {item.size && (
                              <span className="rounded-md border border-[#D4AF37]/30 bg-zinc-50 px-2 py-0.5 font-medium text-black">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="rounded-md border border-[#D4AF37]/30 bg-zinc-50 px-2 py-0.5 font-medium text-black">
                                Color: {item.color}
                              </span>
                            )}
                          </div>

                          {/* Amazon-like trust & stock badges */}
                          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600">
                            <span className="flex items-center gap-1 font-semibold text-emerald-700">
                              <CheckCircle2 className="h-3.5 w-3.5" /> In stock
                            </span>
                            <span className="flex items-center gap-1 text-zinc-600">
                              <Truck className="h-3.5 w-3.5 text-[#997300]" /> FREE Delivery
                            </span>
                            <span className="flex items-center gap-1 text-zinc-600">
                              <RotateCcw className="h-3.5 w-3.5 text-[#997300]" /> 7 days Returnable
                            </span>
                          </div>
                        </div>

                        {/* Controls Row: Amazon-style Quantity Pill & Delete text */}
                        <div className="mt-4 flex flex-wrap items-center gap-4 pt-2 border-t border-zinc-100">
                          {/* Quantity Pill with yellow/gold border */}
                          <div className="inline-flex items-center rounded-full border border-[#D4AF37] bg-white shadow-xs">
                            <button
                              type="button"
                              onClick={() => void decrease(item, Boolean(isSignedIn))}
                              className="flex h-8 w-8 items-center justify-center rounded-l-full text-black hover:bg-zinc-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              {item.quantity <= 1 ? (
                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                              ) : (
                                <Minus className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <span className="min-w-8 text-center text-xs font-bold text-black px-1">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => void increase(item, Boolean(isSignedIn))}
                              className="flex h-8 w-8 items-center justify-center rounded-r-full text-black hover:bg-zinc-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Red text Remove button with NO colored background, exactly as requested */}
                          <button
                            type="button"
                            onClick={() => void remove(item, Boolean(isSignedIn))}
                            className="text-red-600 hover:text-red-700 bg-transparent hover:bg-transparent text-xs sm:text-sm font-semibold transition-colors cursor-pointer py-1"
                          >
                            Delete
                          </button>

                          <span className="text-zinc-300">|</span>

                          <Link
                            to={`/collection/${item.productId}`}
                            className="text-xs text-zinc-500 hover:text-black font-medium transition-colors"
                          >
                            View details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Right Column: Checkout Summary Box (White box with Golden border, Black text) */}
            <div className="space-y-4">
              <div className="sticky top-24 rounded-2xl border border-[#D4AF37] bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#997300]">
                    <PackageCheck className="h-4 w-4" /> Order Summary
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium text-zinc-700">
                      Subtotal ({cart.totalQuantity} items):
                    </span>
                    <span className="text-2xl font-black text-black">
                      {formatPrice(subTotal)}
                    </span>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 p-3 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Your order is eligible for <strong>FREE Delivery</strong></span>
                  </div>

                  <Button
                    onClick={handleProceed}
                    className="w-full rounded-xl bg-[#D4AF37] text-black font-bold hover:bg-[#e5c158] transition-all h-12 text-sm shadow-md shadow-[#D4AF37]/20"
                  >
                    Proceed to Buy ({cart.totalQuantity} items)
                  </Button>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-center gap-2 text-xs text-zinc-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>100% Safe & Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default CartPage;
