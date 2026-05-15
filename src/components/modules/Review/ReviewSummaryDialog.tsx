"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { IReviewResponse } from "@/types/review.types";
import ReviewStars from "./ReviewStars";

interface ReviewSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: IReviewResponse | null;
}

const ReviewSummaryDialog = ({
  open,
  onOpenChange,
  review,
}: ReviewSummaryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review summary</DialogTitle>
          <DialogDescription>
            Review details submitted by the customer.
          </DialogDescription>
        </DialogHeader>

        {!review ? (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            No review selected.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Customer
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {review.customer?.name || "Unknown"}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Medicine
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {review.medicine?.name || "-"}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Rating
              </p>
              <ReviewStars value={review.rating} />
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Comment
              </p>
              <p className="text-sm text-foreground">
                {review.comment || "No comment provided."}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewSummaryDialog;
