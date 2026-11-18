export type AdminBanner = {
  _id: string;
  imageUrl: string;
  imagePublicId: string;
  productId?: string;
  productTitle?: string;
  linkUrl?: string;
  title?: string;
  createdAt: string;
};

export type AdminBannersResponse = {
  items: AdminBanner[];
};
