export interface CartItem {
  id: string;
  cartId: string;
  medicineId: string;
  quantity: number;
  unitPrice: number;
  createdAt?: string;
  updatedAt?: string;
  medicine?: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    isAvailable: boolean;
    stock: number;
  };
}

export interface ICartResponse {
  id: string;
  userId: string;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItem[];
}
