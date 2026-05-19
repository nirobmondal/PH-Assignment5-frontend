"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Store, MapPin, Phone } from "lucide-react";

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
import { createSellerProfile } from "@/services/seller.services";
import {
  createSellerProfileSchema,
  ICreateSellerProfilePayload,
} from "@/zod/seller.validation";

export default function SellerCreatePage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ICreateSellerProfilePayload) =>
      createSellerProfile(payload),
  });

  const form = useForm({
    defaultValues: {
      shopName: "",
      shopAddress: "",
      shopPhone: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const result = await mutateAsync(value);
        if (!result.success) {
          setServerError(result.message || "Failed to create seller profile");
          return;
        }

        toast.success("Seller profile created! Redirecting to dashboard...");
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        router.push("/seller/dashboard");
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
      <CardHeader className="space-y-2 px-6 pt-8 pb-4 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Become a Seller
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Provide your shop details to start selling on Niramoy.
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
          {/* Shop Name Field */}
          <form.Field
            name="shopName"
            validators={{
              onChange: createSellerProfileSchema.shape.shopName,
            }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Shop Name
                </label>
                <AppField
                  field={field}
                  label=""
                  type="text"
                  placeholder="Niramoy Pharmacy"
                  prepend={<Store className="h-4 w-4 text-gray-400" />}
                  className="pl-9"
                />
              </div>
            )}
          </form.Field>

          {/* Shop Address Field */}
          <form.Field name="shopAddress">
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Shop Address
                </label>
                <AppField
                  field={field}
                  label=""
                  type="text"
                  placeholder="123, Main Street, Dhaka"
                  prepend={<MapPin className="h-4 w-4 text-gray-400" />}
                  className="pl-9"
                />
              </div>
            )}
          </form.Field>

          {/* Shop Phone Field */}
          <form.Field name="shopPhone">
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Shop Phone
                </label>
                <AppField
                  field={field}
                  label=""
                  type="tel"
                  placeholder="+8801XXXXXXXXX"
                  prepend={<Phone className="h-4 w-4 text-gray-400" />}
                  className="pl-9"
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
                pendingLabel="Creating seller profile..."
                disabled={!canSubmit}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50"
              >
                Become a Seller
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-gray-100 px-6 py-5">
        <p className="text-sm text-gray-500">
          Already a seller?{" "}
          <button
            type="button"
            onClick={() => router.push("/seller/dashboard")}
            className="font-semibold text-gray-900 hover:underline underline-offset-4 transition-colors"
          >
            Go to dashboard
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
