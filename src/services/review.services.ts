"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IReviewResponse } from "@/types/review.types";
import {
  createReviewSchema,
  ICreateReviewPayload,
  IUpdateReviewPayload,
  updateReviewSchema,
} from "@/zod/review.validation";

export const createReview = async (
  payload: ICreateReviewPayload,
): Promise<ApiResponse<unknown>> => {
  const parsedPayload = createReviewSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    return await httpClient.post<unknown>("/review", payload);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const getReviewsByMedicineId = async (
  medicineId: string,
): Promise<ApiResponse<IReviewResponse[] | ApiErrorResponse>> => {
  try {
    return await httpClient.get<IReviewResponse[]>(
      `/review/medicine/${medicineId}`,
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const getAllReviews = async (): Promise<
  ApiResponse<IReviewResponse[] | ApiErrorResponse>
> => {
  try {
    return await httpClient.get<IReviewResponse[]>("/review");
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const updateReview = async (
  reviewId: string,
  payload: IUpdateReviewPayload,
): Promise<ApiResponse<unknown>> => {
  const parsedPayload = updateReviewSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    return await httpClient.patch<unknown>(`/review/${reviewId}`, payload);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const deleteReview = async (
  reviewId: string,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.delete<unknown>(`/review/${reviewId}`);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};
