"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import DataTableSearch from "@/components/shared/table/DataTableSearch";
import MedicineCard from "@/components/modules/Medicine/MedicineCard";
import MedicinePagination from "@/components/modules/Medicine/MedicinePagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getCategories } from "@/services/category.services";
import { getManufacturers } from "@/services/manufacturer.services";
import { getAllMedicines } from "@/services/medicine.services";
import { ICategoryResponse } from "@/types/category.types";
import { IManufacturerResponse } from "@/types/manufacturer.types";
import { IMedicineListResponse } from "@/types/medicine.types";

const DEFAULT_PAGE_SIZE = 10;

type SortOption = "default" | "price-desc" | "price-asc";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "price-desc", label: "Price high to low" },
  { value: "price-asc", label: "Price low to high" },
];

const parseNumberParam = (value: string | null, fallback: number) => {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const MedicinePublicPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseNumberParam(searchParams.get("page"), 1);
  const limitParam = searchParams.get("limit");
  const limit = parseNumberParam(limitParam, DEFAULT_PAGE_SIZE);
  const hasLimit = Boolean(limitParam);
  const searchTerm = searchParams.get("searchTerm") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const manufacturerId = searchParams.get("manufacturerId") ?? "";
  const priceMin = searchParams.get("price[gte]") ?? "";
  const priceMax = searchParams.get("price[lte]") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "";

  const [minPriceInput, setMinPriceInput] = useState(priceMin);
  const [maxPriceInput, setMaxPriceInput] = useState(priceMax);

  const currentSort = useMemo<SortOption>(() => {
    if (sortBy === "price" && sortOrder === "desc") {
      return "price-desc";
    }
    if (sortBy === "price" && sortOrder === "asc") {
      return "price-asc";
    }
    return "default";
  }, [sortBy, sortOrder]);

  useEffect(() => {
    const pageValue = searchParams.get("page");
    if (pageValue !== "1") {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }, [pathname, router, searchParams]);

  const updateQueryParams = (
    updates: Record<string, string | undefined>,
    resetPage = true,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    if (resetPage) {
      params.set("page", "1");
    }

    if (params.get("page") === "1") {
      params.delete("page");
    }

    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const queryString = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (hasLimit) {
      params.set("limit", String(limit));
    } else {
      params.delete("limit");
    }

    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }

    return params.toString();
  }, [searchParams, page, limit, hasLimit]);

  const {
    data: medicineResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["public-medicines", queryString],
    queryFn: async () => {
      const response = await getAllMedicines(queryString);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch medicines");
      }
      return response.data as IMedicineListResponse;
    },
    placeholderData: (previous) => previous,
  });

  const { data: categoryOptions = [] } = useQuery({
    queryKey: ["public-categories"],
    queryFn: async () => {
      const response = await getCategories();
      if (!response.success) {
        return [] as ICategoryResponse[];
      }
      return response.data as ICategoryResponse[];
    },
  });

  const { data: manufacturerOptions = [] } = useQuery({
    queryKey: ["public-manufacturers"],
    queryFn: async () => {
      const response = await getManufacturers();
      if (!response.success) {
        return [] as IManufacturerResponse[];
      }
      return response.data as IManufacturerResponse[];
    },
  });

  const medicines = medicineResponse?.data ?? [];
  const meta = medicineResponse?.meta;
  const totalPages = meta?.totalPages ?? 0;
  const totalItems = meta?.total ?? 0;

  const applyPriceRange = () => {
    const minValue = minPriceInput.trim();
    const maxValue = maxPriceInput.trim();

    if (minValue && Number.isNaN(Number(minValue))) {
      toast.error("Minimum price must be a number");
      return;
    }

    if (maxValue && Number.isNaN(Number(maxValue))) {
      toast.error("Maximum price must be a number");
      return;
    }

    updateQueryParams({
      "price[gte]": minValue || undefined,
      "price[lte]": maxValue || undefined,
    });
  };

  const clearFilters = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    updateQueryParams(
      {
        categoryId: undefined,
        manufacturerId: undefined,
        "price[gte]": undefined,
        "price[lte]": undefined,
      },
      true,
    );
  };

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit border-muted/60 bg-white">
          <div className="border-b px-4 py-3">
            <h2 className="text-base font-semibold text-foreground">Filters</h2>
            <p className="text-xs text-muted-foreground">
              Narrow results quickly
            </p>
          </div>

          <ScrollArea className="h-[calc(100vh-240px)] px-4 py-4">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Category</Label>
                <div className="space-y-2">
                  {categoryOptions.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No categories found.
                    </p>
                  )}
                  {categoryOptions.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        updateQueryParams({
                          categoryId:
                            categoryId === category.id
                              ? undefined
                              : category.id,
                        })
                      }
                      className={cn(
                        "w-full rounded-lg border px-3 py-2 text-left text-sm transition",
                        categoryId === category.id
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-transparent bg-muted/40 text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Manufacturer</Label>
                <div className="space-y-2">
                  {manufacturerOptions.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No manufacturers found.
                    </p>
                  )}
                  {manufacturerOptions.map((manufacturer) => (
                    <button
                      key={manufacturer.id}
                      type="button"
                      onClick={() =>
                        updateQueryParams({
                          manufacturerId:
                            manufacturerId === manufacturer.id
                              ? undefined
                              : manufacturer.id,
                        })
                      }
                      className={cn(
                        "w-full rounded-lg border px-3 py-2 text-left text-sm transition",
                        manufacturerId === manufacturer.id
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-transparent bg-muted/40 text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {manufacturer.name}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Price range</Label>
                <div className="grid gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(event) => setMinPriceInput(event.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(event) => setMaxPriceInput(event.target.value)}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={applyPriceRange}
                  >
                    Apply range
                  </Button>
                </div>
              </div>

              <Separator />

              <Button
                variant="ghost"
                className="w-full border border-dashed"
                onClick={clearFilters}
              >
                Clear filter
              </Button>
            </div>
          </ScrollArea>
        </Card>

        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-xl border border-muted bg-white p-4 md:flex-row md:items-center md:justify-between">
            <DataTableSearch
              initialValue={searchTerm}
              placeholder="Search by name"
              onDebouncedChange={(value) =>
                updateQueryParams({ searchTerm: value || undefined })
              }
              debounceMs={500}
            />

            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
              <Label className="text-sm text-muted-foreground">Sort by</Label>
              <Select
                value={currentSort}
                onValueChange={(value) => {
                  const nextValue = value as SortOption;
                  if (nextValue === "default") {
                    updateQueryParams({
                      sortBy: undefined,
                      sortOrder: undefined,
                    });
                    return;
                  }

                  updateQueryParams({
                    sortBy: "price",
                    sortOrder: nextValue === "price-desc" ? "desc" : "asc",
                  });
                }}
              >
                <SelectTrigger className="w-full md:w-56">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Failed to load medicines.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {medicines.map((medicine) => (
                  <MedicineCard key={medicine.id} medicine={medicine} />
                ))}
              </div>

              {medicines.length === 0 && !isLoading && (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No medicines found.
                </div>
              )}

              <div className="rounded-lg border bg-white">
                <MedicinePagination
                  currentPage={page}
                  pageSize={limit}
                  totalPages={totalPages}
                  totalRows={totalItems}
                  isLoading={isLoading}
                  onPageChange={(nextPage) =>
                    updateQueryParams(
                      {
                        page: String(nextPage),
                        ...(hasLimit ? { limit: String(limit) } : {}),
                      },
                      false,
                    )
                  }
                  onPageSizeChange={(nextSize) =>
                    updateQueryParams(
                      { page: "1", limit: String(nextSize) },
                      false,
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MedicinePublicPage;
