"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import DataTable from "@/components/shared/table/DataTable";
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
import { IReviewResponse } from "@/types/review.types";

const truncate = (value: string | undefined, length = 48) => {
  if (!value) {
    return "-";
  }
  return value.length > length ? `${value.slice(0, length)}...` : value;
};

const ManageReviewPage = () => {
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState<IReviewResponse | null>(
    null,
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    data: reviews = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const response = await getAllReviews();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch reviews");
      }
      return response.data as IReviewResponse[];
    },
  });

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

  const columns = useMemo<ColumnDef<IReviewResponse>[]>(
    () => [
      {
        header: "Serial",
        cell: ({ row }) => row.index + 1,
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
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedReview(row.original);
                    setIsViewOpen(true);
                  }}
                >
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedReview(row.original);
                    setIsEditOpen(true);
                  }}
                >
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setSelectedReview(row.original);
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
    [setIsDeleteOpen, setIsEditOpen, setIsViewOpen],
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
