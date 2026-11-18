import { Commonloader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboardLiteStore } from "@/features/admin/dashboard/store";
import { useAdminProducts } from "@/features/admin/products/use-admin-products";
import { ProductDialog } from "@/components/admin/products/product-dialog";
import { CategoryDialog } from "@/components/admin/products/category-dialog";
import { formatPrice } from "@/lib/utils";
import {
  Boxes,
  FolderPlus,
  ImagePlus,
  IndianRupee,
  Layers3,
  Package,
  PackageCheck,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const statsItems = [
  {
    key: "totalProducts",
    label: "Total Products",
    icon: Boxes,
  },
  {
    key: "totalCategories",
    label: "Total Categories",
    icon: Layers3,
  },
  {
    key: "totalSales",
    label: "Total Sales",
    icon: IndianRupee,
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: PackageCheck,
  },
  {
    key: "totalReturnedOrders",
    label: "Returned Orders",
    icon: RotateCcw,
  },
] as const;

const pageWrapClass = "min-h-screen bg-black text-foreground";
const contentWrapClass = "mx-auto max-w-6xl space-y-8";

const headerCardClass =
  "rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-r from-black via-[#141414] to-black p-6 shadow-xl shadow-black/60";

const gridClass = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

const statCardClass =
  "group rounded-2xl border border-[#D4AF37]/40 bg-[#0d0d0d] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-xl hover:shadow-[#D4AF37]/10";

const statContentClass = "flex items-start gap-4 p-6";

const iconWrapClass =
  "flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black";

const statLabelClass = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";

const statValueClass = "mt-1 text-2xl font-bold tracking-tight text-white";

function AdminDashboard() {
  const { loading, fetchDashboard, stats, hasLoaded } =
    useAdminDashboardLiteStore((state) => state);

  const {
    categories,
    categoryDialogOpen,
    setcategoryDialogOpen,
    productDialogOpen,
    setProductDialogOpen,
    editingProduct,
    openCreateDialog,
    closeProductDialog,
    refreshAll,
  } = useAdminProducts();

  useEffect(() => {
    if (!hasLoaded) {
      void fetchDashboard();
    }
  }, [fetchDashboard, hasLoaded]);

  return (
    <div className={pageWrapClass}>
      <div className={contentWrapClass}>
        {/* Welcome & Mobile Quick Add Product Card */}
        <div className={headerCardClass}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                <Sparkles className="h-3.5 w-3.5" /> Admin Control Center
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Store Dashboard
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl">
                Quickly add clothes or products directly from mobile or desktop, manage inventory, and monitor real-time sales.
              </p>
            </div>

            {/* Quick Action Buttons - especially prominent on mobile! */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={openCreateDialog}
                className="flex-1 sm:flex-none rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] transition-all shadow-lg shadow-[#D4AF37]/20 h-11 px-5"
              >
                <Plus className="h-5 w-5 mr-1.5" />
                Add Product / Clothes
              </Button>

              <Button
                onClick={() => setcategoryDialogOpen(true)}
                variant="outline"
                className="rounded-xl border border-[#D4AF37]/50 text-white hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] h-11 px-4 text-xs font-semibold"
              >
                <FolderPlus className="h-4 w-4 mr-1.5 text-[#D4AF37]" />
                Add Category
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards on Mobile & Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link
            to="/admin/products"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#D4AF37]/30 bg-[#0d0d0d] hover:border-[#D4AF37] hover:bg-white/[0.02] transition-all text-center gap-2 group"
          >
            <div className="h-10 w-10 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
              <Package className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">Manage Products</span>
          </Link>

          <Link
            to="/admin/settings"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#D4AF37]/30 bg-[#0d0d0d] hover:border-[#D4AF37] hover:bg-white/[0.02] transition-all text-center gap-2 group"
          >
            <div className="h-10 w-10 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
              <ImagePlus className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">Banner Settings</span>
          </Link>

          <Link
            to="/admin/orders"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#D4AF37]/30 bg-[#0d0d0d] hover:border-[#D4AF37] hover:bg-white/[0.02] transition-all text-center gap-2 group"
          >
            <div className="h-10 w-10 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
              <PackageCheck className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">View Orders</span>
          </Link>

          <Link
            to="/collections"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#D4AF37]/30 bg-[#0d0d0d] hover:border-[#D4AF37] hover:bg-white/[0.02] transition-all text-center gap-2 group"
          >
            <div className="h-10 w-10 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-white">View Store</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-4">
            Key Performance Metrics
          </h2>

          {loading ? (
            <Commonloader />
          ) : (
            <div className={gridClass}>
              {statsItems.map((item) => {
                const Icon = item.icon;
                const value = stats[item.key];
                return (
                  <Card key={item.key} className={statCardClass}>
                    <CardContent className={statContentClass}>
                      <div className={iconWrapClass}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className={statLabelClass}>{item.label}</p>
                        <p className={statValueClass}>
                          {item.key === "totalSales" ? formatPrice(value) : value}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Category Dialog - accessible from Dashboard */}
      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setcategoryDialogOpen}
        categories={categories}
        onSaved={async () => {
          await refreshAll();
          void fetchDashboard();
        }}
      />

      {/* Product Dialog - accessible directly from Dashboard on mobile and desktop */}
      <ProductDialog
        open={productDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeProductDialog();
            return;
          }
          setProductDialogOpen(true);
        }}
        categories={categories}
        product={editingProduct}
        onSaved={async () => {
          await refreshAll();
          void fetchDashboard();
        }}
      />
    </div>
  );
}

export default AdminDashboard;
