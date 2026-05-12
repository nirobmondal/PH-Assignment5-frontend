export interface Medicine {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  dosageForm: string;
  strength: string;

  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;

  avgRating: number;
  reviewCount: number;

  categoryId: string;
  manufacturerId: string;
  sellerId: string;
}

export interface MedicineWithRelations extends Medicine {
  category: {
    id: string;
    name: string;
  };
  manufacturer: {
    id: string;
    name: string;
    country: string;
  };
  seller: {
    id: string;
    name: string;
    shopName: string;
  };
}

export interface MedicineWithSellerRelations extends Medicine {
  category: {
    id: string;
    name: string;
  };
  manufacturer: {
    id: string;
    name: string;
    country: string;
  };
}

export interface IMedicineListResponse {
  data: MedicineWithRelations[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IMedicineSellerListResponse {
  data: MedicineWithSellerRelations[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
