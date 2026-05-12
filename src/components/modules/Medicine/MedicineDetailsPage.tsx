"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMedicineById } from "@/services/medicine.services";
import { MedicineWithRelations } from "@/types/medicine.types";

const formatPrice = (value: number | string) => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numericValue)) {
    return "-";
  }
  return `$${numericValue}`;
};

const MedicineDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const medicineId = params?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["medicine-details", medicineId],
    queryFn: async () => {
      if (!medicineId) {
        throw new Error("Missing medicine id");
      }
      const response = await getMedicineById(medicineId);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch medicine");
      }
      return response.data as MedicineWithRelations;
    },
    enabled: Boolean(medicineId),
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Loading medicine details...
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Unable to load medicine details.
        </div>
      </section>
    );
  }

  const sellerName = data.seller?.shopName || data.seller?.name || "";

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" className="pl-0">
          <Link href="/medicine">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to medicines
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card className="overflow-hidden border-muted bg-white">
          <div className="h-80 bg-[linear-gradient(135deg,_rgba(16,185,129,0.16),_rgba(236,253,245,1))]">
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt={data.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>
        </Card>

        <Card className="border-muted bg-white">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  {data.name}
                </h1>
                {data.isFeatured && <Badge variant="secondary">Featured</Badge>}
                <Badge variant={data.isAvailable ? "default" : "destructive"}>
                  {data.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{sellerName}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="font-semibold text-foreground">
                  {Number.isFinite(data.avgRating)
                    ? data.avgRating.toFixed(1)
                    : "-"}
                </span>
                <span className="text-muted-foreground">
                  ({Number.isFinite(data.reviewCount) ? data.reviewCount : 0})
                </span>
              </div>
              <Badge variant="outline">{data.dosageForm}</Badge>
              <Badge variant="outline">{data.strength}</Badge>
            </div>

            <div className="rounded-lg bg-emerald-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">
                Price
              </p>
              <p className="text-2xl font-semibold text-emerald-700">
                {formatPrice(data.price)}
              </p>
            </div>

            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stock</span>
                <span className="font-medium text-foreground">
                  {data.stock}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium text-foreground">
                  {data.category?.name ?? "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Manufacturer</span>
                <span className="font-medium text-foreground">
                  {data.manufacturer?.name ?? "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shop</span>
                <span className="font-medium text-foreground">
                  {sellerName || "-"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-muted bg-white">
          <CardContent className="space-y-3 p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Description
            </h2>
            <p className="text-sm text-muted-foreground">
              {data.description || "No description provided."}
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted bg-white">
          <CardContent className="space-y-4 p-6 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Manufacturer country
              </p>
              <p className="font-medium text-foreground">
                {data.manufacturer?.country ?? "-"}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Category description
              </p>
              <p className="text-muted-foreground">
                {data.category?.description || "No description available."}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Seller
              </p>
              <p className="font-medium text-foreground">
                {data.seller?.name
                  ? `${data.seller.name} (${sellerName || "-"})`
                  : sellerName || "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MedicineDetailsPage;
