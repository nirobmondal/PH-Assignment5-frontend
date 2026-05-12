"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IOrder, IOrderResponse } from "@/types/order.types";
import {
  createOrderSchema,
  ICreateOrderPayload,
  IUpdateOrderStatusPayload,
} from "@/zod/order.validation";

export const initiateOrder = async (
  payload: ICreateOrderPayload,
): Promise<ApiResponse<unknown>> => {
  const parsedPayload = createOrderSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    return await httpClient.post<unknown>("/order", parsedPayload.data);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const placeOrderWithPayment = async (
  orderId: string,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.post<unknown>(`/order/${orderId}/place`);
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

export const cancelOrder = async (
  orderId: string,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.patch<unknown>(`/order/${orderId}/cancel`, {});
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
): Promise<ApiResponse<unknown>> => {
  const parsedPayload = createOrderSchema.safeParse({ status });

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }
  try {
    return await httpClient.patch<unknown>(`/order/${orderId}/status`, {
      status,
    });
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};
