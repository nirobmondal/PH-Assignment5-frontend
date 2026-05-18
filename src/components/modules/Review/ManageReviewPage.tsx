"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import DataTable from "@/components/shared/table/DataTable";
import {
  DataTableFilterConfig,
  DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReviewDeleteDialog from "@/components/modules/Review/ReviewDeleteDialog";
import ReviewEditDialog from "@/components/modules/Review/ReviewEditDialog";
import ReviewSummaryDialog from "@/components/modules/Review/ReviewSummaryDialog";
import ReviewStars from "@/components/modules/Review/ReviewStars";
import {
  deleteReview,
  getAllReviews,
  updateReview,
} from "@/services/review.services";
import {
  IReviewResponse,
  IReviewItem,
  IReviewListResponse,
} from "@/types/review.types";

const truncate = (value: string | undefined, length = 48) => {
  if (!value) {
    return "-";
  }
  return value.length > length ? `${value.slice(0, length)}...` : value;
};

const buildQueryString = (
  pagination: PaginationState,
  searchTerm: string,
  filters: DataTableFilterValues,
) => {
  const params = new URLSearchParams();
  params.set("page", String(pagination.pageIndex + 1));
  params.set("limit", String(pagination.pageSize));

  if (searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  }

  const ratingValue = filters.rating;
  if (typeof ratingValue === "string" && ratingValue.length > 0) {
    params.set("rating", ratingValue);
  }

  return params.toString();
};

const ManageReviewPage = () => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<DataTableFilterValues>({});
  const [selectedReview, setSelectedReview] = useState<IReviewResponse | null>(
    null,
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const queryString = useMemo(
    () => buildQueryString(pagination, searchTerm, filters),
    [pagination, searchTerm, filters],
  );

  const {
    data: reviewsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-reviews", queryString],
    queryFn: async () => {
      const response = await getAllReviews(queryString);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch reviews");
      }
      return response.data as IReviewListResponse;
    },
    placeholderData: (previous) => previous,
  });

  const reviews = reviewsResponse?.data ?? [];
  const meta = reviewsResponse?.meta;

  const updateMutation = useMutation({
    mutationFn: async ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: { rating?: number; comment?: string };
    }) => updateReview(reviewId, payload),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to update review");
        return;
      }
      toast.success("Review updated");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setIsEditOpen(false);
      setSelectedReview(null);
    },
    onError: () => {
      toast.error("Failed to update review");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to delete review");
        return;
      }
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setIsDeleteOpen(false);
      setSelectedReview(null);
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });

  const filterConfigs: DataTableFilterConfig[] = useMemo(
    () => [
      {
        id: "rating",
        label: "Rating",
        type: "single-select",
        options: [
          { label: "1 Star", value: "1" },
          { label: "2 Stars", value: "2" },
          { label: "3 Stars", value: "3" },
          { label: "4 Stars", value: "4" },
          { label: "5 Stars", value: "5" },
        ],
      },
    ],
    [],
  );

  const columns = useMemo<ColumnDef<IReviewItem>[]>(
    () => [
      {
        header: "Serial",
        cell: ({ row }) =>
          pagination.pageIndex * pagination.pageSize + row.index + 1,
      },
      {
        header: "Medicine",
        cell: ({ row }) => row.original.medicine?.name || "-",
      },
      {
        header: "Customer",
        cell: ({ row }) => row.original.customer?.name || "-",
      },
      {
        header: "Rating",
        cell: ({ row }) => <ReviewStars value={row.original.rating} />,
      },
      {
        header: "Comment",
        cell: ({ row }) => truncate(row.original.comment),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedReview(row.original as IReviewResponse);
                    setIsViewOpen(true);
                  }}
                >
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedReview(row.original as IReviewResponse);
                    setIsEditOpen(true);
                  }}
                >
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setSelectedReview(row.original as IReviewResponse);
                    setIsDeleteOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [pagination.pageIndex, pagination.pageSize],
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Failed to load reviews.</p>
          ) : (
            <DataTable
              data={reviews}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="No reviews found."
              pagination={{
                state: pagination,
                onPaginationChange: setPagination,
              }}
              search={{
                initialValue: searchTerm,
                placeholder: "Search by comment, medicine, or customer",
                debounceMs: 500,
                onDebouncedChange: (value) => {
                  setSearchTerm(value);
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: 0,
                  }));
                },
              }}
              filters={{
                configs: filterConfigs,
                values: filters,
                onFilterChange: (filterId, value) => {
                  setFilters((prev) => ({
                    ...prev,
                    [filterId]: value,
                  }));
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: 0,
                  }));
                },
                onClearAll: () => {
                  setFilters({});
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: 0,
                  }));
                },
              }}
              meta={{
                page: meta?.page ?? pagination.pageIndex + 1,
                limit: meta?.limit ?? pagination.pageSize,
                total: meta?.total ?? reviews.length,
                totalPages: meta?.totalPages ?? 0,
              }}
            />
          )}
        </CardContent>
      </Card>

      <ReviewSummaryDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        review={selectedReview}
      />

      <ReviewEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        review={selectedReview}
        isSubmitting={updateMutation.isPending}
        onSubmit={(payload) => {
          if (!selectedReview) {
            return;
          }
          updateMutation.mutate({
            reviewId: selectedReview.id,
            payload,
          });
        }}
      />

      <ReviewDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        reviewTitle={selectedReview?.medicine?.name}
        isDeleting={deleteMutation.isPending}
        onConfirm={() => {
          if (!selectedReview) {
            return;
          }
          deleteMutation.mutate(selectedReview.id);
        }}
      />
    </div>
  );
};

export default ManageReviewPage;
