import { Card, CardContent } from "@/components/ui/card";
import {
  extractSalePrice,
  getCoverImage,
} from "@/features/customer/products/product-list.shared";
import type { CustomerProduct } from "@/features/customer/products/types";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";

const cardClass =
  "group overflow-hidden rounded-2xl border border-[#D4AF37]/50 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg";

const linkClass = "block";

const imageWrapClass = "aspect-[4/5] bg-zinc-100 overflow-hidden border-b border-[#D4AF37]/20";

const imageClass = "h-full w-full object-cover transition-all duration-500 group-hover:scale-105";

const noImageClass =
  "flex h-full items-center justify-center text-sm text-zinc-400";

const contentClass = "space-y-2 p-4";

const brandClass = "text-xs uppercase tracking-[0.18em] text-[#997300] font-bold";

const titleClass = "line-clamp-1 text-base font-bold text-black group-hover:text-[#997300] transition-colors";

const priceRowClass = "flex items-center gap-2 pt-1";

const salePriceClass = "font-bold text-black text-base";

const originalPriceClass = "text-xs text-zinc-400 line-through";

type CustomerProductRelatedCardProps = {
  product: CustomerProduct;
};

function CustomerProductRelatedCard({
  product,
}: CustomerProductRelatedCardProps) {
  const coverImage = getCoverImage(product);
  const salePrice = extractSalePrice(product);
  const hasSale = product.salePercentage > 0;

  return (
    <Card className={cardClass}>
      <Link to={`/collection/${product._id}`} className={linkClass}>
        <div className={imageWrapClass}>
          {coverImage ? (
            <img src={coverImage} alt={product.title} className={imageClass} />
          ) : (
            <div className={noImageClass}>No Image</div>
          )}
        </div>

        <CardContent className={contentClass}>
          <p className={brandClass}>{product.brand}</p>
          <h3 className={titleClass}>{product.title}</h3>

          <div className={priceRowClass}>
            <span className={salePriceClass}>{formatPrice(salePrice)}</span>
            {hasSale ? (
              <span className={originalPriceClass}>
                {formatPrice(product.price)}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export default CustomerProductRelatedCard;
