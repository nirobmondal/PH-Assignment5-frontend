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

type ManufacturerDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manufacturerName?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
};

const ManufacturerDeleteDialog = ({
  open,
  onOpenChange,
  manufacturerName,
  isDeleting,
  onConfirm,
}: ManufacturerDeleteDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete manufacturer</AlertDialogTitle>
          <AlertDialogDescription>
            {manufacturerName
              ? `Are you sure you want to delete "${manufacturerName}"? This action cannot be undone.`
              : "Are you sure you want to delete this manufacturer? This action cannot be undone."}
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

export default ManufacturerDeleteDialog;
