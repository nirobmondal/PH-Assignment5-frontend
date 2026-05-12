"use client";

import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, Upload } from "lucide-react";
import Image from "next/image";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { getUserInfo, updateUserProfile } from "@/services/auth.services";
import { authValidation } from "@/zod/auth.validation";

export default function MyProfilePage() {
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Fetch current user
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserInfo,
  });

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Profile updated successfully!");
      setImageFile(null);
      setImagePreview(null);
    },
    onError: (err: any) => {
      setServerError(err?.response?.data?.message || "Update failed");
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      shopName: "",
      shopPhone: "",
      shopAddress: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      // Validate user fields
      const userValid = authValidation.updateUserValidationSchema.safeParse({
        name: value.name,
        phone: value.phone,
      });
      if (!userValid.success) {
        setServerError(userValid.error.issues[0].message);
        return;
      }

      // If seller, validate seller fields
      if (user.role === "SELLER") {
        const sellerValid =
          authValidation.updateSellerProfileValidationSchema.safeParse({
            shopName: value.shopName,
            shopPhone: value.shopPhone,
            shopAddress: value.shopAddress,
          });
        if (!sellerValid.success) {
          setServerError(sellerValid.error.issues[0].message);
          return;
        }
      }

      const formData = new FormData();
      // Prepare data object
      const dataObj: any = {
        name: value.name,
        phone: value.phone,
      };
      if (user.role === "SELLER") {
        dataObj.seller = {
          shopName: value.shopName,
          shopPhone: value.shopPhone,
          shopAddress: value.shopAddress,
        };
      }
      if (imageFile) {
        formData.append("file", imageFile);
      }
      formData.append("data", JSON.stringify(dataObj));

      await updateMutation.mutateAsync(formData);
    },
  });

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      form.setFieldValue("name", user.name || "");
      form.setFieldValue("phone", user.phone || "");
      if (user.seller) {
        form.setFieldValue("shopName", user.seller.shopName || "");
        form.setFieldValue("shopPhone", user.seller.shopPhone || "");
        form.setFieldValue("shopAddress", user.seller.shopAddress || "");
      }
      if (user.image) {
        setImagePreview(user.image);
      }
    }
  }, [user, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !user) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load profile. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const isSeller = user.role === "SELLER";

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Profiles</CardTitle>
        <CardDescription>Manage your account information</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
          noValidate
        >
          {/* Avatar / Image Upload */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="h-28 w-28 overflow-hidden rounded-full border bg-muted">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile"
                    width={112}
                    height={112}
                    className="object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-secondary">
                    <Camera className="h-9 w-9 text-muted-foreground" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-primary p-1.5 text-white shadow-sm"
              >
                <Upload className="h-4 w-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <Badge
                  variant={user.role === "ADMIN" ? "destructive" : "default"}
                >
                  {user.role}
                </Badge>
              </div>
              <p className="mt-2 text-md text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* User Information Section */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">User Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field
                name="name"
                validators={{
                  onChange:
                    authValidation.updateUserValidationSchema.shape.name,
                }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Full name"
                    type="text"
                    placeholder="Full name"
                  />
                )}
              </form.Field>

              <form.Field name="phone">
                {(field) => (
                  <AppField
                    field={field}
                    label="Phone"
                    type="tel"
                    placeholder="Phone"
                  />
                )}
              </form.Field>
            </div>

            <div className="space-y-2">
              <label htmlFor="profile-image" className="text-sm font-medium">
                Image file upload
              </label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Seller Information (conditional) */}
          {isSeller && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Seller Information</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field
                  name="shopName"
                  validators={{
                    onChange:
                      authValidation.updateSellerProfileValidationSchema.shape
                        .shopName,
                  }}
                >
                  {(field) => (
                    <AppField
                      field={field}
                      label="Shop name"
                      type="text"
                      placeholder="Shop name"
                    />
                  )}
                </form.Field>

                <form.Field name="shopPhone">
                  {(field) => (
                    <AppField
                      field={field}
                      label="Shop phone"
                      type="tel"
                      placeholder="Shop phone"
                    />
                  )}
                </form.Field>
              </div>

              <form.Field name="shopAddress">
                {(field) => (
                  <AppField
                    field={field}
                    label="Shop address"
                    type="text"
                    placeholder="Shop address"
                  />
                )}
              </form.Field>
            </div>
          )}

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || updateMutation.isPending}
                  pendingLabel="Saving..."
                  disabled={!canSubmit}
                  className="w-full sm:w-auto"
                >
                  Save Changes
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
