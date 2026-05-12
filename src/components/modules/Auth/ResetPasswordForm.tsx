"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
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
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>Enter the OTP and set a new password.</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
          noValidate
        >
          {/* this field can't edited. implement that */}
          <form.Field
            name="email"
            validators={{
              onChange:
                authValidation.resetPasswordValidationSchema.shape.email,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="you@example.com"
                disabled
              />
            )}
          </form.Field>

          <form.Field
            name="otp"
            validators={{
              onChange: authValidation.resetPasswordValidationSchema.shape.otp,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="OTP"
                type="text"
                placeholder="123456"
              />
            )}
          </form.Field>

          <form.Field
            name="newPassword"
            validators={{
              onChange:
                authValidation.resetPasswordValidationSchema.shape.newPassword,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••"
                append={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Resetting password..."
                disabled={!canSubmit}
              >
                Reset Password
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <div className="text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordForm;
