export interface IReviewItem {
  id: string;
  rating: number;
  comment?: string;
  customerId: string;
  medicineId: string;
  orderItemId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    image: string | null;
  };
  medicine?: {
    id: string;
    name: string;
  };
}

export interface IReviewListResponse {
  data: IReviewItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// For backward compatibility and dialog usage
export interface IReviewResponse extends IReviewItem {}
