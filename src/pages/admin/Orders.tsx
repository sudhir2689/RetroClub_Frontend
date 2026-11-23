import { Commonloader } from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SelectTrigger,
  SelectValue,
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminOrdersStore } from "@/features/admin/orders/store";
import type {
  AdminOrder,
  AdminOrderStatus,
  AdminPaymentStatus,
} from "@/features/admin/orders/types";
import { formatPrice } from "@/lib/utils";
import { useEffect } from "react";

const pageWrapClass = "min-h-screen bg-[#fafafa] text-zinc-900";
const contentWrapClass = "mx-auto max-w-7xl space-y-6";
const cardClass = "rounded-2xl border border-[#D4AF37] bg-white shadow-xs overflow-hidden";
const wrapClass = "space-y-4 border-b border-[#D4AF37]/20 p-6 bg-white";
const topRowClass =
  "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";
const titleClass = "text-2xl font-bold tracking-tight text-black flex items-center gap-2";
const metaClass = "text-xs text-zinc-600";
const emptyClass =
  "rounded-xl border border-dashed border-[#D4AF37]/30 bg-zinc-50 p-8 text-center text-sm text-zinc-500";
const tableWrapClass = "overflow-x-auto rounded-xl border border-[#D4AF37] bg-white";
const cellStackClass = "space-y-1";
const primaryTextClass = "font-bold text-black";
const subTextClass = "text-xs text-zinc-500";
const selectTriggerClass = "h-9 w-[160px] rounded-xl border border-[#D4AF37]/50 bg-white text-black";
const successBadgeClass =
  "border border-green-500/40 bg-green-50 text-green-700 rounded-lg";
const dangerBadgeClass =
  "border border-red-500/40 bg-red-50 text-red-700 rounded-lg";
const neutralBadgeClass =
  "border border-zinc-300 bg-zinc-100 text-zinc-700 rounded-lg";

const orderStatusOptions: { value: AdminOrderStatus; label: string }[] = [
  { value: "placed", label: "Mark as placed (Processing)" },
  { value: "shipped", label: "Mark as shipped (In transit)" },
  { value: "delivered", label: "Mark as delivered" },
  { value: "cancelled", label: "Cancel / Reject Order" },
  { value: "refunded", label: "Mark as refunded" },
];

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString() : "-";
}

function AdminPaymentStatusBadge(props: { status: AdminPaymentStatus }) {
  const { status } = props;
  const className =
    status === "paid"
      ? successBadgeClass
      : status === "failed"
        ? dangerBadgeClass
        : neutralBadgeClass;

  return <Badge className={className}>{status}</Badge>;
}

function canUpdateStatus(order: AdminOrder) {
  if (order.orderStatus === "refunded") return false;
  return true;
}

function getNextStatusValue(order: AdminOrder) {
  return order.orderStatus;
}

