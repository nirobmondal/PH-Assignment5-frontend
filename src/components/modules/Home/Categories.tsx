"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories } from "@/services/category.services";
import { ICategoryResponse } from "@/types/category.types";

const accentGradients = [
  "from-emerald-400/80 via-teal-400/70 to-sky-400/70",
  "from-lime-400/80 via-emerald-400/70 to-teal-400/70",
  "from-sky-400/80 via-cyan-400/70 to-emerald-400/70",
  "from-teal-400/80 via-emerald-400/70 to-lime-400/70",
];

const Categories = () => {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["home-categories"],
    queryFn: async () => {
      const response = await getCategories();
      if (!response.success) {
        throw new Error(response.message || "Failed to load categories");
      }
      return response.data as ICategoryResponse[];
    },
  });

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_55%)]" />
      <div className="container relative mx-auto px-4">
        <div className="mb-8">
          <h2 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            All Categories
          </h2>
        </div>

        {error ? (
          <div className="rounded-2xl border border-dashed bg-white/80 p-8 text-center text-sm text-muted-foreground">
            Unable to load categories right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <Card
                    key={`category-skeleton-${index}`}
                    className="overflow-hidden border-muted bg-white"
                  >
                    <Skeleton className="h-1.5 w-full" />
                    <div className="space-y-3 p-5">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </Card>
                ))
              : categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/medicine?categoryId=${category.id}`}
                    className="group"
                  >
                    <Card className="relative h-full overflow-hidden border-emerald-100/70 bg-white/90 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div
                        className={`h-1.5 w-full bg-gradient-to-r ${
                          accentGradients[index % accentGradients.length]
                        }`}
                      />
                      <div className="space-y-3 p-5">
                        <h3 className="text-lg font-semibold text-foreground">
                          {category.name}
                        </h3>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
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
