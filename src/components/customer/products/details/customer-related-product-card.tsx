import { Card, CardContent } from "@/components/ui/card";
import {
  extractSalePrice,
  getCoverImage,
} from "@/features/customer/products/product-list.shared";
import type { CustomerProduct } from "@/features/customer/products/types";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";

const cardClass =
  "group overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-[#0d0d0d] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-xl hover:shadow-[#D4AF37]/10";

const linkClass = "block";

const imageWrapClass = "aspect-[4/5] bg-black overflow-hidden border-b border-[#D4AF37]/20";

const imageClass = "h-full w-full object-cover transition-all duration-500 group-hover:scale-105";

const noImageClass =
  "flex h-full items-center justify-center text-sm text-muted-foreground";

const contentClass = "space-y-2 p-4";

const brandClass = "text-xs uppercase tracking-[0.18em] text-[#D4AF37] font-semibold";

const titleClass = "line-clamp-1 text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors";

const priceRowClass = "flex items-center gap-2 pt-1";

const salePriceClass = "font-semibold text-white";

const originalPriceClass = "text-sm text-muted-foreground line-through";

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
