import { setTokenInCookies } from "@/lib/tokenUtils";
import { NextRequest, NextResponse } from "next/server";

interface ExchangeResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
}

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const frontendUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error || !code) {
    return NextResponse.redirect(
      `${frontendUrl}/login?error=${error || "oauth_failed"}`,
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-oauth-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      },
    );

    if (!response.ok) {
      throw new Error("Exchange failed");
    }

    const { data } = await response.json();

    const { token, accessToken, refreshToken } = data;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token);

    return NextResponse.redirect(`${frontendUrl}`);
  } catch (err) {
    console.error("OAuth exchange error:", err);
    return NextResponse.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
};
