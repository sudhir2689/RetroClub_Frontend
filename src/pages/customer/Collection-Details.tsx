import { Commonloader } from "@/components/common/Loader";
import CustomerProductDetailsGallery from "@/components/customer/products/details/customer-product-details-gallery";
import CustomerProductDetailsSummary from "@/components/customer/products/details/customer-product-details-summary";
import CustomerProductRelatedCard from "@/components/customer/products/details/customer-related-product-card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { useCustomerProductDetailsStore } from "@/features/customer/products/details/store";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { useAuth } from "@clerk/react";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const pageWrapClass = "min-h-screen bg-[#fafafa] text-black";
const heroSectionClass =
  "border-b border-[#D4AF37]/30 bg-white";
const heroContainerClass = "mx-auto max-w-7xl px-4 py-8";
const backButtonClass =
  "mb-4 rounded-xl border border-[#D4AF37] px-3 text-black hover:bg-[#D4AF37]/10 transition-colors";
const backIconClass = "mr-2 h-4 w-4";
const heroContentClass = "space-y-2";
const heroEyebrowClass = "text-sm uppercase tracking-[0.2em] text-[#997300] font-bold";
const heroTitleClass =
  "max-w-3xl text-3xl font-bold tracking-tight text-black md:text-4xl";
const contentContainerClass = "mx-auto max-w-7xl px-4 py-8";
const contentGridClass = "grid gap-8 lg:grid-cols-[1.05fr_0.95fr]";
const relatedSectionClass = "mt-16 space-y-6";
const relatedHeadingWrapClass = "space-y-1";
const relatedEyebrowClass = "text-sm uppercase tracking-[0.18em] text-[#997300] font-bold";
const relatedTitleClass =
  "text-2xl font-bold tracking-tight text-black";
const relatedGridClass = "grid gap-5 sm:grid-cols-2 xl:grid-cols-4";

function CollectionDetails() {
  const { id = "" } = useParams();
  const { isLoaded, isSignedIn } = useAuth();
  const { isBootstrapped } = useAuthStore();

  const {
    loadProduct,
    clear,
    data,
    selectedImage,
    setSelectedImage,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    toggleWishlist,
    addToCart,
  } = useCustomerProductDetailsStore((state) => state);

  const wishlistItems = useCustomerWishlistStore((state) => state.items);

  const product = data?.product ?? null;
  const relatedProducts = data?.relatedProducts ?? [];
  const isWishlistActive = !!product
    ? wishlistItems.some((item) => item.productId === product._id)
    : false;

  useEffect(() => {
    // Redirect to top of the page whenever a product is selected
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    void loadProduct(id);

    return () => {
      clear();
    };
  }, [clear, id, loadProduct]);

  if (!product) return <Commonloader />;

  return (
    <div className={pageWrapClass}>
      <section className={heroSectionClass}>
        <div className={heroContainerClass}>
          <Button asChild variant="ghost" className={backButtonClass}>
            <Link to="/collections">
              <ArrowLeft className={backIconClass} />
              Back to Collections
            </Link>
          </Button>
          <div className={heroContentClass}>
            <p className={heroEyebrowClass}>{product?.brand}</p>
            <h1 className={heroTitleClass}>{product?.title}</h1>
          </div>
        </div>
      </section>

      <div className={contentContainerClass}>
        <div className={contentGridClass}>
          <CustomerProductDetailsGallery
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          <CustomerProductDetailsSummary
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            setSelectedColor={setSelectedColor}
            setSelectedSize={setSelectedSize}
            toggleWishlist={() =>
              toggleWishlist(
                isLoaded,
                isBootstrapped,
                Boolean(isSignedIn),
                isWishlistActive,
              )
            }
            isWishlistActive={isWishlistActive}
            onAddToCart={() =>
              addToCart(isLoaded, isBootstrapped, Boolean(isSignedIn))
            }
          />
        </div>

        {relatedProducts.length ? (
          <section className={relatedSectionClass}>
            <div className={relatedHeadingWrapClass}>
              <p className={relatedEyebrowClass}>You may also like</p>
              <h2 className={relatedTitleClass}>Related Products</h2>
            </div>

            <div className={relatedGridClass}>
              {relatedProducts.map((item) => (
                <CustomerProductRelatedCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default CollectionDetails;
