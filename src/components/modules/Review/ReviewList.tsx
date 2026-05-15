"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IReviewResponse } from "@/types/review.types";
import ReviewStars from "./ReviewStars";

interface ReviewListProps {
  reviews: IReviewResponse[];
  emptyMessage?: string;
}

const formatDate = (value: string | Date | undefined) => {
  if (!value) {
    return "-";
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString();
};

const ReviewList = ({ reviews, emptyMessage }: ReviewListProps) => {
  if (!reviews.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        {emptyMessage || "No reviews yet."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const customerInitials = review.customer?.name
          ? review.customer.name.charAt(0).toUpperCase()
          : "U";

        return (
          <div key={review.id} className="rounded-lg border bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarImage
                    src={review.customer?.image || undefined}
                    alt={review.customer?.name || "User"}
                  />
                  <AvatarFallback>{customerInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {review.customer?.name || "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
              <ReviewStars value={review.rating} />
            </div>

            {review.comment && (
              <p className="mt-3 text-sm text-muted-foreground">
                {review.comment}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
