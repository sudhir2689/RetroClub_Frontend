import { Card } from "@/components/ui/card";
import { getCoverImage } from "@/features/customer/products/product-list.shared";
import type { CustomerProduct } from "@/features/customer/products/types";

type CustomerProductDetailsGalleryProps = {
  product: CustomerProduct;
  selectedImage: string;
  setSelectedImage: (value: string) => void;
};

const galleryWrapClass = "space-y-4";

const mainImageCardClass =
  "overflow-hidden rounded-2xl border border-[#D4AF37] bg-white shadow-md";

const mainImageWrapClass = "aspect-[4/5] bg-zinc-100";

const imageClass = "h-full w-full object-cover transition-all duration-500";

const noImageClass =
  "flex h-full items-center justify-center text-sm text-zinc-400";

const thumbnailsGridClass = "grid grid-cols-4 gap-3 sm:grid-cols-5";

const thumbnailButtonBaseClass =
  "overflow-hidden rounded-xl border bg-white transition-all duration-300";

const thumbnailButtonActiveClass =
  "border-[#D4AF37] ring-2 ring-[#D4AF37]/40 scale-105";

const thumbnailButtonInactiveClass =
  "border-[#D4AF37]/30 hover:border-[#D4AF37]/70 opacity-70 hover:opacity-100";

function CustomerProductDetailsGallery({
  product,
  selectedImage,
  setSelectedImage,
}: CustomerProductDetailsGalleryProps) {
  const galleryImages = product.images || [];
  const displayImage = selectedImage || getCoverImage(product);

  return (
    <div className={galleryWrapClass}>
      <Card className={mainImageCardClass}>
        <div className={mainImageWrapClass}>
          {displayImage ? (
            <img
              src={displayImage}
              alt={product.title}
              className={imageClass}
            />
          ) : (
            <div className={noImageClass}>No Image</div>
          )}
        </div>
      </Card>

      {galleryImages.length ? (
        <div className={thumbnailsGridClass}>
          {galleryImages.map((item) => {
            const isActive = displayImage === item.url;

            return (
              <button
                key={item.publicId}
                type="button"
                className={`${thumbnailButtonBaseClass} ${
                  isActive
                    ? thumbnailButtonActiveClass
                    : thumbnailButtonInactiveClass
                }`}
                onClick={() => setSelectedImage(item.url)}
              >
                <div className="aspect-square bg-black">
                  <img
                    src={item.url}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default CustomerProductDetailsGallery;
