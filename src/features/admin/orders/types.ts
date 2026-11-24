export type AdminOrderStatus =
  | "placed"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled"
  | "refunded";
export type AdminPaymentStatus = "pending" | "paid" | "failed";

export type AdminOrderItemDetail = {
  productId: string;
  title: string;
  brand: string;
  price: number;
  salePercentage: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  color?: string;
};

export type AdminOrder = {
  _id: string;
  code: string;
  customerName: string;
  customerEmail: string;
  totalItems: number;
  totalAmount: number;
  paymentStatus: AdminPaymentStatus;
  orderStatus: AdminOrderStatus;
  expectedDeliveryDate?: string | null;
  paidAt?: string | null;
  deliveredAt?: string | null;
  returnedAt?: string | null;
  cancelledAt?: string | null;
  refundedAt?: string | null;
  cancellationNote?: string;
  createdAt: string;
  orderItems?: AdminOrderItemDetail[];
};

export type AdminOrdersResponse = {
  items: AdminOrder[];
};

export type AdminUpdateOrderStatusResponse = {
  _id: string;
  orderStatus: AdminOrderStatus;
  expectedDeliveryDate?: string | null;
  deliveredAt?: string | null;
  returnedAt?: string | null;
  cancelledAt?: string | null;
  refundedAt?: string | null;
  cancellationNote?: string;
};

export type AdminUpdateDeliveryDateResponse = {
  _id: string;
  expectedDeliveryDate?: string | null;
};
