import { apiDelete, apiGet, apiPost } from "@/lib/api";
import type { AdminBannersResponse } from "./types";

export async function getAdminBanners() {
  return apiGet<AdminBannersResponse>("/admin/settings/banners");
}

export async function uploadAdminBanners(formData: FormData) {
  return apiPost<AdminBannersResponse, FormData>(
    "/admin/settings/banners",
    formData,
  );
}

export async function addAdminBannerFromProduct(productId: string, title?: string) {
  return apiPost<AdminBannersResponse, { productId: string; title?: string }>(
    "/admin/settings/banners/from-product",
    { productId, title },
  );
}

export async function deleteAdminBanner(bannerId: string) {
  return apiDelete<AdminBannersResponse>(`/admin/settings/banners/${bannerId}`);
}
