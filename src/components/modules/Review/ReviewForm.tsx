"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReviewStars from "./ReviewStars";

interface ReviewFormProps {
  title?: string;
  initialRating?: number;
  initialComment?: string;
  submitLabel?: string;
  onSubmit: (payload: { rating: number; comment?: string }) => void;
  isSubmitting?: boolean;
}

const ReviewForm = ({
  title = "Write a review",
  initialRating = 0,
  initialComment = "",
  submitLabel = "Submit review",
  onSubmit,
  isSubmitting,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const isValid = useMemo(() => rating >= 1 && rating <= 5, [rating]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">
          Share your experience to help others.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Rating
        </p>
        <ReviewStars
          value={rating}
          onChange={setRating}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Comment
        </p>
        <Textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share the highlights, delivery, or usage notes"
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="button"
        onClick={() =>
          onSubmit({
            rating,
            comment: comment.trim() ? comment.trim() : undefined,
          })
        }
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : submitLabel}
      </Button>
    </div>
  );
};

export default ReviewForm;
