import AdminSettingsBannersTable from "@/components/admin/settings/admin-settings-banner-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminSettings } from "@/features/admin/settings/use-admin-settings";
import { getCoverImage } from "@/features/customer/products/product-list.shared";
import { formatPrice } from "@/lib/utils";
import { ImagePlus, Package, RefreshCw } from "lucide-react";

const pageWrapClass = "min-h-screen bg-background text-foreground";
const contentContainerClass = "mx-auto max-w-7xl px-4 py-8 space-y-8";
const uploadPanelClass = "grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]";

const cardClass =
  "border border-[#D4AF37]/40 bg-card rounded-2xl shadow-lg shadow-black/40 overflow-hidden";
const cardTitleClass = "text-xl font-semibold text-foreground flex items-center gap-2";
const cardContentClass = "space-y-6 p-6";

const tabButtonBase =
  "flex-1 py-2.5 px-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300";
const tabActive =
  "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 border border-[#D4AF37]";
const tabInactive =
  "bg-transparent text-muted-foreground hover:text-white border border-transparent";

const uploadBoxClass =
  "flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#D4AF37]/50 bg-black/40 p-6 text-center hover:border-[#D4AF37] transition-colors";
const uploadIconWrapClass =
  "flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10";
const uploadIconClass = "h-6 w-6 text-[#D4AF37]";
const fileInputClass =
  "cursor-pointer rounded-xl border border-[#D4AF37]/40 bg-black/60 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#D4AF37] file:text-black file:font-semibold file:text-xs";
const fullButtonClass =
  "w-full rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] transition-colors";
const buttonClass =
  "rounded-xl border border-[#D4AF37]/50 text-foreground hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-colors";

const emptyStateClass =
  "rounded-xl border border-[#D4AF37]/30 bg-black/40 p-8 text-center text-sm text-muted-foreground";
const tableHeaderClass = "flex flex-row items-center justify-between gap-3 p-6 border-b border-[#D4AF37]/20";

function AdminSettings() {
  const {
    items,
    products,
    files,
    setFiles,
    fileCountLabel,
    loading,
    refreshBanners,
    handleUpload,
    handleAddProductBanner,
    handleDelete,
    uploading,
    deletingId,
    selectedProductId,
    setSelectedProductId,
    bannerTitle,
    setBannerTitle,
    activeTab,
    setActiveTab,
  } = useAdminSettings();

  const selectedProduct = products.find((p) => p._id === selectedProductId);

  return (
    <div className={pageWrapClass}>
      <div className={contentContainerClass}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Banner Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure homepage Amazon-style hero carousel banners with image upload or direct product linking.
          </p>
        </div>

        <div className={uploadPanelClass}>
          {/* Create Banner Form */}
          <Card className={cardClass}>
            <CardHeader className="border-b border-[#D4AF37]/20 p-6">
              <CardTitle className={cardTitleClass}>
                <ImagePlus className="h-5 w-5 text-[#D4AF37]" />
                Add New Banner
              </CardTitle>

              {/* Mode Toggle Tabs */}
              <div className="mt-4 flex rounded-xl border border-[#D4AF37]/30 bg-black/60 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("image")}
                  className={`${tabButtonBase} ${activeTab === "image" ? tabActive : tabInactive}`}
                >
                  Image Upload
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("product")}
                  className={`${tabButtonBase} ${activeTab === "product" ? tabActive : tabInactive}`}
                >
                  Select Product
                </button>
              </div>
            </CardHeader>

            <CardContent className={cardContentClass}>
              {activeTab === "image" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Banner Image(s)
                    </Label>
                    <div className={uploadBoxClass}>
                      <div className={uploadIconWrapClass}>
                        <ImagePlus className={uploadIconClass} />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        Drag or browse images
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        className={fileInputClass}
                        onChange={(event) =>
                          setFiles(Array.from(event.target.files || []))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {fileCountLabel}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Headline / Caption (Optional)
                    </Label>
                    <Input
                      placeholder="e.g. Vintage Winter Collection"
                      value={bannerTitle}
                      onChange={(e) => setBannerTitle(e.target.value)}
                      className="rounded-xl border border-[#D4AF37]/40 bg-black/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Link To Product (Optional)
                    </Label>
                    <Select
                      value={selectedProductId}
                      onValueChange={setSelectedProductId}
                    >
                      <SelectTrigger className="rounded-xl border border-[#D4AF37]/40 bg-black/40">
                        <SelectValue placeholder="No product link (Standalone)" />
                      </SelectTrigger>
                      <SelectContent className="border border-[#D4AF37]/40 bg-black text-white">
                        <SelectItem value="none">
                          No product link (Standalone banner)
                        </SelectItem>
                        {products.map((prod) => (
                          <SelectItem key={prod._id} value={prod._id}>
                            {prod.title} — {formatPrice(prod.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className={fullButtonClass}
                    disabled={uploading || !files.length}
                    onClick={() => handleUpload()}
                  >
                    {uploading ? "Uploading Banners..." : "Upload & Save Banner"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Choose Product to Feature
                    </Label>
                    <Select
                      value={selectedProductId}
                      onValueChange={setSelectedProductId}
                    >
                      <SelectTrigger className="rounded-xl border border-[#D4AF37]/40 bg-black/40">
                        <SelectValue placeholder="Select a product..." />
                      </SelectTrigger>
                      <SelectContent className="border border-[#D4AF37]/40 bg-black text-white max-h-72">
                        {products.map((prod) => (
                          <SelectItem key={prod._id} value={prod._id}>
                            {prod.title} ({prod.brand}) — {formatPrice(prod.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedProduct ? (
                    <div className="flex items-center gap-4 rounded-xl border border-[#D4AF37]/40 bg-black/60 p-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg border border-[#D4AF37]/50 bg-black shrink-0">
                        <img
                          src={getCoverImage(selectedProduct as any)}
                          alt={selectedProduct.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                          {selectedProduct.brand}
                        </p>
                        <p className="text-sm font-medium text-white truncate">
                          {selectedProduct.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(selectedProduct.price)} • Stock: {selectedProduct.stock}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#D4AF37]/30 bg-black/20 p-6 text-center text-xs text-muted-foreground">
                      <Package className="mx-auto h-8 w-8 text-[#D4AF37]/60 mb-2" />
                      Select a product above to preview and create a banner. When users click this banner on the homepage, they will be taken directly to this product!
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Custom Banner Title (Optional)
                    </Label>
                    <Input
                      placeholder={selectedProduct?.title || "Banner title"}
                      value={bannerTitle}
                      onChange={(e) => setBannerTitle(e.target.value)}
                      className="rounded-xl border border-[#D4AF37]/40 bg-black/40"
                    />
                  </div>

                  <Button
                    className={fullButtonClass}
                    disabled={uploading || !selectedProductId}
                    onClick={() => handleAddProductBanner()}
                  >
                    {uploading ? "Creating Banner..." : "Set Product as Banner"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Banners List with Delete option */}
          <Card className={cardClass}>
            <CardHeader className={tableHeaderClass}>
              <div>
                <CardTitle className={cardTitleClass}>
                  Current Banners ({items.length})
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  These banners cycle automatically on the homepage hero carousel.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className={buttonClass}
                onClick={() => refreshBanners()}
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              {!items.length ? (
                <div className={emptyStateClass}>
                  <p className="text-base font-semibold text-white mb-1">
                    No banners uploaded yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upload an image or select a product from the form to create your first homepage banner.
                  </p>
                </div>
              ) : (
                <AdminSettingsBannersTable
                  items={items}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
