import { useEffect, useState } from "react";
import type { Product, ProductFormState, ProductImage } from "./types";
import { createAdminProduct, updateAdminProduct } from "./api";

type UseProductFormOptions = {
  open: boolean;
  product: Product | null;
  onSaved: () => Promise<void>;
  onClose: () => void;
};

function getEmptyForm(): ProductFormState {
  return {
    title: "",
    description: "",
    category: "",
    brand: "",
    colors: [],
    sizes: [],
    sizeStock: {},
    isStockAuto: true,
    price: "",
    salePercentage: "0",
    stock: "",
    status: "active",
    existingImages: [],
    newFiles: [],
    coverImagePublicId: "",
  };
}

export function getCoverImage(images: ProductImage[] = []) {
  return images.find((img) => img.isCover) ?? images[0];
}

function mapProductToFormValues(product: Product): ProductFormState {
  const cover = getCoverImage(product.images);
  const sizeStock: Record<string, number | ""> = {};
  if (product.sizeStock) {
    Object.entries(product.sizeStock).forEach(([k, v]) => {
      sizeStock[k] = v;
    });
  }

  return {
    title: product.title,
    description: product.description,
    category: product.category._id,
    brand: product.brand,
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    sizeStock,
    isStockAuto: Object.keys(sizeStock).length > 0,
    price: String(product.price),
    salePercentage: String(product.salePercentage ?? 0),
    stock: String(product.stock),
    status: product.status,
    existingImages: product.images ?? [],
    newFiles: [],
    coverImagePublicId: cover?.publicId ?? "",
  };
}

export function useProductForm({
  open,
  onClose,
  onSaved,
  product,
}: UseProductFormOptions) {
  const [form, setForm] = useState<ProductFormState>(getEmptyForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(product ? mapProductToFormValues(product) : getEmptyForm());
  }, [open, product]);

  function toggleSize(size: string) {
    setForm((prev) => {
      const isRemoving = prev.sizes.includes(size);
      const nextSizes = isRemoving
        ? prev.sizes.filter((item) => item !== size)
        : [...prev.sizes, size];

      const nextSizeStock = { ...prev.sizeStock };
      if (isRemoving) {
        delete nextSizeStock[size];
      }

      const totalFromSizes = nextSizes.reduce((sum, s) => {
        const q = nextSizeStock[s];
        return sum + (typeof q === "number" ? q : 0);
      }, 0);

      const hasAnySizeStock = nextSizes.some(
        (s) => nextSizeStock[s] !== undefined && nextSizeStock[s] !== "",
      );

      return {
        ...prev,
        sizes: nextSizes,
        sizeStock: nextSizeStock,
        stock:
          prev.isStockAuto && hasAnySizeStock
            ? String(totalFromSizes)
            : prev.stock,
      };
    });
  }

  function updateSizeStock(size: string, val: string) {
    setForm((prev) => {
      const parsed: number | "" =
        val.trim() === "" ? "" : Math.max(0, parseInt(val, 10) || 0);
      const nextSizeStock: Record<string, number | ""> = {
        ...prev.sizeStock,
        [size]: parsed,
      };

      const totalFromSizes = prev.sizes.reduce((sum, s) => {
        const q = nextSizeStock[s];
        return sum + (typeof q === "number" ? q : 0);
      }, 0);

      const hasAnySizeStock = prev.sizes.some(
        (s) => nextSizeStock[s] !== undefined && nextSizeStock[s] !== "",
      );

      const shouldAutoUpdate = prev.isStockAuto || !prev.stock || prev.stock === "0";

      return {
        ...prev,
        sizeStock: nextSizeStock,
        stock: shouldAutoUpdate && hasAnySizeStock ? String(totalFromSizes) : prev.stock,
        isStockAuto: shouldAutoUpdate ? true : prev.isStockAuto,
      };
    });
  }

  function addColor(color: string) {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors
        : [...prev.colors, color],
    }));
  }

  function removeColor(color: string) {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((item) => item !== color),
    }));
  }

  function addFiles(files: FileList | null) {
    if (!files?.length) return;

    setForm((prev) => ({
      ...prev,
      newFiles: [...prev.newFiles, ...Array.from(files)],
    }));
  }

  function updateField<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "stock" ? { isStockAuto: false } : {}),
    }));
  }

  function removeExistingImage(publicId: string) {
    setForm((prev) => {
      const nextImages = prev.existingImages.filter(
        (image) => image.publicId !== publicId,
      );

      const nextCoverImageId =
        prev.coverImagePublicId === publicId
          ? (nextImages[0]?.publicId ?? "")
          : prev.coverImagePublicId;

      return {
        ...prev,
        existingImages: nextImages,
        coverImagePublicId: nextCoverImageId,
      };
    });
  }

  function changeCoverImage(publicId: string) {
    updateField("coverImagePublicId", publicId);
  }

  async function submit() {
    // if (!form.title.trim() || !form.description.trim() || !form.category.trim())
    //   return;

    try {
      setSaving(true);

      const cleanSizeStock: Record<string, number> = {};
      form.sizes.forEach((s) => {
        if (form.sizeStock[s] !== undefined && form.sizeStock[s] !== "") {
          cleanSizeStock[s] = Number(form.sizeStock[s]) || 0;
        }
      });
      const hasSizeStock = Object.keys(cleanSizeStock).length > 0;

      if (product) {
        //edit

        await updateAdminProduct(
          product._id,
          {
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            brand: form.brand,
            colors: form.colors,
            sizes: form.sizes,
            sizeStock: hasSizeStock ? cleanSizeStock : undefined,
            price: Number(form.price),
            salePercentage: Number(form.salePercentage) || 0,
            stock: Number(form.stock),
            status: form.status,
            existingImages: form.existingImages,
            coverImagePublicId: form.coverImagePublicId || undefined,
          },
          form.newFiles,
        );
      } else {
        await createAdminProduct(
          {
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            brand: form.brand,
            colors: form.colors,
            sizes: form.sizes,
            sizeStock: hasSizeStock ? cleanSizeStock : undefined,
            price: Number(form.price),
            salePercentage: Number(form.salePercentage) || 0,
            stock: Number(form.stock),
            status: form.status,
          },
          form.newFiles,
        );
      }

      await onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return {
    form,
    saving,
    isEditMode: !!product,
    toggleSize,
    updateSizeStock,
    addColor,
    removeColor,
    addFiles,
    submit,
    updateField,
    removeExistingImage,
    changeCoverImage,
  };
}
