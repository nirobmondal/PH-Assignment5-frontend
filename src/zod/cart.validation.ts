import z from "zod";

export const IAddToCartSchema = z.object({
  medicineId: z.string("Medicine id must be a valid UUID"),
  quantity: z.coerce
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0"),
});

export const IUpdateCartItemSchema = z.object({
  medicineId: z.string("Medicine id must be a valid UUID"),
  quantity: z.coerce
    .number()
    .int("Quantity must be an integer")
    .nonnegative("Quantity cannot be negative"),
});

export type IAddToCartPayload = z.infer<typeof IAddToCartSchema>;
export type IUpdateCartPayload = z.infer<typeof IUpdateCartItemSchema>;
