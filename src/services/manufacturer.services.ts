"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IManufacturerResponse } from "@/types/manufacturer.types";
import {
  createManufacturerZodSchema,
  ICreateManufacturerPayload,
  IUpdateManufacturerPayload,
  updateManufacturerZodSchema,
} from "@/zod/manufacturer.validation";

export const createManufacturer = async (
  payload: ICreateManufacturerPayload,
): Promise<ApiResponse<unknown>> => {
  const parsedPayload = createManufacturerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    return await httpClient.post<unknown>("/manufacturer", parsedPayload.data);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const getManufacturers = async (): Promise<
  ApiResponse<IManufacturerResponse[] | ApiErrorResponse>
> => {
  try {
    return await httpClient.get<IManufacturerResponse[]>("/manufacturer");
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const updateManufacturer = async (
  manufacturerId: string,
  payload: IUpdateManufacturerPayload,
): Promise<ApiResponse<unknown>> => {
  const parsedPayload = updateManufacturerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    return await httpClient.patch<unknown>(
      `/manufacturer/${manufacturerId}`,
      parsedPayload.data,
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const deleteManufacturer = async (
  manufacturerId: string,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.delete<unknown>(`/manufacturer/${manufacturerId}`);
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};
