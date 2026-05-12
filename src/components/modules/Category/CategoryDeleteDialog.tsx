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

type CategoryDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
};

const CategoryDeleteDialog = ({
  open,
  onOpenChange,
  categoryName,
  isDeleting,
  onConfirm,
}: CategoryDeleteDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category</AlertDialogTitle>
          <AlertDialogDescription>
            {categoryName
              ? `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`
              : "Are you sure you want to delete this category? This action cannot be undone."}
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

export default CategoryDeleteDialog;
