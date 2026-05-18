"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IDashboardStatsResponse } from "@/types/dashboard.types";

export const getDashboardStats = async (): Promise<
  ApiResponse<IDashboardStatsResponse | ApiErrorResponse>
> => {
  try {
    return await httpClient.get<IDashboardStatsResponse>("/stats/dashboard");
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};
