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
import { createManufacturerZodSchema } from "@/zod/manufacturer.validation";

export type ManufacturerFormValues = {
  name: string;
  country: string;
};

type ManufacturerFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  initialValues?: Partial<ManufacturerFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: { name: string; country?: string }) => Promise<void>;
};

const ManufacturerFormDialog = ({
  open,
  onOpenChange,
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
}: ManufacturerFormDialogProps) => {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      country: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = createManufacturerZodSchema.safeParse(value);

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
      form.setFieldValue("country", "");
      setFormError(null);
      return;
    }

    form.setFieldValue("name", initialValues?.name ?? "");
    form.setFieldValue("country", initialValues?.country ?? "");
    setFormError(null);
  }, [open, initialValues, form]);

  const dialogTitle =
    mode === "create" ? "Create Manufacturer" : "Update Manufacturer";
  const dialogDescription =
    mode === "create"
      ? "Add a new manufacturer to your catalog."
      : "Update the selected manufacturer details.";

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
              onChange: createManufacturerZodSchema.shape.name,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Name"
                type="text"
                placeholder="Manufacturer name"
              />
            )}
          </form.Field>

          <form.Field name="country">
            {(field) => (
              <AppField
                field={field}
                label="Country"
                type="text"
                placeholder="Country"
              />
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

export default ManufacturerFormDialog;
