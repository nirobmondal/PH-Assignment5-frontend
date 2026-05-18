"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, KeyRound, Lock } from "lucide-react";
import { z } from "zod";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authValidation, IResetPasswordPayload } from "@/zod/auth.validation";
import { resetUserPassword } from "@/services/auth.services";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IResetPasswordPayload) => resetUserPassword(payload),
  });

  const form = useForm({
    defaultValues: {
      email: email || "",
      otp: "",
      newPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);

        if (!result.success) {
          setServerError(result.message || "Password reset failed");
          return;
        }
        toast.success(
          "Password reset successful! Please login with your new password.",
        );
        router.push("/login");
      } catch (error: any) {
        setServerError(error?.message || "Something went wrong");
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl border border-gray-100 bg-white shadow-xl">
      <CardHeader className="space-y-2 px-6 pt-8 pb-4 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Reset Password
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Enter the OTP and set a new password.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5"
          noValidate
        >
          {/* Email Field (disabled, non-editable) */}
          <form.Field
            name="email"
            validators={{
              onChange:
                authValidation.resetPasswordValidationSchema.shape.email,
            }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <AppField
                  field={field}
                  label=""
                  type="email"
                  placeholder="you@example.com"
                  prepend={<Mail className="h-4 w-4 text-gray-400" />}
                  className="pl-9 bg-gray-50"
                  disabled
                />
              </div>
            )}
          </form.Field>

          {/* OTP Field */}
          <form.Field
            name="otp"
            validators={{
              onChange: authValidation.resetPasswordValidationSchema.shape.otp,
            }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">OTP</label>
                <AppField
                  field={field}
                  label=""
                  type="text"
                  placeholder="123456"
                  prepend={<KeyRound className="h-4 w-4 text-gray-400" />}
                  className="pl-9"
                />
              </div>
            )}
          </form.Field>

          {/* New Password Field */}
          <form.Field
            name="newPassword"
            validators={{
              onChange:
                authValidation.resetPasswordValidationSchema.shape.newPassword,
            }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <AppField
                  field={field}
                  label=""
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••"
                  prepend={<Lock className="h-4 w-4 text-gray-400" />}
                  className="pl-9"
                  append={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        aria-label={
                          showNewPassword ? "Hide password" : "Show password"
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    }
                />
              </div>
            )}
          </form.Field>

          {/* Server Error Alert */}
          {serverError && (
            <Alert
              variant="destructive"
              className="rounded-lg border-red-200 bg-red-50"
            >
              <AlertDescription className="text-sm text-red-600">
                {serverError}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Resetting password..."
                disabled={!canSubmit}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50"
              >
                Reset Password
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-gray-100 px-6 py-5">
        <div className="text-sm text-gray-500">
          <Link
            href="/login"
            className="font-semibold text-gray-900 hover:underline underline-offset-4 transition-colors"
          >
            Back to login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordForm;
