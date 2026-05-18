"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getAllMedicines } from "@/services/medicine.services";
import {
  IMedicineListResponse,
  MedicineWithRelations,
} from "@/types/medicine.types";

const formatPrice = (value: number | string) => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numericValue)) {
    return "-";
  }
  return `BDT ${numericValue}`;
};

const FeaturedMedicines = () => {
  const {
    data: medicineResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featured-medicines"],
    queryFn: async () => {
      const response = await getAllMedicines("isFeatured=true");
      if (!response.success) {
        throw new Error(
          response.message || "Failed to load featured medicines",
        );
      }
      return response.data as IMedicineListResponse;
    },
  });

  const medicines = medicineResponse?.data ?? [];

  return (
    <section>
      <div className="container mx-auto px-4">
        {/* Header with heading and show more button */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Featured Medicine
          </h2>
          <Button
            asChild
            variant="default"
            className="bg-black hover:bg-gray-800"
          >
            <Link href="/medicine" className="flex items-center gap-2">
              Show more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            Unable to load featured medicines right now.
          </div>
        )}

        {/* Loading state (simple, no skeletons) */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="text-sm text-gray-500">
              Loading featured medicines...
            </div>
          </div>
        )}

        {/* Medicines grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {medicines.map((medicine: MedicineWithRelations) => (
              <Card
                key={medicine.id}
                className="group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image area */}
                <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                  {medicine.imageUrl ? (
                    <img
                      src={medicine.imageUrl}
                      alt={medicine.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <CardContent className="space-y-2 p-4">
                  <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
                    {medicine.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {medicine.category?.name ?? "Uncategorized"}
                  </p>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(medicine.price)}
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
                      className="flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to cart
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && medicines.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            No featured medicines available right now.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMedicines;
