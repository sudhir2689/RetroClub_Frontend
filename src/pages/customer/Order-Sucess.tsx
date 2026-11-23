import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

const pageWrapClass =
  "flex min-h-[70vh] items-center justify-center bg-[#fafafa] px-4 py-12";
const cardClass =
  "w-full max-w-lg space-y-6 rounded-2xl border border-[#D4AF37] bg-white p-8 text-center shadow-lg";
const iconWrapClass =
  "mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 text-[#997300]";
const titleClass = "text-2xl font-bold tracking-tight text-black";
const textClass = "text-sm text-zinc-600";
const buttonRowClass = "flex flex-col gap-3 sm:flex-row sm:justify-center pt-2";
const primaryButtonClass =
  "rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] transition-colors shadow-md shadow-[#D4AF37]/20";
const outlineButtonClass =
  "rounded-xl border border-black text-black hover:bg-zinc-100 transition-colors font-semibold";

export default function CustomerOrderSuccessPage() {
  return (
    <div className={pageWrapClass}>
      <div className={cardClass}>
        <div className={iconWrapClass}>
          <CheckCircle2 className="h-10 w-10 text-[#D4AF37]" />
        </div>

        <div className="space-y-2">
          <h1 className={titleClass}>Order Placed Successfully!</h1>
          <p className={textClass}>
            Thank you for shopping with RetroClub. Your payment has been confirmed and we are preparing your order.
          </p>
        </div>

        <div className={buttonRowClass}>
          <Button asChild className={primaryButtonClass}>
            <Link to="/collections">Continue Shopping</Link>
          </Button>

          <Button asChild variant="outline" className={outlineButtonClass}>
            <Link to="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
