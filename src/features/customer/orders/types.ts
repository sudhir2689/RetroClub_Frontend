export type CustomerOrderStatus =
  | "placed"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled"
  | "refunded";
export type CustomerPaymentStatus = "pending" | "paid" | "failed";

export type CustomerOrderItemDetail = {
  productId: string;
  title: string;
  brand: string;
  price: number;
  salePercentage: number;
  imageUrl: string;
  quantity: number;
};

export type CustomerOrder = {
  _id: string;
  code: string;
  totalItems: number;
  totalAmount: number;
  paymentStatus: CustomerPaymentStatus;
  orderStatus: CustomerOrderStatus;
  expectedDeliveryDate?: string | null;
  paidAt?: string | null;
  deliveredAt?: string | null;
  returnedAt?: string | null;
  cancelledAt?: string | null;
  refundedAt?: string | null;
  cancellationNote?: string;
  createdAt: string;
  orderItems?: CustomerOrderItemDetail[];
};

export type CustomerOrdersResponse = {
  items: CustomerOrder[];
};

export type CustomerReturnOrderResponse = {
  _id: string;
  orderStatus: CustomerOrderStatus;
  returnedAt?: string | null;
};
