"use client";

import { memo } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MedicineWithRelations } from "@/types/medicine.types";

const formatPrice = (value: number | string) => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numericValue)) {
    return "-";
  }
  return `BDT ${numericValue}`;
};

type MedicineCardProps = {
  medicine: MedicineWithRelations;
};

const MedicineCard = memo(function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <Card className="group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden bg-gray-50">
        {medicine.imageUrl ? (
          <img
            src={medicine.imageUrl}
            alt={medicine.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>

      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
            {medicine.name}
          </h3>
          <Badge
            variant={medicine.isAvailable ? "default" : "destructive"}
            className="shrink-0"
          >
            {medicine.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>

        <div className="space-y-1 text-sm">
          <p className="text-gray-500">
            <span className="font-medium text-gray-700">Category:</span>{" "}
            {medicine.category?.name || "Uncategorized"}
          </p>
          <p className="text-gray-500">
            <span className="font-medium text-gray-700">Manufacturer:</span>{" "}
            {medicine.manufacturer?.name || "—"}
          </p>
          <p className="text-base font-semibold text-gray-900">
            {formatPrice(medicine.price)}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          asChild
          variant="default"
          className="w-full bg-black hover:bg-gray-800"
        >
          <Link
            href={`/medicine/${medicine.id}`}
            prefetch
            className="flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
});

export default MedicineCard;
