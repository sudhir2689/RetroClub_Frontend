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

const pageWrapClass = "min-h-screen bg-black text-foreground";
const contentWrapClass = "mx-auto max-w-7xl space-y-6";
const cardClass = "rounded-2xl border border-[#D4AF37]/40 bg-[#0d0d0d] shadow-xl shadow-black/50 overflow-hidden";
const wrapClass = "space-y-4 border-b border-[#D4AF37]/20 p-6";
const topRowClass =
  "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";
const titleClass = "text-2xl font-bold tracking-tight text-white flex items-center gap-2";
const metaClass = "text-xs text-muted-foreground";
const emptyClass =
  "rounded-xl border border-dashed border-[#D4AF37]/30 bg-black/40 p-8 text-center text-sm text-muted-foreground";
const tableWrapClass = "overflow-x-auto rounded-xl border border-[#D4AF37]/30 bg-card";
const cellStackClass = "space-y-1";
const primaryTextClass = "font-medium text-white";
const subTextClass = "text-xs text-muted-foreground";
const selectTriggerClass = "h-9 w-[160px] rounded-xl border border-[#D4AF37]/40 bg-black text-white";
const successBadgeClass =
  "border border-green-500/40 bg-green-500/10 text-green-400 rounded-lg";
const dangerBadgeClass =
  "border border-red-500/40 bg-red-500/10 text-red-400 rounded-lg";
const neutralBadgeClass =
  "border border-zinc-700 bg-zinc-800 text-zinc-300 rounded-lg";

const orderStatusOptions: AdminOrderStatus[] = [
  "placed",
  "shipped",
  "delivered",
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
  if (order.paymentStatus !== "paid") return false;
  if (order.orderStatus === "delivered") return false;
  if (order.orderStatus === "returned") return false;

  return true;
}

function getNextStatusValue(order: AdminOrder) {
  if (order.orderStatus === "delivered" || order.orderStatus === "returned")
    return "";

  return order.orderStatus;
}

function AdminOrders() {
  const { loading, orders, updatingOrderId, fetchOrders, changeStatus } =
    useAdminOrdersStore((state) => state);

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

          <CardContent className="p-6">
            {!orders.length ? (
              <div className={emptyClass}>No orders placed yet</div>
            ) : (
              <div className={tableWrapClass}>
                <Table>
                  <TableHeader className="bg-black/60 border-b border-[#D4AF37]/30">
                    <TableRow className="border-[#D4AF37]/30 hover:bg-transparent">
                      <TableHead className="text-[#D4AF37]">Order Code</TableHead>
                      <TableHead className="text-[#D4AF37]">Customer</TableHead>
                      <TableHead className="text-[#D4AF37]">Items</TableHead>
                      <TableHead className="text-[#D4AF37]">Amount</TableHead>
                      <TableHead className="text-[#D4AF37]">Payment</TableHead>
                      <TableHead className="text-[#D4AF37]">Order Status</TableHead>
                      <TableHead className="text-[#D4AF37]">Dates</TableHead>
                      <TableHead className="text-right text-[#D4AF37]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.map((order) => {
                      const isUpdating = updatingOrderId === order._id;
                      const isModifiable = canUpdateStatus(order);

                      return (
                        <TableRow
                          key={order._id}
                          className="border-b border-[#D4AF37]/20 hover:bg-white/[0.02] transition-colors"
                        >
                          <TableCell className="font-mono text-xs text-[#D4AF37]">
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

                          <TableCell className="text-white">{order.totalItems}</TableCell>

                          <TableCell className="font-semibold text-white">
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
                                  ? "border border-green-500/40 bg-green-500/10 text-green-400"
                                  : order.orderStatus === "returned"
                                    ? "border border-red-500/40 bg-red-500/10 text-red-400"
                                    : "border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]"
                              }`}
                            >
                              {order.orderStatus}
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
                              {order.returnedAt ? (
                                <p className="text-xs text-red-400">
                                  Returned: {formatDate(order.returnedAt)}
                                </p>
                              ) : null}
                            </div>
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
                              <SelectContent className="border border-[#D4AF37]/40 bg-black text-white">
                                {orderStatusOptions.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    Mark as {status}
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
