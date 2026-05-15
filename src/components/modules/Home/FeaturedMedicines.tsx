"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,116,144,0.12),_transparent_55%)]" />
      <div className="container relative mx-auto px-4">
        <div className="mb-8">
          <h2 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            Featured Medicine
          </h2>
        </div>

        {error ? (
          <div className="rounded-2xl border border-dashed bg-white/80 p-8 text-center text-sm text-muted-foreground">
            Unable to load featured medicines right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <Card
                    key={`featured-skeleton-${index}`}
                    className="overflow-hidden border-muted bg-white"
                  >
                    <Skeleton className="h-32 w-full" />
                    <CardContent className="space-y-3 p-4">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))
              : medicines.map((medicine: MedicineWithRelations) => (
                  <Card
                    key={medicine.id}
                    className="group overflow-hidden border-emerald-100/70 bg-white/90 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-36 w-full bg-[linear-gradient(135deg,_rgba(14,116,144,0.12),_rgba(236,254,255,1))]">
                      {medicine.imageUrl ? (
                        <img
                          src={medicine.imageUrl}
                          alt={medicine.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <CardContent className="space-y-3 p-4">
                      <div className="space-y-1">
                        <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
                          {medicine.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {medicine.category?.name ?? ""}
                        </p>
                      </div>

                      <div className="text-sm font-semibold text-emerald-700">
                        {formatPrice(medicine.price)}
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button
                        asChild
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
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

        {!isLoading && !error && medicines.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed bg-white/80 p-8 text-center text-sm text-muted-foreground">
            No featured medicines available right now.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMedicines;
