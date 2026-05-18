"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { UserStatus } from "@/types/auth.types";
import { IUserListResponse } from "@/types/user.types";

export const getAllUsers = async (
  queryParams: string,
): Promise<ApiResponse<IUserListResponse | ApiErrorResponse>> => {
  try {
    return await httpClient.get<IUserListResponse>(
      queryParams ? `/admin/users?${queryParams}` : "/admin/users",
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};

export const updateUserStatus = async (
  userId: string,
  status: UserStatus,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.patch<unknown>(`/admin/users/${userId}/status`, {
      status,
    });
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.response?.data?.message}`,
    };
  }
};
