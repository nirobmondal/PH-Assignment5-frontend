"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, KeyRound } from "lucide-react";

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
    <Card className="w-full max-w-md mx-auto rounded-2xl border border-gray-100 bg-white shadow-xl">
      <CardHeader className="space-y-2 px-6 pt-8 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Change Password
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Update your password to keep your account secure.
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
          {/* Current Password Field */}
          <form.Field
            name="currentPassword"
            validators={{
              onChange:
                authValidation.changePasswordValidationSchema.shape
                  .currentPassword,
            }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <AppField
                  field={field}
                  label=""
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  prepend={<Lock className="h-4 w-4 text-gray-400" />}
                  className="pl-9"
                  append={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowCurrent((prev) => !prev)}
                        aria-label={
                          showCurrent ? "Hide password" : "Show password"
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showCurrent ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    }
                />
              </div>
            )}
          </form.Field>

          {/* New Password Field */}
          <form.Field
            name="newPassword"
            validators={{
              onChange:
                authValidation.changePasswordValidationSchema.shape.newPassword,
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
                  type={showNew ? "text" : "password"}
                  placeholder="New password (min. 8 characters)"
                  prepend={<KeyRound className="h-4 w-4 text-gray-400" />}
                  className="pl-9"
                  append={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowNew((prev) => !prev)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showNew ? (
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
                pendingLabel="Changing password..."
                disabled={!canSubmit}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50"
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
