"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IReviewResponse } from "@/types/review.types";
import ReviewForm from "./ReviewForm";

interface ReviewEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: IReviewResponse | null;
  isSubmitting?: boolean;
  onSubmit: (payload: { rating: number; comment?: string }) => void;
}

const ReviewEditDialog = ({
  open,
  onOpenChange,
  review,
  isSubmitting,
  onSubmit,
}: ReviewEditDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update review</DialogTitle>
          <DialogDescription>
            Adjust the rating or refine the comment.
          </DialogDescription>
        </DialogHeader>

        {!review ? (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            No review selected.
          </div>
        ) : (
          <ReviewForm
            title="Update your review"
            initialRating={review.rating}
            initialComment={review.comment || ""}
            submitLabel="Update review"
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewEditDialog;
