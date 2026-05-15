"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authValidation, IChangePasswordPayload } from "@/zod/auth.validation";
import { changeUserPassword } from "@/services/auth.services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IChangePasswordPayload) =>
      changeUserPassword(payload),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      // Validate with zod
      const parsed =
        authValidation.changePasswordValidationSchema.safeParse(value);
      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        setServerError(firstError.message);
        return;
      }

      try {
        const result = (await mutateAsync(parsed.data)) as any;

        if (!result.success) {
          setServerError(result.message || "Failed to change password");
          return;
        }

        toast.success("Password changed successfully. Please log in again.");
        router.push("/login");
      } catch (error: any) {
        setServerError(
          error?.response?.data?.message ||
            error.message ||
            "Something went wrong",
        );
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure.
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
          {/* Current Password */}
          <form.Field
            name="currentPassword"
            validators={{
              onChange:
                authValidation.changePasswordValidationSchema.shape
                  .currentPassword,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Current Password"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                append={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowCurrent((prev) => !prev)}
                    aria-label={showCurrent ? "Hide password" : "Show password"}
                  >
                    {showCurrent ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          {/* New Password */}
          <form.Field
            name="newPassword"
            validators={{
              onChange:
                authValidation.changePasswordValidationSchema.shape.newPassword,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="New Password"
                type={showNew ? "text" : "password"}
                placeholder="New password (min. 8 characters)"
                append={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNew((prev) => !prev)}
                  >
                    {showNew ? (
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
                pendingLabel="Changing password..."
                disabled={!canSubmit}
                className="w-full"
              >
                Change Password
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
