"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCategoryZodSchema } from "@/zod/category.validation";

const normalizeOptionalText = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export type CategoryFormValues = {
  name: string;
  description: string;
};

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  initialValues?: Partial<CategoryFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: { name: string; description?: string }) => Promise<void>;
};

const CategoryFormDialog = ({
  open,
  onOpenChange,
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
}: CategoryFormDialogProps) => {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = createCategoryZodSchema.safeParse({
        name: value.name,
        description: normalizeOptionalText(value.description),
      });

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
      setFormError(null);
      return;
    }

    form.setFieldValue("name", initialValues?.name ?? "");
    form.setFieldValue("description", initialValues?.description ?? "");
    setFormError(null);
  }, [open, initialValues, form]);

  const dialogTitle = mode === "create" ? "Create Category" : "Update Category";
  const dialogDescription =
    mode === "create"
      ? "Add a new category to your catalog."
      : "Update the selected category details.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
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
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result =
                  createCategoryZodSchema.shape.name.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Name"
                type="text"
                placeholder="Category name"
              />
            )}
          </form.Field>

          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => {
                const normalized = normalizeOptionalText(value);
                if (!normalized) {
                  return undefined;
                }
                const result =
                  createCategoryZodSchema.shape.description.safeParse(
                    normalized,
                  );
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              },
            }}
          >
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

export default CategoryFormDialog;
