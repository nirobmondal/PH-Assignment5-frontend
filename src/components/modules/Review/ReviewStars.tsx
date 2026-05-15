"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface ReviewStarsProps {
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  size?: number;
  className?: string;
}

const ReviewStars = ({
  value,
  onChange,
  disabled,
  size = 16,
  className,
}: ReviewStarsProps) => {
  const normalizedValue = Math.max(0, Math.min(5, Math.round(value || 0)));

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= normalizedValue;
        const starClass = cn(
          "transition",
          isActive
            ? "text-amber-500 fill-amber-500"
            : "text-muted-foreground/50",
        );

        if (onChange) {
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange(starValue)}
              disabled={disabled}
              className="flex items-center"
              aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
            >
              <Star className={starClass} size={size} />
            </button>
          );
        }

        return <Star key={starValue} className={starClass} size={size} />;
      })}
    </div>
  );
};

export default ReviewStars;
