"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MedicineWithSellerRelations } from "@/types/medicine.types";

const formatPrice = (value: number) => {
  if (Number.isNaN(value)) {
    return "-";
  }
  return `$${value}`;
};

type MedicineDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicine?: MedicineWithSellerRelations | null;
};

const MedicineDetailsDialog = ({
  open,
  onOpenChange,
  medicine,
}: MedicineDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Medicine details</DialogTitle>
          <DialogDescription>Review the medicine overview.</DialogDescription>
        </DialogHeader>

        {medicine ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="h-32 w-32 overflow-hidden rounded-lg border bg-muted">
                {medicine.imageUrl ? (
                  <img
                    src={medicine.imageUrl}
                    alt={medicine.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{medicine.name}</h3>
                  {medicine.isFeatured && <Badge>Featured</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {medicine.description || "No description provided."}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={medicine.isAvailable ? "default" : "destructive"}
                  >
                    {medicine.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                  <Badge variant="secondary">Stock: {medicine.stock}</Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Price</Label>
                <p className="text-sm font-medium">
                  {formatPrice(medicine.price)}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Average rating
                </Label>
                <p className="text-sm font-medium">
                  {Number.isFinite(medicine.avgRating)
                    ? medicine.avgRating.toFixed(1)
                    : "-"}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Review count
                </Label>
                <p className="text-sm font-medium">
                  {Number.isFinite(medicine.reviewCount)
                    ? medicine.reviewCount
                    : "-"}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Strength
                </Label>
                <p className="text-sm font-medium">{medicine.strength}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Dosage form
                </Label>
                <p className="text-sm font-medium">{medicine.dosageForm}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Category
                </Label>
                <p className="text-sm font-medium">{medicine.category?.name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Manufacturer
                </Label>
                <p className="text-sm font-medium">
                  {medicine.manufacturer?.name}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No medicine selected.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MedicineDetailsDialog;
