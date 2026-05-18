"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { ICartResponse } from "@/types/cart.types";
import { IAddToCartPayload, IUpdateCartPayload } from "@/zod/cart.validation";

export const getCart = async (): Promise<
  ApiResponse<ICartResponse | ApiErrorResponse>
> => {
  try {
    return await httpClient.get<ICartResponse>("/cart");
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const addToCart = async (
  payload: IAddToCartPayload,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.post<unknown>("/cart", payload);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const updateCartItem = async (
  payload: IUpdateCartPayload,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.patch<unknown>("/cart", payload);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const removeFromCart = async (
  medicineId: string,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.delete<unknown>(`/cart/${medicineId}`);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const clearCart = async (): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.delete<unknown>("/cart");
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};
