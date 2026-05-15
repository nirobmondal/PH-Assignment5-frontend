"use client";
import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";
import { googleLogin } from "@/services/auth.services";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function GoogleLoginButton() {
  const router = useRouter();

  const handleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    try {
      const response = await googleLogin(idToken);

      if (!response.success) {
        alert(response.message || "Login Failed!");
        return;
      }

      const role = response.data.user.role as UserRole;
      const redirectPath = getDefaultDashboardRoute(role);
      router.push(redirectPath);
    } catch (err) {
      alert("Login Failed!");
    }
  };

  return <GoogleLogin onSuccess={handleSuccess} />;
}
