"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MedicineWithRelations } from "@/types/medicine.types";
import { Info, ShoppingCart } from "lucide-react";
import Link from "next/link";

const formatPrice = (value: number | string) => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numericValue)) {
    return "-";
  }
  return `$${numericValue}`;
};

type MedicineCardProps = {
  medicine: MedicineWithRelations;
};

const MedicineCard = ({ medicine }: MedicineCardProps) => {
  const sellerName = medicine.seller?.shopName || medicine.seller?.name || "";

  return (
    <Card className="group overflow-hidden border-muted bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 w-full bg-[linear-gradient(135deg,_rgba(16,185,129,0.16),_rgba(236,253,245,1))]">
        {medicine.imageUrl ? (
          <img
            src={medicine.imageUrl}
            alt={medicine.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {medicine.name}
            </h3>
            <p className="text-xs text-muted-foreground">{sellerName}</p>
          </div>
          <Badge variant={medicine.isAvailable ? "default" : "destructive"}>
            {medicine.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {medicine.isFeatured && (
            <Badge variant="secondary" className="rounded-full">
              Featured
            </Badge>
          )}
          <Badge variant="outline" className="rounded-full">
            {medicine.dosageForm}
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {medicine.strength}
          </Badge>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Price</span>
            <span className="font-semibold text-emerald-700">
              {formatPrice(medicine.price)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Stock</span>
            <span className="font-medium text-foreground">
              {medicine.stock}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Category</span>
            <span className="font-medium text-foreground">
              {medicine.category?.name ?? "-"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Manufacturer</span>
            <span className="font-medium text-foreground">
              {medicine.manufacturer?.name ?? "-"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-2 p-4 pt-0">
        <Button asChild className="flex-1" variant="outline">
          <Link
            href={`/medicine/${medicine.id}`}
            className="inline-flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </Link>
        </Button>
        <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700">
          <Link
            href={`/medicine/${medicine.id}`}
            className="inline-flex items-center justify-center gap-2"
          >
            <Info className="h-4 w-4" />
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MedicineCard;
