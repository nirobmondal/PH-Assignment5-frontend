import { IOrder, OrderStatus, PaymentStatus } from "@/types/order.types";

export const formatPrice = (value: number | string) => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numericValue)) {
    return "-";
  }
  return `BDT ${numericValue.toFixed(2)}`;
};

export const formatDate = (value: string | Date | undefined) => {
  if (!value) {
    return "-";
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString();
};

export const getOrderShortId = (id: string) => {
  return id.slice(0, 8).toUpperCase();
};

export const getOrderItemCount = (order: IOrder) => {
  return order.sellerOrders.reduce((total, sellerOrder) => {
    return (
      total + sellerOrder.items.reduce((sum, item) => sum + item.quantity, 0)
    );
  }, 0);
};

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PLACED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SHIPPED: "bg-cyan-100 text-cyan-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export const PAYMENT_STATUS_BADGE_CLASSES: Record<PaymentStatus, string> = {
  PENDING: "bg-orange-100 text-orange-800",
  PAID: "bg-emerald-100 text-emerald-800",
};
