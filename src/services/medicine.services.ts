"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import {
  IMedicineListResponse,
  IMedicineSellerListResponse,
  MedicineWithRelations,
} from "@/types/medicine.types";

export const createMedicine = async (
  payload: FormData,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.post<unknown>("/medicine", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const getAllMedicines = async (
  queryString: string,
): Promise<ApiResponse<IMedicineListResponse | ApiErrorResponse>> => {
  try {
    return await httpClient.get<IMedicineListResponse>(
      queryString ? `/medicine?${queryString}` : "/medicine",
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const getMedicineById = async (
  medicineId: string,
): Promise<ApiResponse<MedicineWithRelations | ApiErrorResponse>> => {
  try {
    return await httpClient.get<MedicineWithRelations>(
      `/medicine/${medicineId}`,
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const getMedicinesBySeller = async (
  queryString: string,
): Promise<ApiResponse<IMedicineSellerListResponse | ApiErrorResponse>> => {
  try {
    return await httpClient.get<IMedicineSellerListResponse>(
      queryString ? `/medicine/seller?${queryString}` : "/medicine/seller",
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const updateMedicine = async (
  medicineId: string,
  payload: FormData,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.patch<unknown>(`/medicine/${medicineId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const deleteMedicine = async (
  medicineId: string,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.delete<unknown>(`/medicine/${medicineId}`);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};
