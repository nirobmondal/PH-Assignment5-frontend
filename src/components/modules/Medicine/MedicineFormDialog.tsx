"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createMedicineZodSchema,
} from "@/zod/medicine.validation";

const normalizeOptionalText = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const parseNumberInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return Number.NaN;
  }
  return Number(trimmed);
};

export type MedicineFormValues = {
  name: string;
  description: string;
  price: string;
  stock: string;
  dosageForm: string;
  strength: string;
  categoryId: string;
  manufacturerId: string;
  isFeatured: boolean;
  isAvailable: boolean;
  file: File | null;
};

type OptionItem = {
  label: string;
  value: string;
};

type MedicineFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  initialValues?: Partial<MedicineFormValues>;
  categories: OptionItem[];
  manufacturers: OptionItem[];
  isSubmitting?: boolean;
  onSubmit: (values: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    dosageForm: string;
    strength: string;
    categoryId: string;
    manufacturerId: string;
    isFeatured?: boolean;
    isAvailable?: boolean;
    file?: File;
  }) => Promise<void>;
};

const MedicineFormDialog = ({
  open,
  onOpenChange,
  mode,
  initialValues,
  categories,
  manufacturers,
  isSubmitting,
  onSubmit,
}: MedicineFormDialogProps) => {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      dosageForm: "",
      strength: "",
      categoryId: "",
      manufacturerId: "",
      isFeatured: false,
      isAvailable: true,
      file: null as File | null,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        name: value.name,
        description: normalizeOptionalText(value.description),
        price: parseNumberInput(value.price),
        stock: parseNumberInput(value.stock),
        dosageForm: value.dosageForm,
        strength: value.strength,
        categoryId: value.categoryId,
        manufacturerId: value.manufacturerId,
        isFeatured: value.isFeatured,
        isAvailable: mode === "update" ? value.isAvailable : undefined,
        file: value.file || undefined,
      };

      const parsed = createMedicineZodSchema.safeParse(payload);

      if (!parsed.success) {
        setFormError(parsed.error.issues[0].message);
        return;
      }

      setFormError(null);
      await onSubmit(parsed.data);
    },
  });

  useEffect(() => {
    if (!open) {
      form.setFieldValue("name", "");
      form.setFieldValue("description", "");
      form.setFieldValue("price", "");
      form.setFieldValue("stock", "");
      form.setFieldValue("dosageForm", "");
      form.setFieldValue("strength", "");
      form.setFieldValue("categoryId", "");
      form.setFieldValue("manufacturerId", "");
      form.setFieldValue("isFeatured", false);
        form.setFieldValue("isAvailable", true);
      form.setFieldValue("file", null);
      setFormError(null);
      return;
    }

    form.setFieldValue("name", initialValues?.name ?? "");
    form.setFieldValue("description", initialValues?.description ?? "");
    form.setFieldValue("price", initialValues?.price ?? "");
    form.setFieldValue("stock", initialValues?.stock ?? "");
    form.setFieldValue("dosageForm", initialValues?.dosageForm ?? "");
    form.setFieldValue("strength", initialValues?.strength ?? "");
    form.setFieldValue("categoryId", initialValues?.categoryId ?? "");
    form.setFieldValue("manufacturerId", initialValues?.manufacturerId ?? "");
    form.setFieldValue("isFeatured", Boolean(initialValues?.isFeatured));
    form.setFieldValue(
      "isAvailable",
      initialValues?.isAvailable ?? mode === "create",
    );
    form.setFieldValue("file", null);
    setFormError(null);
  }, [open, initialValues, form, mode]);

  const dialogTitle = mode === "create" ? "Create Medicine" : "Update Medicine";
  const dialogDescription =
    mode === "create"
      ? "Add a new medicine to your catalog."
      : "Update the selected medicine details.";

  const categoryOptions = useMemo(() => categories, [categories]);
  const manufacturerOptions = useMemo(() => manufacturers, [manufacturers]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  createMedicineZodSchema.shape.name.safeParse(value).success
                    ? undefined
                    : "Medicine name is required",
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Medicine name"
                  type="text"
                  placeholder="Medicine name"
                />
              )}
            </form.Field>

            <form.Field
              name="strength"
              validators={{
                onChange: ({ value }) =>
                  createMedicineZodSchema.shape.strength.safeParse(value)
                    .success
                    ? undefined
                    : "Strength is required",
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Strength"
                  type="text"
                  placeholder="500mg"
                />
              )}
            </form.Field>

            <form.Field
              name="dosageForm"
              validators={{
                onChange: ({ value }) =>
                  createMedicineZodSchema.shape.dosageForm.safeParse(value)
                    .success
                    ? undefined
                    : "Dosage form is required",
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Dosage form"
                  type="text"
                  placeholder="Tablet"
                />
              )}
            </form.Field>

            <form.Field
              name="price"
              validators={{
                onChange: ({ value }) => {
                  const numericValue = parseNumberInput(value);
                  const result =
                    createMedicineZodSchema.shape.price.safeParse(numericValue);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Price"
                  type="number"
                  placeholder="0"
                />
              )}
            </form.Field>

            <form.Field
              name="stock"
              validators={{
                onChange: ({ value }) => {
                  const numericValue = parseNumberInput(value);
                  const result =
                    createMedicineZodSchema.shape.stock.safeParse(numericValue);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Stock"
                  type="number"
                  placeholder="0"
                />
              )}
            </form.Field>

            <form.Field name="categoryId">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>Category</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="manufacturerId">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>Manufacturer</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Select manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {manufacturerOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Optional description"
                />
              </div>
            )}
          </form.Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="file">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="medicine-file">Image file</Label>
                  <Input
                    id="medicine-file"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      field.handleChange(file);
                    }}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="isFeatured">
              {(field) => (
                <div className="flex items-center gap-2 pt-6">
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(value) =>
                      field.handleChange(Boolean(value))
                    }
                  />
                  <Label>Featured medicine</Label>
                </div>
              )}
            </form.Field>

            {mode === "update" && (
              <form.Field name="isAvailable">
                {(field) => (
                  <div className="flex items-center gap-2 pt-6">
                    <Checkbox
                      checked={field.state.value}
                      onCheckedChange={(value) =>
                        field.handleChange(Boolean(value))
                      }
                    />
                    <Label>Available for sale</Label>
                  </div>
                )}
              </form.Field>
            )}
          </div>

          

          {formError && (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmittingForm]) => (
                <AppSubmitButton
                  isPending={Boolean(isSubmitting) || isSubmittingForm}
                  pendingLabel={mode === "create" ? "Creating..." : "Saving..."}
                  disabled={!canSubmit}
                  className="w-full sm:w-auto"
                >
                  {mode === "create" ? "Create" : "Update"}
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicineFormDialog;
