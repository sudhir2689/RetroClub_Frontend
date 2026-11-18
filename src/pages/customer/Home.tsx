import { Commonloader } from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomerHomeStore } from "@/features/customer/home/store";
import { formatPrice } from "@/lib/utils";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Sparkles,
  TicketPercent,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const pageWrapClass =
  "min-h-screen bg-black text-foreground antialiased selection:bg-[#D4AF37]/30";
const contentContainerClass = "mx-auto max-w-7xl px-4 py-0 sm:px-6 lg:px-8";
const sectionStackClass = "space-y-16 sm:space-y-20";

const sectionHeadClass = "mb-8 sm:mb-10 space-y-2";
const sectionEyebrowClass =
  "text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]";
const sectionTitleClass =
  "text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl";

// Amazon-style Banner Carousel classes
const carouselWrapClass =
  "relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[#D4AF37]/50 bg-black shadow-2xl shadow-black/80";
const carouselHeightClass =
  "relative h-[220px] sm:h-[340px] md:h-[440px] lg:h-[500px] xl:h-[540px] w-full overflow-hidden";
const bannerImageClass =
  "h-full w-full object-cover object-center transition-all duration-700";

const navArrowClass =
  "absolute top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-black/70 text-[#D4AF37] backdrop-blur-md transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:scale-110 active:scale-95";

const dotsContainerClass =
  "absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-black/60 px-3 py-1.5 backdrop-blur-md";
const dotClass =
  "h-2 rounded-full transition-all duration-300 cursor-pointer";
const dotActive = "w-7 bg-[#D4AF37] shadow-sm shadow-[#D4AF37]";
const dotInactive = "w-2 bg-white/40 hover:bg-white/70";

// Product Section Classes (placed immediately below banner)
const productGridClass = "grid gap-6 sm:grid-cols-2 xl:grid-cols-4";
const productCardClass =
  "group flex h-full flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-[#0d0d0d] p-2 transition-all duration-500 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-xl hover:shadow-[#D4AF37]/10";
const productContentClass =
  "flex flex-1 flex-col justify-between space-y-4 p-4";
const productImageWrapClass =
  "relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-black border border-[#D4AF37]/20";
const productImageClass =
  "h-full w-full object-cover transition-all duration-700 group-hover:scale-105";
const productInfoWrapClass = "space-y-2";
const productBrandRowClass = "flex items-center justify-between gap-3";
const productBrandClass =
  "text-xs font-semibold uppercase tracking-wider text-[#D4AF37]";
const productTitleClass =
  "line-clamp-2 text-base font-medium leading-relaxed text-white transition-colors group-hover:text-[#D4AF37]";
const productPriceRowClass = "flex items-end justify-between gap-3 pt-2";
const productPriceClass =
  "text-xl font-semibold tracking-tight text-white";
const productOriginalPriceClass =
  "text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/50";
const productViewClass =
  "inline-flex h-8 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 text-xs font-semibold text-[#D4AF37] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-[#D4AF37] group-hover:text-black";

// Category Classes
const categoryGridClass = "grid gap-6 sm:grid-cols-2 xl:grid-cols-4";
const categoryCardClass =
  "group relative overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-[#0d0d0d] p-1.5 transition-all duration-500 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-xl hover:shadow-[#D4AF37]/10";
const categoryContentClass =
  "h-full space-y-5 rounded-xl bg-gradient-to-br from-black/80 to-[#141414] p-8 backdrop-blur-sm transition-colors duration-500 group-hover:bg-black/90";
const categoryIconWrapClass =
  "flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] ring-1 ring-[#D4AF37]/20 transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black";
const categoryIconClass = "h-6 w-6";
const categoryTextWrapClass = "space-y-2";
const categoryTitleClass = "text-xl font-medium tracking-tight text-white";
const categoryLinkClass =
  "inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] transition-colors group-hover:text-[#e5c158]";
const categoryArrowIconClass =
  "h-4 w-4 transition-transform group-hover:translate-x-1";

// Coupon Classes
const couponGridClass = "grid gap-6 md:grid-cols-2 xl:grid-cols-4";
const couponCardClass =
  "group relative overflow-hidden rounded-2xl border border-dashed border-[#D4AF37]/50 bg-black/60 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/[0.03]";
const couponContentClass = "space-y-6 p-8";
const couponHeadClass = "flex items-start justify-between gap-4";
const couponIconWrapClass =
  "flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#D4AF37] transition-transform duration-500 group-hover:rotate-12";
const couponIconClass = "h-6 w-6";
const couponCodeClass = "text-2xl font-bold tracking-widest text-[#D4AF37]";
const couponBadgeClass =
  "border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-3 py-1 text-sm font-semibold text-[#D4AF37]";
const couponCodeWrapClass = "space-y-1 pt-2";
const couponCodeLabelClass =
  "text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground";

