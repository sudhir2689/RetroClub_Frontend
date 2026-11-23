import { Commonloader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { createCustomerAddresses } from "@/features/customer/profile/api";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@clerk/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function CheckoutAddressPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  const {
    cart,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    setAddresses,
    loading,
    loadCart,
  } = useCustomerCartAndCheckoutStore((state) => state);

  const [showAddForm, setShowAddForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      void loadCart(Boolean(isSignedIn));
    }
  }, [isLoaded, isSignedIn, loadCart]);

  useEffect(() => {
    // If no address selected but addresses exist, pick first or default
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [addresses, selectedAddressId, setSelectedAddressId]);

  const items = cart.items || [];
  const subTotal = items.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0,
  );

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !address.trim() || !state.trim() || !postalCode.trim()) {
      toast.error("Please fill in all address fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createCustomerAddresses({
        fullName: fullName.trim(),
        address: address.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        isDefault: addresses.length === 0,
      });

      const updated = res?.items ?? [];
      setAddresses(updated);

      const added = updated[updated.length - 1];
      if (added?._id) {
        setSelectedAddressId(added._id);
      }

      setFullName("");
      setAddress("");
      setState("");
      setPostalCode("");
      setShowAddForm(false);
      toast.success("Address added successfully");
    } catch {
      toast.error("Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToPayment = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address to proceed");
      return;
    }
    navigate("/checkout/payment");
  };

  if (loading && !addresses.length) {
    return <Commonloader />;
  }

  return (
    <div className="w-full text-black">
      {/* Amazon-style Multi-Step Stepper */}
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
          <div className="flex items-center gap-2 text-black font-bold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37] text-black text-xs font-bold shadow-xs">
              2
            </span>
            <span className="border-b-2 border-[#D4AF37] pb-0.5">
              2. Select Address
            </span>
          </div>
          <span className="text-zinc-300">───</span>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 text-zinc-400 text-xs">
              3
            </span>
            <span>3. Payment</span>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#D4AF37]/30 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
              Select Delivery Address
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              Choose an existing delivery address or add a new shipping location
            </p>
          </div>

          <Button asChild variant="ghost" size="sm" className="w-fit text-xs text-zinc-600 hover:text-black">
            <Link to="/cart">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Cart
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left Column: Address Selection & Form */}
          <div className="space-y-6">
            {/* Existing Addresses */}
            <div className="space-y-4">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr._id;

                return (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddressId(addr._id)}
                    className={`cursor-pointer rounded-2xl bg-white p-5 transition-all shadow-xs ${
                      isSelected
                        ? "border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-md"
                        : "border border-[#D4AF37]/40 hover:border-[#D4AF37]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Radio indicator */}
                      <div className="pt-0.5">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                            isSelected
                              ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                              : "border-zinc-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-bold text-black">
                            {addr.fullName}
                          </p>
                          {addr.isDefault && (
                            <span className="rounded-md border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#997300]">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-zinc-700 leading-relaxed">
                          {addr.address}, {addr.state} - <strong>{addr.postalCode}</strong>
                        </p>

                        {isSelected && (
                          <div className="pt-3">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleContinueToPayment();
                              }}
                              className="rounded-xl bg-[#D4AF37] text-black font-bold hover:bg-[#e5c158] transition-all px-5 py-2 text-xs shadow-sm"
                            >
                              Deliver to this address
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Address Card */}
            <div className="rounded-2xl border border-[#D4AF37] bg-white p-6 shadow-xs">
              {!showAddForm ? (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="flex w-full items-center justify-between text-left font-bold text-black hover:text-[#997300] transition-colors"
                >
                  <span className="flex items-center gap-2 text-base">
                    <Plus className="h-5 w-5 text-[#997300]" />
                    Add a new delivery address
                  </span>
                  <span className="text-xs text-[#997300] underline font-semibold">
                    Expand
                  </span>
                </button>
              ) : (
                <form onSubmit={handleAddNewAddress} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <h3 className="flex items-center gap-2 text-base font-bold text-black">
                      <MapPin className="h-5 w-5 text-[#997300]" />
                      Add a new delivery address
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-xs text-zinc-500 hover:text-black font-medium"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                        Full Name (First and Last Name)
                      </Label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="rounded-xl border border-[#D4AF37]/50 bg-white text-black"
                        required
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                        Street Address / Flat / Building
                      </Label>
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 42 Park Street, Apt 3B"
                        className="rounded-xl border border-[#D4AF37]/50 bg-white text-black"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                        State
                      </Label>
                      <Input
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Maharashtra"
                        className="rounded-xl border border-[#D4AF37]/50 bg-white text-black"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                        Postal / PIN Code
                      </Label>
                      <Input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 400001"
                        className="rounded-xl border border-[#D4AF37]/50 bg-white text-black"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-black text-white hover:bg-zinc-800 font-semibold px-6"
                    >
                      {isSubmitting ? "Saving..." : "Save Address"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowAddForm(false)}
                      className="rounded-xl text-zinc-600 hover:text-black"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Continue */}
          <div className="space-y-4">
            <div className="sticky top-24 rounded-2xl border border-[#D4AF37] bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-black border-b border-zinc-100 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Items ({cart.totalQuantity}):</span>
                    <span className="font-semibold text-black">{formatPrice(subTotal)}</span>
                  </div>

                  <div className="flex justify-between text-zinc-600">
                    <span>Delivery:</span>
                    <span className="font-semibold text-emerald-700">FREE</span>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-baseline justify-between">
                    <span className="text-base font-bold text-black">Order Total:</span>
                    <span className="text-xl font-black text-black">
                      {formatPrice(subTotal)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleContinueToPayment}
                  disabled={!selectedAddressId}
                  className="w-full rounded-xl bg-[#D4AF37] text-black font-bold hover:bg-[#e5c158] transition-all h-12 text-sm shadow-md shadow-[#D4AF37]/20"
                >
                  Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-center gap-2 text-xs text-zinc-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Choose address to proceed to payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default CheckoutAddressPage;
