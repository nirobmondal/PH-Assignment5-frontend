"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";

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
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Verify Email</CardTitle>
        <CardDescription>
          {hasEmail
            ? `We sent a 6‑digit OTP to ${initialEmail}.`
            : "Enter the 6‑digit OTP sent to your email address."}
        </CardDescription>
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
          {/* Only show email field if no email provided from URL */}
          {!hasEmail && (
            <form.Field
              name="email"
              validators={{
                onChange:
                  authValidation.verifyEmailValidationSchema.shape.email,
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                />
              )}
            </form.Field>
          )}
          444422
          {/* OTP field always visible */}
          <form.Field
            name="otp"
            validators={{
              onChange: authValidation.verifyEmailValidationSchema.shape.otp,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="One‑Time Password (OTP)"
                type="text"
                placeholder="123456"
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
                pendingLabel="Verifying..."
                disabled={!canSubmit}
              >
                Verify Email
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <div className="text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">
            Return to login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VerifyEmailForm;
