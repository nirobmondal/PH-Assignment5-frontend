import z from "zod";

export const createReviewSchema = z.object({
  orderItemId: z.string().uuid("Order item id must be a valid UUID"),
  rating: z.coerce
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .trim()
    .max(1000, "Comment must be at most 1000 characters")
    .optional(),
});

export const updateReviewSchema = z
  .object({
    rating: z.coerce
      .number()
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5")
      .optional(),
    comment: z
      .string()
      .trim()
      .max(1000, "Comment must be at most 1000 characters")
      .optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required for update",
  });

export type ICreateReviewPayload = z.infer<typeof createReviewSchema>;
export type IUpdateReviewPayload = z.infer<typeof updateReviewSchema>;
