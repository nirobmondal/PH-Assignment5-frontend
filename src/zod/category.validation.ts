import { z } from "zod";

export const createCategoryZodSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name cannot exceed 255 characters"),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
});

export type ICreateCategoryPayload = z.infer<typeof createCategoryZodSchema>;

export const updateCategoryZodSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name cannot exceed 255 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
});

export type IUpdateCategoryPayload = z.infer<typeof updateCategoryZodSchema>;
