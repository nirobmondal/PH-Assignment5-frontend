"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import {
  IOrder,
  IOrderResponse,
  IPlaceOrderResponse,
  OrderStatus,
  PaymentStatus,
} from "@/types/order.types";
import {
  createOrderSchema,
  ICreateOrderPayload,
  IUpdateOrderStatusPayload,
  updateOrderStatusSchema,
} from "@/zod/order.validation";

export const initiateOrder = async (
  payload: ICreateOrderPayload,
): Promise<ApiResponse<IOrder>> => {
  const parsedPayload = createOrderSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    return await httpClient.post<IOrder>("/order", parsedPayload.data);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const placeOrderWithPayment = async (
  orderId: string,
): Promise<ApiResponse<IPlaceOrderResponse>> => {
  try {
    return await httpClient.post<IPlaceOrderResponse>(
      `/order/${orderId}/place`,
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const getOrderById = async (
  orderId: string,
): Promise<ApiResponse<IOrder | ApiErrorResponse>> => {
  try {
    return await httpClient.get<IOrder>(`/order/${orderId}`);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const getOrders = async (
  queryParams: string,
): Promise<ApiResponse<IOrderResponse | ApiErrorResponse>> => {
  try {
    return await httpClient.get<IOrderResponse>(
      queryParams ? `/order?${queryParams}` : "/order",
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: OrderStatus | string;
  paymentStatus?: PaymentStatus | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const buildOrderQueryString = async (params: OrderQueryParams) => {
  const queryParams = new URLSearchParams();

  if (params.page) {
    queryParams.set("page", String(params.page));
  }

  if (params.limit) {
    queryParams.set("limit", String(params.limit));
  }

  if (params.searchTerm) {
    queryParams.set("searchTerm", params.searchTerm);
  }

  if (params.status) {
    queryParams.set("status", String(params.status));
  }

  if (params.paymentStatus) {
    queryParams.set("paymentStatus", String(params.paymentStatus));
  }

  if (params.sortBy) {
    queryParams.set("sortBy", params.sortBy);
  }

  if (params.sortOrder) {
    queryParams.set("sortOrder", params.sortOrder);
  }

  return queryParams.toString();
};

export const getOrdersByParams = async (
  params: OrderQueryParams,
): Promise<ApiResponse<IOrderResponse | ApiErrorResponse>> => {
  const queryString = await buildOrderQueryString(params);
  return getOrders(queryString);
};

export const cancelOrder = async (
  orderId: string,
): Promise<ApiResponse<IOrder>> => {
  try {
    return await httpClient.patch<IOrder>(`/order/${orderId}/cancel`, {});
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: IUpdateOrderStatusPayload,
): Promise<ApiResponse<IOrder>> => {
  const parsedPayload = updateOrderStatusSchema.safeParse(status);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    return await httpClient.patch<IOrder>(
      `/order/${orderId}/status`,
      parsedPayload.data,
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};
