import { Badge } from "@/components/ui/badge";
import { extractSalePrice } from "@/features/customer/products/product-list.shared";
import type {
  CustomerProduct,
  ProductSize,
} from "@/features/customer/products/types";
import { formatPrice } from "@/lib/utils";
import CustomerProductOptionsGroup from "./customer-product-options-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";

const summaryWrapClass = "space-y-6";

const badgesWrapClass = "flex flex-wrap items-center gap-2";

const categoryBadgeClass =
  "border border-[#D4AF37]/50 bg-black/60 text-white rounded-lg px-3 py-1 font-medium";

const stockBadgeClass =
  "border border-[#D4AF37]/60 bg-[#D4AF37]/15 text-[#D4AF37] rounded-lg px-3 py-1 font-semibold";

const metaGridClass = "grid gap-3 text-sm sm:grid-cols-2 rounded-xl border border-[#D4AF37]/30 bg-card p-4";

const metaItemClass = "space-y-1";

const metaLabelClass = "block text-xs uppercase tracking-wider text-muted-foreground";

const metaValueClass = "block font-medium text-white";

const priceBlockClass = "space-y-3";

const priceRowClass = "flex flex-wrap items-center gap-3";

const salePriceClass = "text-3xl font-semibold text-white";

const originalPriceClass = "text-lg text-muted-foreground line-through";

const actionButtonsClass = "flex flex-col gap-3 sm:flex-row";

const primaryButtonClass =
  "rounded-xl sm:flex-1 bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] transition-all shadow-md shadow-[#D4AF37]/20";

const secondaryButtonClass =
  "rounded-xl sm:flex-1 border border-[#D4AF37]/60 text-white hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all";

const iconClass = "mr-2 h-4 w-4";

type CustomerProductDetailsSummaryProps = {
  product: CustomerProduct;
  selectedColor: string;
  selectedSize: string;
  setSelectedColor: (value: string) => void;
  setSelectedSize: (value: ProductSize) => void;
  toggleWishlist: () => Promise<void>;
  isWishlistActive: boolean;
  onAddToCart: () => Promise<void>;
};

function CustomerProductDetailsSummary({
  product,
  selectedColor,
  selectedSize,
  setSelectedColor,
  setSelectedSize,
  toggleWishlist,
  isWishlistActive,
  onAddToCart,
}: CustomerProductDetailsSummaryProps) {
  const salePrice = extractSalePrice(product);
  const hasSale = product.salePercentage > 0;

  return (
    <section className={summaryWrapClass}>
      <div className={badgesWrapClass}>
        <Badge className={categoryBadgeClass}>{product?.category?.name}</Badge>

        {product?.stock > 0 ? (
          <Badge className={stockBadgeClass}>
            {product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
          </Badge>
        ) : (
          <Badge variant={"destructive"} className="rounded-lg">Out of stock</Badge>
        )}

        {hasSale ? (
          <Badge className={stockBadgeClass}>
            {product.salePercentage}% OFF
          </Badge>
        ) : null}
      </div>

      <div className={metaGridClass}>
        <p className={metaItemClass}>
          <span className={metaLabelClass}>Brand</span>
          <span className={metaValueClass}>{product?.brand}</span>
        </p>

        <p className={metaItemClass}>
          <span className={metaLabelClass}>Category</span>
          <span className={metaValueClass}>{product?.category?.name}</span>
        </p>
      </div>

      <div className={priceBlockClass}>
        <div className={priceRowClass}>
          <span className={salePriceClass}>{formatPrice(salePrice)}</span>
          {hasSale ? (
            <span className={originalPriceClass}>
              {formatPrice(product.price)}
            </span>
          ) : null}
        </div>

        {product.description ? (
          <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {product.description}
          </p>
        ) : null}
      </div>

      {product.colors && product.colors.length ? (
        <CustomerProductOptionsGroup
          values={product.colors}
          selectedValue={selectedColor}
          onSelect={setSelectedColor}
          variant="color"
        />
      ) : null}

      {/* FIXED: Check product.sizes.length instead of product.colors.length */}
      {product.sizes && product.sizes.length ? (
        <CustomerProductOptionsGroup
          values={product.sizes}
          selectedValue={selectedSize}
          onSelect={setSelectedSize}
          variant="size"
        />
      ) : null}

      <Separator className="bg-[#D4AF37]/30" />

      <div className={actionButtonsClass}>
        <Button
          type="button"
          className={primaryButtonClass}
          disabled={product.stock < 1}
          onClick={() => void onAddToCart()}
        >
          <ShoppingBag className={iconClass} />
          Add to Cart
        </Button>

        <Button
          type="button"
          variant="outline"
          className={secondaryButtonClass}
          onClick={() => void toggleWishlist()}
        >
          <Heart
            className={`${iconClass} ${isWishlistActive ? "fill-[#D4AF37] text-[#D4AF37]" : ""}`}
          />
          {isWishlistActive ? "Remove from Wishlist" : "Save to Wishlist"}
        </Button>
      </div>
    </section>
  );
}

export default CustomerProductDetailsSummary;
