"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { deleteCookie } from "@/lib/cookieUtils";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { ILoginResponse, IRegisterResponse } from "@/types/auth.types";
import {
  authValidation,
  IChangePasswordPayload,
  IForgotPasswordPayload,
  ILoginUserPayload,
  IRegisterCustomerPayload,
  IResetPasswordPayload,
  IVerifyEmailPayload,
} from "@/zod/auth.validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokensWithRefreshToken(
  refreshToken: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) {
      return false;
    }

    const { data } = await res.json();

    const { accessToken, refreshToken: newRefreshToken } = data;

    if (accessToken) {
      await setTokenInCookies("accessToken", accessToken);
    }

    if (newRefreshToken) {
      await setTokenInCookies("refreshToken", newRefreshToken);
    }

    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    // const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const res = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);
      return null;
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export const loginUser = async (
  payload: ILoginUserPayload,
  redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload =
    authValidation.loginUserValidationSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }
  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );

    if (!response.success) {
      return response;
    }
    const { accessToken, refreshToken, user } = response.data;
    const { role, emailVerified, email } = user;
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);

    if (!emailVerified) {
      redirect(`/verify-email?email=${email}`);
    } else {
      // redirect(redirectPath || "/dashboard");
      const targetPath =
        redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
          ? redirectPath
          : getDefaultDashboardRoute(role as UserRole);
      redirect(targetPath);
    }
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

    if (
      error &&
      error.response &&
      error.response.data.message === "Email not verified"
    ) {
      redirect(`/verify-email?email=${payload.email}`);
    }
    return {
      success: false,
      message: `Login failed: ${error.message}`,
    };
  }
};

export const registerUser = async (
  payload: IRegisterCustomerPayload,
): Promise<IRegisterResponse | ApiErrorResponse> => {
  const parsedPayload =
    authValidation.registerCustomerValidationSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<IRegisterResponse>(
      "/auth/register",
      parsedPayload.data,
    );

    if (!response.success) {
      return response;
    }

    const { user } = response.data;
    const { emailVerified, email } = user;

    if (!emailVerified) {
      redirect(`/verify-email?email=${email}`);
    }

    redirect("/login");
  } catch (error: any) {
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
      message: `Registration failed: ${error.message}`,
    };
  }
};

export const sendForgotPasswordOtp = async (
  payload: IForgotPasswordPayload,
): Promise<ApiResponse<null>> => {
  const parsedPayload =
    authValidation.forgetPasswordValidationSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    return await httpClient.post<null>(
      "/auth/forget-password",
      parsedPayload.data,
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const resetUserPassword = async (
  payload: IResetPasswordPayload,
): Promise<ApiResponse<null>> => {
  const parsedPayload =
    authValidation.resetPasswordValidationSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    return await httpClient.post<null>(
      "/auth/reset-password",
      parsedPayload.data,
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const googleLogin = async (
  idToken: string,
): Promise<ApiResponse<ILoginResponse>> => {
  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/google-login",
      { idToken },
    );
    if (!response.success) {
      return response;
    }
    const { accessToken, refreshToken, user } = response.data;
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);

    return response;
  } catch (error: any) {
    return {
      success: false,
      message: `Google login failed: ${error.message}`,
    };
  }
};

export const verifyUserEmail = async (
  payload: IVerifyEmailPayload,
): Promise<ApiResponse<null>> => {
  const parsedPayload =
    authValidation.verifyEmailValidationSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    return await httpClient.post<null>(
      "/auth/verify-email",
      parsedPayload.data,
    );
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const changeUserPassword = async (
  payload: IChangePasswordPayload,
): Promise<ApiResponse<unknown>> => {
  const parsedPayload =
    authValidation.changePasswordValidationSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid input",
    };
  }

  try {
    const response = await httpClient.post<unknown>(
      "/auth/change-password",
      parsedPayload.data,
    );

    if (!response.success) {
      return response;
    }

    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");

    return response;
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const logoutUser = async (): Promise<ApiResponse<unknown>> => {
  try {
    const response = await httpClient.post<unknown>("/auth/logout", {});
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    return response;
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};

export const updateUserProfile = async (
  formData: FormData,
): Promise<ApiResponse<unknown>> => {
  try {
    return await httpClient.patch<unknown>("/auth/update-me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    return {
      success: false,
      message: `Request failed: ${error.message}`,
    };
  }
};
