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
  "max-h-[92vh] w-[95vw] sm:max-w-4xl overflow-y-auto rounded-2xl border border-[#D4AF37] bg-white text-black shadow-2xl p-6";
const wrapClass = "space-y-4 mt-2";
const topRowClass = "flex items-center justify-between gap-3";

const metaClass = "text-xs text-zinc-500";

const buttonClass = "rounded-xl border border-[#D4AF37] bg-white text-black hover:bg-[#D4AF37]/10 text-xs font-semibold";
const emptyClass = "text-sm text-zinc-500 text-center py-8";
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
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-black">
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
            <div className="overflow-x-auto rounded-xl border border-[#D4AF37] bg-white">
              <Table>
                <TableHeader className="bg-zinc-50 border-b border-[#D4AF37]/30">
                  <TableRow className="border-[#D4AF37]/30 hover:bg-transparent">
                    <TableHead className="text-[#997300] font-bold">Order</TableHead>
                    <TableHead className="text-[#997300] font-bold">Date</TableHead>
                    <TableHead className="text-[#997300] font-bold">Items</TableHead>
                    <TableHead className="text-[#997300] font-bold">Amount</TableHead>
                    <TableHead className="text-[#997300] font-bold">Payment</TableHead>
                    <TableHead className="text-[#997300] font-bold">Status</TableHead>
                    <TableHead className="text-right text-[#997300] font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((order) => {
                    const returnable = canReturnOrder(order);

                    return (
                      <TableRow
                        key={order._id}
                        className="border-b border-[#D4AF37]/20 hover:bg-zinc-50/50"
                      >
                        <TableCell className="font-mono text-xs font-bold text-[#997300]">
                          #{order.code}
                        </TableCell>
                        <TableCell className="text-xs text-zinc-600">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-black font-medium">{order.totalItems}</TableCell>
                        <TableCell className="font-bold text-black">
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
                              className="rounded-xl border border-red-500/40 text-red-600 hover:bg-red-50 text-xs font-semibold"
                            >
                              Return Order
                            </Button>
                          ) : (
                            <span className="text-xs text-zinc-500 font-medium">
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
