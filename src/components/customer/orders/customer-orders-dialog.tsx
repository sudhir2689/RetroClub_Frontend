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
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  ShoppingBasket,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const dialogClass =
  "max-h-[92vh] w-[95vw] sm:max-w-4xl overflow-y-auto rounded-2xl border border-[#D4AF37] bg-white text-black shadow-2xl p-6";
const wrapClass = "space-y-4 mt-2";
const topRowClass = "flex items-center justify-between gap-3";

const metaClass = "text-xs text-zinc-500";

const buttonClass =
  "rounded-xl border border-[#D4AF37] bg-white text-black hover:bg-[#D4AF37]/10 text-xs font-semibold";
const emptyClass = "text-sm text-zinc-500 text-center py-8";
const successBadgeClass =
  "border border-green-500/40 bg-green-50 text-green-700 rounded-lg font-semibold";

const dangerBadgeClass =
  "border border-red-500/40 bg-red-50 text-red-700 rounded-lg font-semibold";

const neutralBadgeClass =
  "border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#997300] rounded-lg font-semibold";

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

  if (status === "delivered") {
    return (
      <Badge className="border border-green-500/40 bg-green-50 text-green-700 rounded-lg font-semibold">
        Delivered
      </Badge>
    );
  }

  if (status === "shipped") {
    return (
      <Badge className="border border-blue-500/40 bg-blue-50 text-blue-700 rounded-lg font-semibold">
        In transit
      </Badge>
    );
  }

  if (status === "cancelled") {
    return (
      <Badge className="border border-red-500/40 bg-red-50 text-red-700 rounded-lg font-semibold">
        Cancelled
      </Badge>
    );
  }

  if (status === "refunded" || status === "returned") {
    return (
      <Badge className="border border-purple-500/40 bg-purple-50 text-purple-700 rounded-lg font-semibold">
        Returned & Refunded
      </Badge>
    );
  }

  return (
    <Badge className="border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#997300] rounded-lg font-semibold">
      Processing
    </Badge>
  );
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
  const [selectedNoticeOrder, setSelectedNoticeOrder] =
    useState<CustomerOrder | null>(null);

  return (
    <>
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
              <p className={metaClass}>
                Track your purchases, statuses, and eligible returns
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={buttonClass}
                onClick={() => void loadOrders()}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>

            {!items.length ? (
              <div className={emptyClass}>
                No orders found. Start shopping our collections!
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#D4AF37] bg-white">
                <Table>
                  <TableHeader className="bg-zinc-50 border-b border-[#D4AF37]/30">
                    <TableRow className="border-[#D4AF37]/30 hover:bg-transparent">
                      <TableHead className="text-[#997300] font-bold">
                        Order
                      </TableHead>
                      <TableHead className="text-[#997300] font-bold">
                        Date
                      </TableHead>
                      <TableHead className="text-[#997300] font-bold">
                        Items
                      </TableHead>
                      <TableHead className="text-[#997300] font-bold">
                        Amount
                      </TableHead>
                      <TableHead className="text-[#997300] font-bold">
                        Payment
                      </TableHead>
                      <TableHead className="text-[#997300] font-bold">
                        Status
                      </TableHead>
                      <TableHead className="text-right text-[#997300] font-bold">
                        Action
                      </TableHead>
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
                          <TableCell>
                            <div className="space-y-0.5">
                              <p className="text-xs text-zinc-600">
                                {formatDate(order.createdAt)}
                              </p>
                              {order.expectedDeliveryDate ? (
                                <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#997300]">
                                  <Calendar className="h-3 w-3" />
                                  Exp: {formatDate(order.expectedDeliveryDate)}
                                </p>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[260px]">
                            {order.orderItems && order.orderItems.length > 0 ? (
                              <div className="flex flex-col gap-2.5 py-1">
                                {order.orderItems.map((prodItem, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3"
                                  >
                                    <Link
                                      to={
                                        prodItem.productId
                                          ? `/collection/${prodItem.productId}`
                                          : "#"
                                      }
                                      onClick={closeOrders}
                                      className="group relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#D4AF37]/40 bg-zinc-100 hover:border-[#D4AF37] transition-all shadow-2xs"
                                      title={`View ${prodItem.title}`}
                                    >
                                      {prodItem.imageUrl ? (
                                        <img
                                          src={prodItem.imageUrl}
                                          alt={prodItem.title}
                                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">
                                          Kit
                                        </div>
                                      )}
                                    </Link>

                                    <div className="min-w-0 flex-1">
                                      <Link
                                        to={
                                          prodItem.productId
                                            ? `/collection/${prodItem.productId}`
                                            : "#"
                                        }
                                        onClick={closeOrders}
                                        className="line-clamp-1 text-xs font-semibold text-black hover:text-[#997300] hover:underline transition-colors flex items-center gap-1 group/link"
                                      >
                                        <span>{prodItem.title}</span>
                                        <ExternalLink className="h-3 w-3 shrink-0 opacity-60 group-hover/link:opacity-100 text-[#997300]" />
                                      </Link>
                                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                                        <span>Qty: {prodItem.quantity}</span>
                                        {prodItem.size ? (
                                          <span className="font-semibold text-black">
                                            • Size: {prodItem.size}
                                          </span>
                                        ) : null}
                                        {prodItem.brand ? (
                                          <span>• {prodItem.brand}</span>
                                        ) : null}
                                        {prodItem.productId ? (
                                          <Link
                                            to={`/collection/${prodItem.productId}`}
                                            onClick={closeOrders}
                                            className="ml-auto inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-[#997300] hover:underline"
                                          >
                                            View item
                                          </Link>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-black font-medium">
                                {order.totalItems} items
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="font-bold text-black">
                            {formatPrice(order.totalAmount)}
                          </TableCell>
                          <TableCell>
                            <CustomerPaymentStatusBadge
                              status={order.paymentStatus}
                            />
                          </TableCell>
                          <TableCell>
                            <CustomerOrderStatusBadge
                              status={order.orderStatus}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {order.orderStatus === "cancelled" ? (
                              <div className="flex flex-col items-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setSelectedNoticeOrder(order)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                                >
                                  <AlertCircle className="h-3.5 w-3.5" />
                                  Cancelled
                                </button>
                                <span className="text-[11px] font-medium text-amber-700 max-w-[200px] text-right leading-tight">
                                  refund will be transferred to their original bank account
                                </span>
                              </div>
                            ) : order.orderStatus === "refunded" ||
                              order.orderStatus === "returned" ? (
                              <div className="flex flex-col items-end gap-0.5">
                                <span className="inline-flex items-center gap-1 rounded-lg border border-purple-500/40 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Returned & Refunded
                                </span>
                                <span className="text-[10px] text-zinc-500">
                                  Refund transferred to original bank account
                                </span>
                              </div>
                            ) : returnable ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => void returnOrder(order._id)}
                                className="rounded-xl border border-red-500/40 text-red-600 hover:bg-red-50 text-xs font-semibold"
                              >
                                Return Order
                              </Button>
                            ) : order.orderStatus === "delivered" ? (
                              <span className="text-xs text-green-700 font-semibold">
                                Completed
                              </span>
                            ) : order.orderStatus === "shipped" ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                                <Truck className="h-3.5 w-3.5" />
                                In transit
                              </span>
                            ) : (
                              <span className="text-xs text-[#997300] font-semibold">
                                Processing
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

      {/* Cancellation Notice Dialog */}
      {selectedNoticeOrder && (
        <Dialog
          open={!!selectedNoticeOrder}
          onOpenChange={(open) => !open && setSelectedNoticeOrder(null)}
        >
          <DialogContent className="sm:max-w-md rounded-2xl border border-[#D4AF37] bg-white text-black p-6 shadow-2xl">
            <DialogHeader className="border-b border-[#D4AF37]/20 pb-3">
              <DialogTitle className="flex items-center gap-2 text-lg font-bold text-red-600">
                <AlertCircle className="h-5 w-5" />
                Order Cancelled
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="rounded-xl border border-amber-500/30 bg-amber-50/70 p-4 text-sm text-zinc-800">
                <p className="font-semibold text-amber-900 mb-1">
                  Refund Notice for Order #{selectedNoticeOrder.code}:
                </p>
                <p className="text-zinc-700">
                  {selectedNoticeOrder.cancellationNote ||
                    "refund will be transferred to their original bank account"}
                </p>
              </div>

              <div className="text-xs text-zinc-500 space-y-1">
                <p>Total Amount: {formatPrice(selectedNoticeOrder.totalAmount)}</p>
                <p>Status: Cancelled by Store Admin</p>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setSelectedNoticeOrder(null)}
                  className="rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] px-5"
                >
                  Understood
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default CustomerOrdersDialog;
