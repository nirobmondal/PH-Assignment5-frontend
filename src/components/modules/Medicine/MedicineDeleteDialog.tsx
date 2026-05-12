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

type MedicineDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicineName?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
};

const MedicineDeleteDialog = ({
  open,
  onOpenChange,
  medicineName,
  isDeleting,
  onConfirm,
}: MedicineDeleteDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete medicine</AlertDialogTitle>
          <AlertDialogDescription>
            {medicineName
              ? `Are you sure you want to delete "${medicineName}"? This action cannot be undone.`
              : "Are you sure you want to delete this medicine? This action cannot be undone."}
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

export default MedicineDeleteDialog;
