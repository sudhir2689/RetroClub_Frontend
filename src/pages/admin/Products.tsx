import { CategoryDialog } from "@/components/admin/products/category-dialog";
import { ProductDialog } from "@/components/admin/products/product-dialog";
import { ProductsTable } from "@/components/admin/products/products-table";
import { ProductToolbar } from "@/components/admin/products/products-toolbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminProducts } from "@/features/admin/products/use-admin-products";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const pageWrap = "space-y-6";

const cardClass = "rounded-2xl border border-[#D4AF37]/40 bg-[#0d0d0d] shadow-xl shadow-black/50 overflow-hidden";

const cardHeaderClass = "space-y-4 border-b border-[#D4AF37]/20 p-6";

const cardTitleClass = "text-2xl font-bold tracking-tight text-white";

const cardContentClass = "space-y-4 p-6";

function AdminProducts() {
  const [searchParams] = useSearchParams();
  const {
    search,
    setSearch,
    products,
    categories,
    loading,
    categoryDialogOpen,
    setcategoryDialogOpen,
    productDialogOpen,
    setProductDialogOpen,
    editingProduct,
    openCreateDialog,
    closeProductDialog,
    refreshAll,
    openEditDialog,
  } = useAdminProducts();

  useEffect(() => {
    if (
      searchParams.get("create") === "true" ||
      searchParams.get("new") === "true"
    ) {
      openCreateDialog();
    }
  }, [searchParams]);

  return (
    <div className={pageWrap}>
      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className={cardTitleClass}>Products & Clothes</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Manage your clothing collection, stock, variants, and pricing.
              </p>
            </div>
          </div>
          <ProductToolbar
            search={search}
            onSearchChange={setSearch}
            onManageCategories={() => setcategoryDialogOpen(true)}
            onAddProduct={openCreateDialog}
          />
        </CardHeader>
        <CardContent className={cardContentClass}>
          <ProductsTable
            loading={loading}
            products={products}
            onEdit={openEditDialog}
          />
        </CardContent>
      </Card>

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setcategoryDialogOpen}
        categories={categories}
        onSaved={refreshAll}
      />

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
        onSaved={refreshAll}
      />
    </div>
  );
}

export default AdminProducts;
