"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";
import { googleLogin } from "@/services/auth.services";

const GOOGLE_BTN_MAX_WIDTH = 400;

export default function GoogleLoginButton() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number | undefined>();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      const measured = Math.floor(element.getBoundingClientRect().width);
      if (measured > 0) {
        setButtonWidth(Math.min(measured, GOOGLE_BTN_MAX_WIDTH));
      }
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;
    if (!idToken) return;

    try {
      const response = await googleLogin(idToken);

      if (!response.success) {
        alert(response.message || "Login Failed!");
        return;
      }

      const role = response.data.user.role as UserRole;
      const redirectPath = getDefaultDashboardRoute(role);
      router.push(redirectPath);
    } catch {
      alert("Login Failed!");
    }
  };

  return (
    <div ref={containerRef} className="google-login-container w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        size="large"
        width={buttonWidth}
        containerProps={{ className: "w-full" }}
      />
    </div>
  );
}
