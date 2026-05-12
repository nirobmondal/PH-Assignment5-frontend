import { z } from "zod";

export const createMedicineZodSchema = z.object({
  name: z
    .string()
    .min(1, "Medicine name is required")
    .max(255, "Medicine name cannot exceed 255 characters"),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  price: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price cannot exceed 999999.99"),
  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .max(1000000, "Stock cannot exceed 1000000"),
  dosageForm: z
    .string()
    .min(1, "Dosage form is required")
    .max(100, "Dosage form cannot exceed 100 characters"),
  strength: z
    .string()
    .min(1, "Strength is required")
    .max(100, "Strength cannot exceed 100 characters"),
  categoryId: z.string().min(1, "Category is required"),
  manufacturerId: z.string().min(1, "Manufacturer is required"),
  isFeatured: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB",
    )
    .optional(),
});

export type ICreateMedicinePayload = z.infer<typeof createMedicineZodSchema>;

export const updateMedicineZodSchema = z.object({
  name: z
    .string()
    .min(1, "Medicine name is required")
    .max(255, "Medicine name cannot exceed 255 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  price: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price cannot exceed 999999.99")
    .optional(),
  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .max(1000000, "Stock cannot exceed 1000000")
    .optional(),
  dosageForm: z
    .string()
    .min(1, "Dosage form is required")
    .max(100, "Dosage form cannot exceed 100 characters")
    .optional(),
  strength: z
    .string()
    .min(1, "Strength is required")
    .max(100, "Strength cannot exceed 100 characters")
    .optional(),
  categoryId: z.string().min(1, "Category is required").optional(),
  manufacturerId: z.string().min(1, "Manufacturer is required").optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB",
    )
    .optional(),
});

export type IUpdateMedicinePayload = z.infer<typeof updateMedicineZodSchema>;
