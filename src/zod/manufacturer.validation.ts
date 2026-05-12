import { z } from "zod";

export const createManufacturerZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Manufacturer name is required")
    .max(255, "Manufacturer name cannot exceed 255 characters"),
  country: z
    .string()
    .min(1)
    .max(100, "Country cannot exceed 100 characters")
    .optional(),
});

export type ICreateManufacturerPayload = z.infer<
  typeof createManufacturerZodSchema
>;

export const updateManufacturerZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Manufacturer name is required")
    .max(255, "Manufacturer name cannot exceed 255 characters"),
  country: z
    .string()
    .trim()
    .min(1)
    .max(100, "Country cannot exceed 100 characters")
    .optional(),
});

export type IUpdateManufacturerPayload = z.infer<
  typeof updateManufacturerZodSchema
>;
