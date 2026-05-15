"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReviewDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewTitle?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
}

const ReviewDeleteDialog = ({
  open,
  onOpenChange,
  reviewTitle,
  isDeleting,
  onConfirm,
}: ReviewDeleteDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete review</AlertDialogTitle>
          <AlertDialogDescription>
            {reviewTitle
              ? `Delete the review for "${reviewTitle}"? This action cannot be undone.`
              : "Delete this review? This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReviewDeleteDialog;
