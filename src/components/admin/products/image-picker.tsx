import { Button } from "@/components/ui/button";
import type { ProductImage } from "@/features/admin/products/types";
import { ImagePlus, Star, X } from "lucide-react";
import { useEffect, useMemo } from "react";

const wrapperClass = "space-y-4";

const headerClass = "space-y-1";

const titleClass = "text-xs font-semibold uppercase tracking-wider text-[#997300]";

const uploadLabelClass =
  "flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D4AF37]/50 bg-zinc-50 px-4 py-6 text-center transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5";

const uploadIconClass = "mb-2 h-6 w-6 text-[#997300]";

const uploadTitleClass = "text-sm font-semibold text-black";

const uploadSubtitleClass = "mt-1 text-xs text-zinc-500";

const hiddenInputClass = "hidden";

const sectionClass = "space-y-2";

const sectionTitleClass = "text-xs font-semibold uppercase tracking-wider text-[#997300]";

const gridClass = "grid grid-cols-2 gap-3 sm:grid-cols-4";

const imageCardClass =
  "overflow-hidden rounded-xl border border-[#D4AF37]/40 bg-white shadow-xs";

const imageClass = "h-28 w-full object-cover";

const imageActionsClass = "flex items-center justify-between gap-2 p-2 border-t border-[#D4AF37]/20 bg-white";

const starIconClass = "mr-1 h-3.5 w-3.5";

const removeIconClass = "h-4 w-4 text-red-500";

const fileNameClass = "p-2 text-xs text-zinc-500 truncate bg-white";

type ImagePickerProps = {
  existingImages: ProductImage[];
  newFiles: File[];
  coverImagePublicId: string;
  onFilesAdd: (files: FileList | null) => void;
  onExistingRemove: (publicId: string) => void;
  onCoverImageChange: (publicId: string) => void;
};

export function ImagePicker({
  existingImages,
  newFiles,
  coverImagePublicId,
  onFilesAdd,
  onExistingRemove,
  onCoverImageChange,
}: ImagePickerProps) {
  const previewUrls = useMemo(
    () => newFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newFiles],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewUrls]);

  return (
    <div className={wrapperClass}>
      <div className={headerClass}>
        <h3 className={titleClass}>Product Images</h3>
      </div>
      <label className={uploadLabelClass}>
        <ImagePlus className={uploadIconClass} />
        <span className={uploadTitleClass}>Upload Clothes / Product Images</span>
        <span className={uploadSubtitleClass}>
          Select one or multiple images (cover will be chosen automatically)
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          className={hiddenInputClass}
          onChange={(event) => onFilesAdd(event.target.files)}
        />
      </label>

      {existingImages.length > 0 ? (
        <div className={sectionClass}>
          <p className={sectionTitleClass}>Existing Images</p>

          <div className={gridClass}>
            {existingImages.map((image) => {
              const isCover = coverImagePublicId === image.publicId;

              return (
                <div key={image.publicId} className={imageCardClass}>
                  <img src={image.url} alt="product" className={imageClass} />

                  <div className={imageActionsClass}>
                    <Button
                      size={"sm"}
                      type="button"
                      variant={isCover ? "default" : "outline"}
                      className={`h-7 rounded-lg text-xs ${
                        isCover
                          ? "bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158]"
                          : "border-[#D4AF37]/40 bg-black text-[#D4AF37]"
                      }`}
                      onClick={() => onCoverImageChange(image.publicId)}
                    >
                      <Star
                        className={`${starIconClass} ${isCover ? "fill-current" : ""}`}
                      />
                      {isCover ? "Cover" : "Set Cover"}
                    </Button>

                    <Button
                      size={"icon"}
                      type="button"
                      variant={"ghost"}
                      className="h-7 w-7 rounded-lg hover:bg-red-500/10"
                      onClick={() => onExistingRemove(image.publicId)}
                    >
                      <X className={removeIconClass} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {previewUrls.length > 0 ? (
        <div className={sectionClass}>
          <p className={sectionTitleClass}>New Uploads Preview</p>

          <div className={gridClass}>
            {previewUrls.map((item, index) => (
              <div key={item.url} className={imageCardClass}>
                <img
                  src={item.url}
                  alt={`preview ${index}`}
                  className={imageClass}
                />
                <p className={fileNameClass}>{item.file.name}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
