import { apiGet, apiPatch } from "@/lib/api";
import type {
  AdminOrdersResponse,
  AdminOrderStatus,
  AdminUpdateOrderStatusResponse,
  AdminUpdateDeliveryDateResponse,
} from "./types";

export async function extractAdminOrders() {
  return apiGet<AdminOrdersResponse>("/admin/orders");
}

export async function updateAdminOrderStatus(
  orderId: string,
  orderStatus: AdminOrderStatus,
) {
  return apiPatch<
    AdminUpdateOrderStatusResponse,
    { orderStatus: AdminOrderStatus }
  >(`/admin/orders/${orderId}/status`, { orderStatus });
}

export async function updateAdminDeliveryDate(
  orderId: string,
  expectedDeliveryDate: string | null,
) {
  return apiPatch<
    AdminUpdateDeliveryDateResponse,
    { expectedDeliveryDate: string | null }
  >(`/admin/orders/${orderId}/delivery-date`, { expectedDeliveryDate });
}
