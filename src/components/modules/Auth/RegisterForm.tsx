"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, User, Mail, LockKeyhole } from "lucide-react";
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
import { registerUser } from "@/services/auth.services";
import {
  authValidation,
  IRegisterCustomerPayload,
} from "@/zod/auth.validation";

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterCustomerPayload) => registerUser(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const result = (await mutateAsync(value)) as any;

        if (!result.success) {
          setServerError(result.message || "Registration failed");
          return;
        }
      } catch (error: any) {
        setServerError(error?.message || "Registration failed");
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl border border-gray-100 bg-white shadow-xl">
      <CardHeader className="space-y-2 px-6 pt-8 pb-4 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Create an Account
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Join Niramoy today and start exploring.
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
          {/* Full Name Field */}
          <form.Field
            name="name"
            validators={{
              onChange:
                authValidation.registerCustomerValidationSchema.shape.name,
            }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <AppField
                  field={field}
                  label=""
                  type="text"
                  placeholder="John Doe"
                  prepend={<User className="h-4 w-4 text-gray-400" />}
                  className="pl-9"
                />
              </div>
            )}
          </form.Field>

          {/* Email Field */}
          <form.Field
            name="email"
            validators={{
              onChange:
                authValidation.registerCustomerValidationSchema.shape.email,
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

          {/* Password Field */}
          <form.Field
            name="password"
            validators={{
              onChange:
                authValidation.registerCustomerValidationSchema.shape.password,
            }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <AppField
                  field={field}
                  label=""
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  prepend={<LockKeyhole className="h-4 w-4 text-gray-400" />}
                  className="pl-9"
                  append={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
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
                pendingLabel="Creating account..."
                disabled={!canSubmit}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50"
              >
                Register
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-gray-100 px-6 py-5">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-gray-900 hover:underline underline-offset-4 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
