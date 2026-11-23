import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  extractSalePrice,
  getCoverImage,
  getSwatchColor,
} from "@/features/customer/products/product-list.shared";
import type { CustomerProduct } from "@/features/customer/products/types";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";

const cardClass =
  "group overflow-hidden rounded-2xl border border-[#D4AF37]/50 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg";

const linkClass = "block";

const imageWrapClass = "relative aspect-[4/5] bg-zinc-100 overflow-hidden border-b border-[#D4AF37]/20";

const imageClass =
  "h-full w-full object-cover transition duration-500 group-hover:scale-105";

const noImageClass =
  "flex h-full items-center justify-center text-sm text-zinc-400";

const saleBadgeClass =
  "absolute left-3 top-3 border border-[#D4AF37] bg-white text-black rounded-lg px-2.5 py-0.5 text-xs font-bold shadow-xs";

const contentClass = "space-y-4 p-5";

const detailsWrapClass = "space-y-1.5";

const brandClass = "text-xs font-bold uppercase tracking-[0.18em] text-[#997300]";

const titleClass = "line-clamp-1 text-base font-bold text-black group-hover:text-[#997300] transition-colors";

const categoryClass = "text-xs text-zinc-500";

const priceRowClass = "flex items-baseline gap-2.5 pt-1";

const salePriceClass = "text-lg font-bold text-black";

const originalPriceClass = "text-xs text-zinc-400 line-through";

const colorsWrapClass = "flex items-center gap-1.5";

const colorSwatchClass = "h-4 w-4 rounded-full border border-zinc-300";

const extraColorsClass = "text-xs text-zinc-500";

const footerClass = "flex items-center justify-between gap-3 pt-2";

const buttonClass =
  "w-full rounded-xl border border-[#D4AF37] bg-white text-black font-bold hover:bg-[#D4AF37] transition-all text-xs h-9 shadow-xs";

type CustomerProductCardProps = {
  product: CustomerProduct;
};

function CustomerProductCard({ product }: CustomerProductCardProps) {
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

          {hasSale ? (
            <Badge className={saleBadgeClass}>
              {product.salePercentage}% OFF
            </Badge>
          ) : null}
        </div>

        <CardContent className={contentClass}>
          <div className={detailsWrapClass}>
            <p className={brandClass}>{product.brand}</p>
            <p className={titleClass}>{product.title}</p>
            <p className={categoryClass}>{product.category?.name}</p>
          </div>

          <div className={priceRowClass}>
            <span className={salePriceClass}>{formatPrice(salePrice)}</span>
            {hasSale ? (
              <span className={originalPriceClass}>
                {formatPrice(product.price)}
              </span>
            ) : null}
          </div>

          {product.colors.length ? (
            <div className={colorsWrapClass}>
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className={colorSwatchClass}
                  style={{ backgroundColor: getSwatchColor(color) }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 ? (
                <span className={extraColorsClass}>
                  +{product.colors.length - 4}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className={footerClass}>
            <Button className={buttonClass}>View Details</Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export default CustomerProductCard;
