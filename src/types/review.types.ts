export interface IReviewResponse {
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
