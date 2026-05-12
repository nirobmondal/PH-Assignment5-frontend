"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Become a Seller</CardTitle>
        <CardDescription>
          Provide your shop details to start selling on Niramoy.
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
          <form.Field
            name="shopName"
            validators={{
              onChange: createSellerProfileSchema.shape.shopName,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Shop Name"
                type="text"
                placeholder="Niramoy Pharmacy"
              />
            )}
          </form.Field>

          <form.Field
            name="shopAddress"
            // validators={{
            //   onChange: createSellerProfileSchema.shape.shopAddress,
            // }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Shop Address"
                type="text"
                placeholder="123, Main Street, Dhaka"
              />
            )}
          </form.Field>

          <form.Field
            name="shopPhone"
            // validators={{
            //   onChange: createSellerProfileSchema.shape.shopPhone,
            // }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Shop Phone"
                type="tel"
                placeholder="+8801XXXXXXXXX"
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
                pendingLabel="Creating seller profile..."
                disabled={!canSubmit}
                className="w-full"
              >
                Become a Seller
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Already a seller?{" "}
          <button
            type="button"
            onClick={() => router.push("/seller/dashboard")}
            className="text-primary hover:underline"
          >
            Go to dashboard
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
