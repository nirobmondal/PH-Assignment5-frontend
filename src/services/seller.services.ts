"use server";

import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { ISellerResponse } from "@/types/seller.types";

import {
  createSellerProfileSchema,
  ICreateSellerProfilePayload,
} from "@/zod/seller.validation";
import { redirect } from "next/navigation";

export const createSellerProfile = async (
  payload: ICreateSellerProfilePayload,
): Promise<ApiResponse<ISellerResponse | ApiErrorResponse>> => {
  const parsedPayload = createSellerProfileSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }
  try {
    const response = await httpClient.post<ISellerResponse>(
      "/seller/create-profile",
      parsedPayload.data,
    );

    if (!response.success) {
      return response;
    }

    const { accessToken, refreshToken, token, user } = response.data;
    const { role } = user;
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

    const targetPath = getDefaultDashboardRoute(role as UserRole);
    redirect(targetPath);
  } catch (error: any) {
    console.log(error, "error");
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      success: false,
      message: `Seller profile creation failed: ${error.response?.data?.message}`,
    };
  }
};
