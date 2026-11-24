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
  "min-h-screen bg-[#fafafa] text-black antialiased selection:bg-[#D4AF37]/30";
const contentContainerClass = "mx-auto max-w-7xl px-4 py-0 sm:px-6 lg:px-8";
const sectionStackClass = "space-y-16 sm:space-y-20";

const sectionHeadClass = "mb-8 sm:mb-10 space-y-2";
const sectionEyebrowClass =
  "text-xs font-bold uppercase tracking-[0.3em] text-[#997300]";
const sectionTitleClass =
  "text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl";

// Banner Carousel classes
const carouselWrapClass =
  "relative mx-auto w-full max-w-xl md:max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl border border-[#D4AF37] bg-black shadow-xl shadow-black/30";
const carouselHeightClass =
  "relative h-[320px] sm:h-[400px] md:h-[480px] lg:h-[520px] w-full overflow-hidden flex items-center justify-center";
const bannerImageClass =
  "relative z-10 h-full w-full object-contain object-center p-3 sm:p-5 transition-transform duration-500 group-hover:scale-105";

const navArrowClass =
  "absolute top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-black/80 text-[#D4AF37] backdrop-blur-md transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:scale-110 active:scale-95 shadow-md shadow-black/60";

const dotClass =
  "h-2 rounded-full transition-all duration-300 cursor-pointer";
const dotActive = "w-6 bg-[#D4AF37] shadow-xs";
const dotInactive = "w-2 bg-zinc-300 hover:bg-zinc-400";

// Product Section Classes (placed immediately below banner)
const productGridClass = "grid gap-6 sm:grid-cols-2 xl:grid-cols-4";
const productCardClass =
  "group flex h-full flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/50 bg-white p-2 transition-all duration-500 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg";
const productContentClass =
  "flex flex-1 flex-col justify-between space-y-4 p-4";
const productImageWrapClass =
  "relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-zinc-100 border border-[#D4AF37]/20";
const productImageClass =
  "h-full w-full object-cover transition-all duration-700 group-hover:scale-105";
const productInfoWrapClass = "space-y-2";
const productBrandRowClass = "flex items-center justify-between gap-3";
const productBrandClass =
  "text-xs font-bold uppercase tracking-wider text-[#997300]";
const productTitleClass =
  "line-clamp-2 text-base font-bold leading-relaxed text-black transition-colors group-hover:text-[#997300]";
const productPriceRowClass = "flex items-end justify-between gap-3 pt-2";
const productPriceClass =
  "text-xl font-bold tracking-tight text-black";
const productOriginalPriceClass =
  "text-sm font-medium text-zinc-400 line-through decoration-zinc-400/50";
const productViewClass =
  "inline-flex h-8 items-center justify-center rounded-full border border-[#D4AF37] bg-white px-4 text-xs font-bold text-black opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-[#D4AF37]";

// Category Classes
const categoryGridClass = "grid gap-6 sm:grid-cols-2 xl:grid-cols-4";
const categoryCardClass =
  "group relative overflow-hidden rounded-2xl border border-[#D4AF37]/50 bg-white p-1.5 transition-all duration-500 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg";
const categoryContentClass =
  "h-full space-y-5 rounded-xl bg-white p-8 transition-colors duration-500";
const categoryIconWrapClass =
  "flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37] bg-[#D4AF37]/10 text-[#997300] ring-1 ring-[#D4AF37]/20 transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black";
const categoryIconClass = "h-6 w-6";
const categoryTextWrapClass = "space-y-2";
const categoryTitleClass = "text-xl font-bold tracking-tight text-black";
const categoryLinkClass =
  "inline-flex items-center gap-2 text-sm font-bold text-[#997300] transition-colors group-hover:text-black";
const categoryArrowIconClass =
  "h-4 w-4 transition-transform group-hover:translate-x-1";

// Coupon Classes
const couponGridClass = "grid gap-6 md:grid-cols-2 xl:grid-cols-4";
const couponCardClass =
  "group relative overflow-hidden rounded-2xl border border-[#D4AF37] bg-white transition-all duration-300 hover:shadow-md";
const couponContentClass = "space-y-6 p-8";
const couponHeadClass = "flex items-start justify-between gap-4";
const couponIconWrapClass =
  "flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37] bg-[#D4AF37]/15 text-[#997300] transition-transform duration-500 group-hover:rotate-12";
const couponIconClass = "h-6 w-6";
const couponCodeClass = "text-2xl font-black tracking-widest text-[#997300]";
const couponBadgeClass =
  "border border-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 text-sm font-bold text-black";
const couponCodeWrapClass = "space-y-1 pt-2";
const couponCodeLabelClass =
  "text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500";

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
                          {/* Ambient blurred backdrop to softly fill sides */}
                          <img
                            src={banner.imageUrl}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-20 scale-125 pointer-events-none"
                          />

                          {/* Gradient Overlays for depth */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20 pointer-events-none z-10" />

                          {/* Full t-shirt image, perfectly contained without cropping */}
                          <img
                            src={banner.imageUrl}
                            alt={banner.title || "Featured banner"}
                            className={bannerImageClass}
                          />

                          {/* Title / Action Pill Overlay */}
                          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                            {banner.title ? (
                              <div className="space-y-0.5 bg-black/75 backdrop-blur-md px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-[#D4AF37]/40 max-w-[280px] sm:max-w-sm">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                                  <Sparkles className="h-3 w-3" /> Featured
                                </span>
                                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                                  {banner.title}
                                </h3>
                              </div>
                            ) : null}

                            <span className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-[#D4AF37] bg-[#D4AF37] px-4 py-2 text-xs sm:text-sm font-bold text-black transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-black/50">
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
                      className={`${navArrowClass} left-3 sm:left-4`}
                    >
                      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>

                    <button
                      type="button"
                      aria-label="Next Banner"
                      onClick={(e) => {
                        e.preventDefault();
                        nextSlide();
                      }}
                      className={`${navArrowClass} right-3 sm:right-4`}
                    >
                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </>
                ) : null}
              </div>

              {/* Slide Dots Indicator placed below carousel */}
              {bannerCount > 1 ? (
                <div className="mt-3.5 flex items-center justify-center gap-2">
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
              ) : null}
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
