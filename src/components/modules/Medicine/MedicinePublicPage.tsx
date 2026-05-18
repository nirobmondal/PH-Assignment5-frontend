"use client";

import { useEffect, useMemo, useState, useCallback, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, ArrowUpDown, Check, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import DataTableSearch from "@/components/shared/table/DataTableSearch";
import MedicineCard from "@/components/modules/Medicine/MedicineCard";
import MedicinePagination from "@/components/modules/Medicine/MedicinePagination";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

// Memoized filter panel to avoid unnecessary re-renders
const FilterPanel = memo(function FilterPanel({
  categoryOptions,
  manufacturerOptions,
  categoryId,
  manufacturerId,
  minPriceInput,
  maxPriceInput,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyPriceRange,
  onClearFilters,
  onItemClick,
  onCategorySelect,
  onManufacturerSelect,
}: {
  categoryOptions: ICategoryResponse[];
  manufacturerOptions: IManufacturerResponse[];
  categoryId: string;
  manufacturerId: string;
  minPriceInput: string;
  maxPriceInput: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onApplyPriceRange: () => void;
  onClearFilters: () => void;
  onItemClick?: () => void;
  onCategorySelect: (id: string | undefined) => void;
  onManufacturerSelect: (id: string | undefined) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-bold text-gray-900">Category</Label>
        <div className="space-y-2">
          {categoryOptions.length === 0 && (
            <p className="text-xs text-gray-500">No categories found.</p>
          )}
          {categoryOptions.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                onCategorySelect(
                  categoryId === category.id ? undefined : category.id,
                );
                onItemClick?.();
              }}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left text-sm transition",
                categoryId === category.id
                  ? "border-gray-700 bg-neutral-800 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
              )}
            >
              {category.name}
              {categoryId === category.id && (
                <Check className="ml-auto inline float-right h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-base font-bold text-gray-900">
          Manufacturer
        </Label>
        <div className="space-y-2">
          {manufacturerOptions.length === 0 && (
            <p className="text-xs text-gray-500">No manufacturers found.</p>
          )}
          {manufacturerOptions.map((manufacturer) => (
            <button
              key={manufacturer.id}
              type="button"
              onClick={() => {
                onManufacturerSelect(
                  manufacturerId === manufacturer.id
                    ? undefined
                    : manufacturer.id,
                );
                onItemClick?.();
              }}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left text-sm transition",
                manufacturerId === manufacturer.id
                  ? "border-gray-700 bg-neutral-800 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
              )}
            >
              {manufacturer.name}
              {manufacturerId === manufacturer.id && (
                <Check className="ml-auto inline float-right h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-base font-bold text-gray-900">
          Price range (BDT)
        </Label>
        <div className="grid gap-2">
          <Input
            key="min-price-input" // stable key prevents remounting
            type="number"
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="border-gray-200"
          />
          <Input
            key="max-price-input"
            type="number"
            placeholder="Max"
            value={maxPriceInput}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="border-gray-200"
          />
          <Button
            variant="outline"
            className="w-full border-gray-300 bg-white text-gray-700 hover:bg-neutral-950 hover:text-white"
            onClick={onApplyPriceRange}
          >
            Apply range
          </Button>
        </div>
      </div>

      <Separator />

      <Button
        variant="ghost"
        className="w-full border border-dashed border-gray-300 text-gray-600 hover:bg-gray-50"
        onClick={() => {
          onClearFilters();
          onItemClick?.();
        }}
      >
        Clear all filters
      </Button>
    </div>
  );
});

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

  // Sync local price inputs with URL params
  useEffect(() => {
    setMinPriceInput(priceMin);
    setMaxPriceInput(priceMax);
  }, [priceMin, priceMax]);

  const currentSort = useMemo<SortOption>(() => {
    if (sortBy === "price" && sortOrder === "desc") return "price-desc";
    if (sortBy === "price" && sortOrder === "asc") return "price-asc";
    return "default";
  }, [sortBy, sortOrder]);

  useEffect(() => {
    const pageValue = searchParams.get("page");
    if (pageValue !== "1") return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }, [pathname, router, searchParams]);

  const updateQueryParams = useCallback(
    (updates: Record<string, string | undefined>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });
      if (resetPage) params.set("page", "1");
      if (params.get("page") === "1") params.delete("page");
      const nextQuery = params.toString();
      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    },
    [searchParams, pathname, router],
  );

  const queryString = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (hasLimit) params.set("limit", String(limit));
    else params.delete("limit");
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
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
      if (!response.success)
        throw new Error(response.message || "Failed to fetch medicines");
      return response.data as IMedicineListResponse;
    },
    placeholderData: (previous) => previous,
  });

  const { data: categoryOptions = [] } = useQuery({
    queryKey: ["public-categories"],
    queryFn: async () => {
      const response = await getCategories();
      if (!response.success) return [];
      return response.data as ICategoryResponse[];
    },
  });

  const { data: manufacturerOptions = [] } = useQuery({
    queryKey: ["public-manufacturers"],
    queryFn: async () => {
      const response = await getManufacturers();
      if (!response.success) return [];
      return response.data as IManufacturerResponse[];
    },
  });

  const medicines = medicineResponse?.data ?? [];
  const meta = medicineResponse?.meta;
  const totalPages = meta?.totalPages ?? 0;
  const totalItems = meta?.total ?? 0;

  const applyPriceRange = useCallback(() => {
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
  }, [minPriceInput, maxPriceInput, updateQueryParams]);

  const clearFilters = useCallback(() => {
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
  }, [updateQueryParams]);

  const handleCategorySelect = useCallback(
    (id: string | undefined) => {
      updateQueryParams({ categoryId: id });
    },
    [updateQueryParams],
  );

  const handleManufacturerSelect = useCallback(
    (id: string | undefined) => {
      updateQueryParams({ manufacturerId: id });
    },
    [updateQueryParams],
  );

  return (
    <section className="w-full max-w-full bg-gray-50">
      <div className="px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Desktop filters sidebar */}
          <aside className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-24 rounded-none border bg-white text-gray-900">
              <div className="border-b px-4 py-3">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <SlidersHorizontal className="h-5 w-5" />
                  Narrow your search
                </h2>
                <p className="text-xs text-gray-500">
                  Filter by category, brand, or price
                </p>
              </div>
              <ScrollArea className="h-[calc(100vh-200px)] px-4 py-4">
                <FilterPanel
                  categoryOptions={categoryOptions}
                  manufacturerOptions={manufacturerOptions}
                  categoryId={categoryId}
                  manufacturerId={manufacturerId}
                  minPriceInput={minPriceInput}
                  maxPriceInput={maxPriceInput}
                  onMinPriceChange={setMinPriceInput}
                  onMaxPriceChange={setMaxPriceInput}
                  onApplyPriceRange={applyPriceRange}
                  onClearFilters={clearFilters}
                  onCategorySelect={handleCategorySelect}
                  onManufacturerSelect={handleManufacturerSelect}
                />
              </ScrollArea>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 pt-2">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:w-96">
                <DataTableSearch
                  initialValue={searchTerm}
                  placeholder="Search medicines..."
                  onDebouncedChange={(value) =>
                    updateQueryParams({ searchTerm: value || undefined })
                  }
                  debounceMs={500}
                />
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-gray-500" />
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
                  <SelectTrigger className="w-48 border-gray-300 bg-white">
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

            {/* Mobile filter button */}
            <div className="mb-4 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 border-gray-300 bg-white text-gray-700"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] max-w-md p-0">
                  <SheetHeader className="border-b p-4 text-left">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-70px)] px-4 py-4">
                    <FilterPanel
                      categoryOptions={categoryOptions}
                      manufacturerOptions={manufacturerOptions}
                      categoryId={categoryId}
                      manufacturerId={manufacturerId}
                      minPriceInput={minPriceInput}
                      maxPriceInput={maxPriceInput}
                      onMinPriceChange={setMinPriceInput}
                      onMaxPriceChange={setMaxPriceInput}
                      onApplyPriceRange={applyPriceRange}
                      onClearFilters={clearFilters}
                      onItemClick={() => document.body.click()}
                      onCategorySelect={handleCategorySelect}
                      onManufacturerSelect={handleManufacturerSelect}
                    />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>

            {error ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
                Failed to load medicines.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
                  {medicines.map((medicine) => (
                    <MedicineCard key={medicine.id} medicine={medicine} />
                  ))}
                </div>

                {medicines.length === 0 && !isLoading && (
                  <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
                    No medicines found. Try adjusting your filters.
                  </div>
                )}

                <div className="rounded-none border bg-white">
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
          </main>
        </div>
      </div>
    </section>
  );
};

export default MedicinePublicPage;
