"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { ICategoryResponse } from "@/types/category.types";
import {
  createCategoryZodSchema,
  ICreateCategoryPayload,
} from "@/zod/category.validation";

export const createCategory = async (
  payload: ICreateCategoryPayload,
): Promise<ApiResponse<unknown>> => {
  const parsedPayload = createCategoryZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    return await httpClient.post<unknown>("/category", parsedPayload.data);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const getCategories = async (): Promise<
  ApiResponse<ICategoryResponse[] | ApiErrorResponse>
> => {
  try {
    return await httpClient.get<ICategoryResponse[]>("/category");
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const updateCategory = async (
  categoryId: string,
  payload: ICreateCategoryPayload,
): Promise<ApiResponse<unknown>> => {
  const parsedPayload = createCategoryZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    return await httpClient.patch<unknown>(
      `/category/${categoryId}`,
      parsedPayload.data,
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const deleteCategory = async (
  categoryId: string,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.delete<unknown>(`/category/${categoryId}`);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};
