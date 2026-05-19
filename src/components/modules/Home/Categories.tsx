"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/services/category.services";
import { ICategoryResponse } from "@/types/category.types";

const Categories = () => {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      if (!response.success) {
        throw new Error(response.message || "Failed to load categories");
      }
      return response.data as ICategoryResponse[];
    },
  });

  return (
    <section>
      <div className="container mx-auto px-4">
        {/* Header with heading and browse button */}
        <div className="mb-8 flex flex items-start justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            All Categories
          </h2>
          <Button
            asChild
            variant="default"
            className="bg-black hover:bg-gray-800"
          >
            <Link href="/medicine" className="flex items-center gap-2">
              Browse more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            Unable to load categories right now. Please try again later.
          </div>
        )}

        {/* Loading state (simple, no skeletons) */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="text-sm text-gray-500">Loading categories...</div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
            No categories available right now.
          </div>
        )}

        {/* Categories grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/medicine?categoryId=${category.id}`}
                className="group"
              >
                <Card className="h-full overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {category.description ||
                        "Explore medicines and trusted essentials."}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
