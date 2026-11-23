import PromoDialog from "@/components/admin/promos/promo-dialog";
import PromoToolbar from "@/components/admin/promos/promo-toolbar";
import PromoTable from "@/components/admin/promos/promos-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminPromos } from "@/features/admin/promo/use-admin-promo";

const pageWrapClass = "space-y-6";

const cardClass = "rounded-2xl border border-[#D4AF37] bg-white shadow-xs overflow-hidden";

const cardHeaderClass = "space-y-4 border-b border-[#D4AF37]/20 p-6 bg-white";

const cardTitleClass = "text-2xl font-bold tracking-tight text-black";

function AdminPromos() {
  const {
    search,
    setSearch,
    promos,
    loading,
    promoDialogOpen,
    setPromoDialogOpen,
    editingPromo,
    openCreateDialog,
    closePromoDialog,
    savePromo,
    removePromo,
    saving,
    deletingPromoId,
    openEditDialog,
  } = useAdminPromos();

  return (
    <div className={pageWrapClass}>
      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <div>
            <CardTitle className={cardTitleClass}>Coupons & Promo Codes</CardTitle>
            <p className="text-xs text-zinc-600 mt-1">
              Create and manage discount codes, percentage cuts, and minimum cart thresholds.
            </p>
          </div>
          <PromoToolbar
            search={search}
            onSearchChange={setSearch}
            onAddPromo={openCreateDialog}
          />
        </CardHeader>

        <CardContent className="p-6 bg-white">
          <PromoTable
            promos={promos}
            loading={loading}
            deletingPromoId={deletingPromoId}
            onEdit={openEditDialog}
            onDelete={removePromo}
          />
        </CardContent>
      </Card>

      <PromoDialog
        open={promoDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closePromoDialog();
            return;
          }
          setPromoDialogOpen(true);
        }}
        promo={editingPromo}
        saving={saving}
        onSaved={savePromo}
      />
    </div>
  );
}

export default AdminPromos;
