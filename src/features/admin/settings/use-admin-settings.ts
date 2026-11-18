import { useEffect, useMemo, useState } from "react";
import type { AdminBanner } from "./types";
import {
  addAdminBannerFromProduct,
  deleteAdminBanner,
  getAdminBanners,
  uploadAdminBanners,
} from "./api";
import { getAdminProducts } from "@/features/admin/products/api";
import type { Product } from "@/features/admin/products/types";
import { toast } from "sonner";

export function useAdminSettings() {
  const [items, setItems] = useState<AdminBanner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [bannerTitle, setBannerTitle] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"image" | "product">("image");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function refreshBanners() {
    try {
      setLoading(true);
      const [bannersRes, productsRes] = await Promise.all([
        getAdminBanners(),
        getAdminProducts().catch(() => []),
      ]);
      setItems(bannersRes?.items ?? []);
      setProducts(productsRes ?? []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshBanners();
  }, []);

  async function handleUpload() {
    try {
      if (!files.length) {
        toast.error("Please select at least one image");
        return;
      }
      setUploading(true);

      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      if (selectedProductId) {
        formData.append("productId", selectedProductId);
      }
      if (bannerTitle) {
        formData.append("title", bannerTitle);
      }

      const response = await uploadAdminBanners(formData);
      setItems(response?.items ?? []);
      setFiles([]);
      setSelectedProductId("");
      setBannerTitle("");
      toast.success("Banner(s) uploaded successfully");
    } catch (e: any) {
      toast.error(e?.message || "Failed to upload banners");
    } finally {
      setUploading(false);
    }
  }

  async function handleAddProductBanner() {
    try {
      if (!selectedProductId) {
        toast.error("Please select a product");
        return;
      }
      setUploading(true);
      const response = await addAdminBannerFromProduct(
        selectedProductId,
        bannerTitle || undefined,
      );
      setItems(response?.items ?? []);
      setSelectedProductId("");
      setBannerTitle("");
      toast.success("Product set as banner successfully");
    } catch (e: any) {
      toast.error(e?.message || "Failed to set product as banner");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(bannerId: string) {
    try {
      setDeletingId(bannerId);
      const response = await deleteAdminBanner(bannerId);
      setItems(response?.items ?? []);
      toast.success("Banner deleted successfully");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete banner");
    } finally {
      setDeletingId(null);
    }
  }

  const fileCountLabel = useMemo(() => {
    if (!files.length) return "No files selected";
    if (files.length === 1) return files[0].name;

    return `${files.length} files selected`;
  }, [files]);

  return {
    items,
    products,
    files,
    setFiles,
    fileCountLabel,
    loading,
    setLoading,
    refreshBanners,
    handleUpload,
    handleAddProductBanner,
    handleDelete,
    uploading,
    deletingId,
    selectedProductId,
    setSelectedProductId,
    bannerTitle,
    setBannerTitle,
    activeTab,
    setActiveTab,
  };
}
