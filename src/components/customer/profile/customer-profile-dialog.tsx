import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { useCustomerProfileStore } from "@/features/customer/profile/store";
import { useUser } from "@clerk/react";
import { Pencil, Plus, Trash2, User } from "lucide-react";

const dialogClass =
  "max-h-[92vh] w-[95vw] sm:max-w-5xl overflow-y-auto rounded-2xl border border-[#D4AF37] bg-white text-black shadow-2xl p-6";

const dialogTitle = "flex items-center gap-2 text-xl font-bold text-black";

const shellClass = "space-y-6 mt-4";
const accountCardClass =
  "rounded-2xl border border-[#D4AF37] bg-white p-6 shadow-xs";
const accountRowClass = "flex flex-wrap items-center justify-between gap-4";
const accountTextClass = "space-y-1";
const accountTitleClass = "text-xl font-bold text-black";
const emailClass = "text-sm text-zinc-600";
const pointsClass =
  "inline-flex items-center rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 px-4 py-1 text-sm font-bold text-[#997300]";

const gridClass = "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]";
const singleGridClass = "grid gap-6";

const sectionClass = "space-y-4";
const sectionHeaderClass = "flex items-center justify-between gap-3";
const sectionTitleClass = "text-base font-bold text-black";
const sectionTextClass = "text-xs text-zinc-500";

const listClass = "space-y-3 max-h-96 overflow-y-auto pr-1";
const itemClass =
  "space-y-3 rounded-xl border border-[#D4AF37]/50 bg-white p-4 transition-colors hover:border-[#D4AF37]";
const itemTopClass = "flex flex-wrap items-start justify-between gap-3";
const itemTextClass = "space-y-1";
const defaultClass =
  "inline-flex rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-2.5 py-0.5 text-xs font-bold text-[#997300]";
const nameClass = "font-bold text-black";
const addressClass = "text-xs text-muted-foreground";
const actionRowClass = "flex gap-2";
const buttonClass = "rounded-xl text-xs";
const emptyClass = "text-sm text-muted-foreground";

const formWrapClass =
  "space-y-4 rounded-xl border border-[#D4AF37] bg-white p-5 shadow-xs";
const twoColumnClass = "grid gap-4 sm:grid-cols-2";
const threeColumnClass = "grid gap-4 sm:grid-cols-3";
const fieldClass = "space-y-1.5";
const inputClass =
  "rounded-xl border border-[#D4AF37]/50 bg-white text-black placeholder:text-zinc-400 focus:border-[#D4AF37]";
const checkboxRowClass =
  "flex items-center gap-3 rounded-xl border border-[#D4AF37]/30 bg-zinc-50 px-3 py-3 text-sm text-black";
const checkboxClass = "h-4 w-4 accent-[#D4AF37]";
const formActionsClass = "flex flex-wrap justify-end gap-3 pt-2";

function CustomerProfileDialog() {
  const {
    isOpen,
    closeProfile,
    mode,
    startAdd,
    startEdit,
    updateForm,
    cancelForm,
    saveForm,
    removeAddress,
    items,
    form,
  } = useCustomerProfileStore();

  const { points } = useCustomerCartAndCheckoutStore((state) => state);

  const { user } = useUser();

  const showForm = mode !== "none";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeProfile()}>
      <DialogContent className={dialogClass}>
        <DialogHeader className="border-b border-[#D4AF37]/20 pb-3">
          <DialogTitle className={dialogTitle}>
            <User className="h-5 w-5 text-[#D4AF37]" />
            User Account & Addresses
          </DialogTitle>
        </DialogHeader>

        <div className={shellClass}>
          <section className={accountCardClass}>
            <div className={accountRowClass}>
              <div className={accountTextClass}>
                <h2 className={accountTitleClass}>{user?.fullName || "Member"}</h2>
                <p className={emailClass}>
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>

              <p className={pointsClass}>Available Points: {points}</p>
            </div>
          </section>
          <div className={showForm ? gridClass : singleGridClass}>
            <section className={sectionClass}>
              <div className={sectionHeaderClass}>
                <div>
                  <h3 className={sectionTitleClass}>Saved Addresses</h3>
                  <p className={sectionTextClass}>
                    Manage your shipping and delivery destinations.
                  </p>
                </div>

                {!showForm ? (
                  <Button
                    onClick={startAdd}
                    className="rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] text-xs"
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Address
                  </Button>
                ) : null}
              </div>

              <div className={listClass}>
                {!items.length ? (
                  <p className={emptyClass}>No addresses saved yet</p>
                ) : null}

                {items.map((item) => (
                  <div key={item._id} className={itemClass}>
                    <div className={itemTopClass}>
                      <div className={itemTextClass}>
                        <div className="flex items-center gap-2">
                          <p className={nameClass}>{item.fullName}</p>
                          {item.isDefault ? (
                            <span className={defaultClass}>Default</span>
                          ) : null}
                        </div>
                        <p className={addressClass}>{item.address}</p>
                        <p className={addressClass}>
                          {item.state} - {item.postalCode}
                        </p>
                      </div>

                      <div className={actionRowClass}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(item)}
                          className={`${buttonClass} text-[#D4AF37] hover:bg-[#D4AF37]/10`}
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => void removeAddress(item._id)}
                          className={`${buttonClass} text-red-600 hover:text-red-700 bg-transparent hover:bg-transparent font-medium`}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {showForm ? (
              <section className={formWrapClass}>
                <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
                  {mode === "add" ? "Add New Address" : "Edit Address"}
                </h4>

                <div className={fieldClass}>
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => updateForm("fullName", e.target.value)}
                    placeholder="Recipient's name"
                    className={inputClass}
                  />
                </div>

                <div className={fieldClass}>
                  <Label className="text-xs text-muted-foreground">Address</Label>
                  <Input
                    value={form.address}
                    onChange={(e) => updateForm("address", e.target.value)}
                    placeholder="House/Street/Area"
                    className={inputClass}
                  />
                </div>

                <div className={twoColumnClass}>
                  <div className={fieldClass}>
                    <Label className="text-xs text-muted-foreground">State</Label>
                    <Input
                      value={form.state}
                      onChange={(e) => updateForm("state", e.target.value)}
                      placeholder="State"
                      className={inputClass}
                    />
                  </div>
                  <div className={fieldClass}>
                    <Label className="text-xs text-muted-foreground">Postal Code</Label>
                    <Input
                      value={form.postalCode}
                      onChange={(e) => updateForm("postalCode", e.target.value)}
                      placeholder="Pincode"
                      className={inputClass}
                    />
                  </div>
                </div>

                <label className={checkboxRowClass}>
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => updateForm("isDefault", e.target.checked)}
                    className={checkboxClass}
                  />
                  <span className="text-xs">Set as default delivery address</span>
                </label>

                <div className={formActionsClass}>
                  <Button
                    variant="outline"
                    onClick={cancelForm}
                    className="rounded-xl border border-[#D4AF37]/40 text-black hover:bg-zinc-100 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => void saveForm()}
                    className="rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] text-xs"
                  >
                    Save Address
                  </Button>
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerProfileDialog;