function AdminOrders() {
  const {
    loading,
    orders,
    updatingOrderId,
    fetchOrders,
    changeStatus,
    changeDeliveryDate,
  } = useAdminOrdersStore((state) => state);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  if (loading) return <Commonloader />;

  return (
    <div className={pageWrapClass}>
      <div className={contentWrapClass}>
        <Card className={cardClass}>
          <CardHeader className={wrapClass}>
            <div className={topRowClass}>
              <div>
                <CardTitle className={titleClass}>Orders Management</CardTitle>
                <p className={metaClass}>
                  Track customer orders, manage shipping states, and handle returns.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 bg-white">
            {!orders.length ? (
              <div className={emptyClass}>No orders placed yet</div>
            ) : (
              <div className={tableWrapClass}>
                <Table>
                  <TableHeader className="bg-zinc-50 border-b border-[#D4AF37]/30">
                    <TableRow className="border-[#D4AF37]/30 hover:bg-transparent">
                      <TableHead className="text-[#997300] font-bold">Order Code</TableHead>
                      <TableHead className="text-[#997300] font-bold">Customer</TableHead>
                      <TableHead className="text-[#997300] font-bold">Items</TableHead>
                      <TableHead className="text-[#997300] font-bold">Amount</TableHead>
                      <TableHead className="text-[#997300] font-bold">Payment</TableHead>
                      <TableHead className="text-[#997300] font-bold">Order Status</TableHead>
                      <TableHead className="text-[#997300] font-bold">Dates</TableHead>
                      <TableHead className="text-[#997300] font-bold">Exp. Delivery</TableHead>
                      <TableHead className="text-right text-[#997300] font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.map((order) => {
                      const isUpdating = updatingOrderId === order._id;
                      const isModifiable = canUpdateStatus(order);

                      return (
                        <TableRow
                          key={order._id}
                          className="border-b border-[#D4AF37]/20 hover:bg-zinc-50/60 transition-colors"
                        >
                          <TableCell className="font-mono text-xs font-bold text-[#997300]">
                            #{order.code}
                          </TableCell>

                          <TableCell>
                            <div className={cellStackClass}>
                              <p className={primaryTextClass}>
                                {order.customerName}
                              </p>
                              <p className={subTextClass}>
                                {order.customerEmail}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="font-medium text-black">{order.totalItems}</TableCell>

                          <TableCell className="font-bold text-black">
                            {formatPrice(order.totalAmount)}
                          </TableCell>

                          <TableCell>
                            <AdminPaymentStatusBadge
                              status={order.paymentStatus}
                            />
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
                                order.orderStatus === "delivered"
                                  ? "border border-green-500/40 bg-green-50 text-green-700"
                                  : order.orderStatus === "shipped"
                                    ? "border border-blue-500/40 bg-blue-50 text-blue-700"
                                    : order.orderStatus === "cancelled"
                                      ? "border border-red-500/40 bg-red-50 text-red-700"
                                      : order.orderStatus === "refunded"
                                        ? "border border-purple-500/40 bg-purple-50 text-purple-700"
                                        : order.orderStatus === "returned"
                                          ? "border border-orange-500/40 bg-orange-50 text-orange-700"
                                          : "border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#997300]"
                              }`}
                            >
                              {order.orderStatus === "shipped"
                                ? "In transit"
                                : order.orderStatus === "placed"
                                  ? "Processing"
                                  : order.orderStatus}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className={cellStackClass}>
                              <p className={subTextClass}>
                                Placed: {formatDate(order.createdAt)}
                              </p>
                              {order.paidAt ? (
                                <p className={subTextClass}>
                                  Paid: {formatDate(order.paidAt)}
                                </p>
                              ) : null}
                              {order.deliveredAt ? (
                                <p className={subTextClass}>
                                  Delivered: {formatDate(order.deliveredAt)}
                                </p>
                              ) : null}
                              {order.cancelledAt ? (
                                <p className="text-xs text-red-600">
                                  Cancelled: {formatDate(order.cancelledAt)}
                                </p>
                              ) : null}
                              {order.refundedAt ? (
                                <p className="text-xs text-purple-600">
                                  Refunded: {formatDate(order.refundedAt)}
                                </p>
                              ) : null}
                              {order.returnedAt ? (
                                <p className="text-xs text-orange-600">
                                  Returned: {formatDate(order.returnedAt)}
                                </p>
                              ) : null}
                            </div>
                          </TableCell>

                          <TableCell>
                            <input
                              type="date"
                              defaultValue={
                                order.expectedDeliveryDate
                                  ? order.expectedDeliveryDate.slice(0, 10)
                                  : ""
                              }
                              onChange={(e) =>
                                void changeDeliveryDate(
                                  order._id,
                                  e.target.value || null,
                                )
                              }
                              className="h-8 rounded-lg border border-[#D4AF37]/50 bg-white px-2 text-xs text-black cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                              title="Set expected delivery date"
                            />
                          </TableCell>

                          <TableCell className="text-right">
                            <Select
                              value={getNextStatusValue(order)}
                              disabled={!isModifiable || isUpdating}
                              onValueChange={(value) =>
                                changeStatus(order._id, value as AdminOrderStatus)
                              }
                            >
                              <SelectTrigger className={selectTriggerClass}>
                                <SelectValue
                                  placeholder={
                                    isUpdating
                                      ? "Updating..."
                                      : order.orderStatus
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent className="border border-[#D4AF37] bg-white text-black">
                                {orderStatusOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminOrders;
