"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Mail, KeyRound } from "lucide-react";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authValidation, IVerifyEmailPayload } from "@/zod/auth.validation";
import { verifyUserEmail } from "@/services/auth.services";
import { toast } from "sonner";
import { ResendOtpButton } from "./ResendOtpButton";

const VerifyEmailForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IVerifyEmailPayload) => verifyUserEmail(payload),
  });

  const form = useForm({
    defaultValues: { email: initialEmail, otp: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync({
          email: value.email,
          otp: value.otp,
        });
        if (!result.success) {
          setServerError(result.message || "Verification failed");
          return;
        }

        toast.success("Email verified successfully!");
        router.push("/login");
      } catch (error: any) {
        setServerError(error?.message || "Verification failed");
      }
    },
  });

  // Determine if we already have the email from URL
  const hasEmail = !!initialEmail;

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl border border-gray-100 bg-white shadow-xl">
      <CardHeader className="space-y-2 px-6 pt-8 pb-4 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Verify Email
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {hasEmail
            ? `We sent a 6‑digit OTP to ${initialEmail}.`
            : "Enter the 6‑digit OTP sent to your email address."}
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
          {/* Email field (only if not provided in URL) */}
          {!hasEmail && (
            <form.Field
              name="email"
              validators={{
                onChange:
                  authValidation.verifyEmailValidationSchema.shape.email,
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
                    className="pl-9"
                  />
                </div>
              )}
            </form.Field>
          )}

          {/* OTP field - always visible */}
          <form.Field
            name="otp"
            validators={{
              onChange: authValidation.verifyEmailValidationSchema.shape.otp,
            }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  One‑Time Password (OTP)
                </label>
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

          <div className="flex justify-end">
            <ResendOtpButton
              email={initialEmail}
              initialCooldownSeconds={300}
            />
          </div>

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
                pendingLabel="Verifying..."
                disabled={!canSubmit}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50"
              >
                Verify Email
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
            Return to login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VerifyEmailForm;