export function StoreHome() {
  const { data, loading, loadHome } = useCustomerHomeStore((state) => state);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    void loadHome();
  }, [loadHome]);

  const banners = data.banners || [];
  const bannerCount = banners.length;

  const nextSlide = useCallback(() => {
    if (bannerCount > 0) {
      setCurrentSlide((prev) => (prev + 1) % bannerCount);
    }
  }, [bannerCount]);

  const prevSlide = useCallback(() => {
    if (bannerCount > 0) {
      setCurrentSlide((prev) => (prev - 1 + bannerCount) % bannerCount);
    }
  }, [bannerCount]);

  // Amazon-style auto-slide every 4.5 seconds
  useEffect(() => {
    if (bannerCount <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [bannerCount, isPaused, nextSlide]);

  if (loading) {
    return <Commonloader />;
  }

  return (
    <div className={pageWrapClass}>
      <div className={contentContainerClass}>
        <div className={sectionStackClass}>
          {/* 1. Amazon-Style Hero Banner Carousel */}
          {bannerCount > 0 ? (
            <section
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className={carouselWrapClass}>
                <div className={carouselHeightClass}>
                  {banners.map((banner, index) => {
                    const isCurrent = index === currentSlide;
                    const destinationUrl = banner.productId
                      ? `/collection/${banner.productId}`
                      : banner.linkUrl || "/collections";

                    return (
                      <div
                        key={banner._id || index}
                        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${
                          isCurrent
                            ? "opacity-100 z-10 pointer-events-auto"
                            : "opacity-0 z-0 pointer-events-none"
                        }`}
                      >
                        <Link
                          to={destinationUrl}
                          className="group relative block h-full w-full overflow-hidden cursor-pointer"
                        >
                          <img
                            src={banner.imageUrl}
                            alt={banner.title || "Featured banner"}
                            className={bannerImageClass}
                          />

                          {/* Gradient Overlays for Amazon-style depth */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />

                          {/* Title / Action Pill Overlay */}
                          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-10 sm:right-10 z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                            {banner.title ? (
                              <div className="space-y-1 bg-black/60 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-[#D4AF37]/30 max-w-md">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                                  <Sparkles className="h-3.5 w-3.5" /> Featured
                                </span>
                                <h3 className="text-lg sm:text-2xl font-semibold text-white line-clamp-1">
                                  {banner.title}
                                </h3>
                              </div>
                            ) : null}

                            <span className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full border border-[#D4AF37] bg-[#D4AF37] px-5 py-2 text-xs sm:text-sm font-semibold text-black transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-black/50">
                              {banner.productId ? "Shop Product Now" : "Explore Collection"}
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* Left/Right Navigation Arrows (if > 1 banner) */}
                {bannerCount > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous Banner"
                      onClick={(e) => {
                        e.preventDefault();
                        prevSlide();
                      }}
                      className={`${navArrowClass} left-3 sm:left-5`}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                      type="button"
                      aria-label="Next Banner"
                      onClick={(e) => {
                        e.preventDefault();
                        nextSlide();
                      }}
                      className={`${navArrowClass} right-3 sm:right-5`}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Slide Dots Indicator */}
                    <div className={dotsContainerClass}>
                      {banners.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          aria-label={`Go to slide ${dotIdx + 1}`}
                          onClick={() => setCurrentSlide(dotIdx)}
                          className={`${dotClass} ${
                            dotIdx === currentSlide ? dotActive : dotInactive
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* 2. Products Section (NOW IMMEDIATELY BELOW THE BANNER AS REQUESTED) */}
          {!!data.recentProducts.length ? (
            <section>
              <div className={sectionHeadClass}>
                <p className={sectionEyebrowClass}>Latest Arrivals</p>
                <h2 className={sectionTitleClass}>Featured Products</h2>
              </div>
              <div className={productGridClass}>
                {data.recentProducts.slice(0, 8).map((product) => (
                  <Link to={`/collection/${product._id}`} key={product._id}>
                    <Card className={productCardClass}>
                      <CardContent className={productContentClass}>
                        <div className={productImageWrapClass}>
                          <img
                            src={product.image}
                            alt={product.title}
                            className={productImageClass}
                          />
                        </div>
                        <div className={productInfoWrapClass}>
                          <div className={productBrandRowClass}>
                            <p className={productBrandClass}>{product.brand}</p>
                          </div>
                          <p className={productTitleClass}>{product.title}</p>
                        </div>

                        <div className={productPriceRowClass}>
                          <div>
                            <p className={productPriceClass}>
                              {formatPrice(product.finalPrice)}
                            </p>
                            {product.salePercentage > 0 ? (
                              <p className={productOriginalPriceClass}>
                                {formatPrice(product.price)}
                              </p>
                            ) : null}
                          </div>

                          <span className={productViewClass}>View</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* 3. Categories Section */}
          {!!data.categories.length ? (
            <section>
              <div className={sectionHeadClass}>
                <p className={sectionEyebrowClass}>Categories</p>
                <h2 className={sectionTitleClass}>Browse by collection</h2>
              </div>

              <div className={categoryGridClass}>
                {data.categories.slice(0, 4).map((categoryItem) => (
                  <Link
                    key={categoryItem._id}
                    to={`/collections?category=${categoryItem._id}`}
                  >
                    <Card className={categoryCardClass}>
                      <CardContent className={categoryContentClass}>
                        <div className={categoryIconWrapClass}>
                          <Grid2X2 className={categoryIconClass} />
                        </div>
                        <div className={categoryTextWrapClass}>
                          <p className={categoryTitleClass}>
                            {categoryItem.name}
                          </p>
                        </div>

                        <span className={categoryLinkClass}>
                          View Collection
                          <ArrowRight className={categoryArrowIconClass} />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* 4. Live Offers & Coupons Section */}
          {!!data.coupons.length ? (
            <section>
              <div className={sectionHeadClass}>
                <p className={sectionEyebrowClass}>Special Offers</p>
                <h2 className={sectionTitleClass}>Live Coupon Codes</h2>
              </div>

              <div className={couponGridClass}>
                {data.coupons.slice(0, 4).map((coupon) => (
                  <Card key={coupon.code} className={couponCardClass}>
                    <CardContent className={couponContentClass}>
                      <div className={couponHeadClass}>
                        <div className={couponIconWrapClass}>
                          <TicketPercent className={couponIconClass} />
                        </div>
                        <Badge className={couponBadgeClass}>
                          {coupon.percentage}% OFF
                        </Badge>
                      </div>

                      <div className={couponCodeWrapClass}>
                        <p className={couponCodeLabelClass}>Coupon Code</p>
                        <p className={couponCodeClass}>{coupon.code}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default StoreHome;
