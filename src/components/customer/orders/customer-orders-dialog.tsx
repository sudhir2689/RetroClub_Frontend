import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerOrdersStore } from "@/features/customer/orders/store";
import type {
  CustomerOrder,
  CustomerOrderStatus,
  CustomerPaymentStatus,
} from "@/features/customer/orders/types";
import { formatPrice } from "@/lib/utils";
import { RefreshCw, ShoppingBasket } from "lucide-react";

const dialogClass =
  "max-h-[92vh] w-[95vw] sm:max-w-4xl overflow-y-auto rounded-2xl border border-[#D4AF37]/50 bg-black text-white shadow-2xl p-6";
const wrapClass = "space-y-4 mt-2";
const topRowClass = "flex items-center justify-between gap-3";

const metaClass = "text-xs text-muted-foreground";

const buttonClass = "rounded-xl border border-[#D4AF37]/40 bg-black text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs";
const emptyClass = "text-sm text-muted-foreground text-center py-8";
const successBadgeClass =
  "border border-green-500/40 bg-green-500/10 text-green-400 rounded-lg";

const dangerBadgeClass =
  "border border-red-500/40 bg-red-500/10 text-red-400 rounded-lg";

const neutralBadgeClass =
  "border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg";

function CustomerPaymentStatusBadge(props: { status: CustomerPaymentStatus }) {
  const { status } = props;
  const className =
    status === "paid"
      ? successBadgeClass
      : status === "failed"
        ? dangerBadgeClass
        : neutralBadgeClass;

  return <Badge className={className}>{status}</Badge>;
}

function CustomerOrderStatusBadge(props: { status: CustomerOrderStatus }) {
  const { status } = props;
  const className =
    status === "delivered"
      ? successBadgeClass
      : status === "returned"
        ? dangerBadgeClass
        : neutralBadgeClass;

  return <Badge className={className}>{status}</Badge>;
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString() : "-";
}

function canReturnOrder(order: CustomerOrder) {
  if (order.orderStatus !== "delivered" || !order.deliveredAt) return false;

  const diff = Date.now() - new Date(order.deliveredAt).getTime();

  return diff <= 7 * 24 * 60 * 60 * 1000;
}

function CustomerOrdersDialog() {
  const { isOpen, closeOrders, loading, items, returnOrder, loadOrders } =
    useCustomerOrdersStore((state) => state);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeOrders()}>
      <DialogContent className={dialogClass}>
        <DialogHeader className="border-b border-[#D4AF37]/20 pb-3">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
            <ShoppingBasket className="h-5 w-5 text-[#D4AF37]" />
            My Orders History
          </DialogTitle>
        </DialogHeader>
        <div className={wrapClass}>
          <div className={topRowClass}>
            <p className={metaClass}>Track your purchases, statuses, and eligible returns</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={buttonClass}
              onClick={() => void loadOrders()}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {!items.length ? (
            <div className={emptyClass}>No orders found. Start shopping our collections!</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#D4AF37]/30 bg-card">
              <Table>
                <TableHeader className="bg-black/60 border-b border-[#D4AF37]/30">
                  <TableRow className="border-[#D4AF37]/30 hover:bg-transparent">
                    <TableHead className="text-[#D4AF37]">Order</TableHead>
                    <TableHead className="text-[#D4AF37]">Date</TableHead>
                    <TableHead className="text-[#D4AF37]">Items</TableHead>
                    <TableHead className="text-[#D4AF37]">Amount</TableHead>
                    <TableHead className="text-[#D4AF37]">Payment</TableHead>
                    <TableHead className="text-[#D4AF37]">Status</TableHead>
                    <TableHead className="text-right text-[#D4AF37]">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((order) => {
                    const returnable = canReturnOrder(order);

                    return (
                      <TableRow
                        key={order._id}
                        className="border-b border-[#D4AF37]/20 hover:bg-white/[0.02]"
                      >
                        <TableCell className="font-mono text-xs text-[#D4AF37]">
                          #{order.code}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-white">{order.totalItems}</TableCell>
                        <TableCell className="font-semibold text-white">
                          {formatPrice(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <CustomerPaymentStatusBadge status={order.paymentStatus} />
                        </TableCell>
                        <TableCell>
                          <CustomerOrderStatusBadge status={order.orderStatus} />
                        </TableCell>
                        <TableCell className="text-right">
                          {returnable ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => void returnOrder(order._id)}
                              className="rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs"
                            >
                              Return Order
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {order.orderStatus === "returned" ? "Returned" : "Completed"}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerOrdersDialog;
