"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReviewDeleteDialog from "@/components/modules/Review/ReviewDeleteDialog";
import ReviewEditDialog from "@/components/modules/Review/ReviewEditDialog";
import ReviewForm from "@/components/modules/Review/ReviewForm";
import ReviewList from "@/components/modules/Review/ReviewList";
import ReviewStars from "@/components/modules/Review/ReviewStars";
import { UserRole } from "@/lib/authUtils";
import { addToCart } from "@/services/cart.services";
import { getUserInfo } from "@/services/auth.services";
import { getMedicineById } from "@/services/medicine.services";
import { getOrders } from "@/services/order.services";
import {
  createReview,
  deleteReview,
  getReviewsByMedicineId,
  updateReview,
} from "@/services/review.services";
import { MedicineWithRelations } from "@/types/medicine.types";
import { IOrderResponse, OrderStatus } from "@/types/order.types";
import { IReviewResponse } from "@/types/review.types";
import { IUserResponse } from "@/types/user.types";

const formatPrice = (value: number | string) => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numericValue)) {
    return "-";
  }
  return `$${numericValue}`;
};

const formatRating = (value: number) => {
  if (!Number.isFinite(value)) {
    return "0.0";
  }
  return value.toFixed(1);
};

const buildDeliveredOrderQueryString = () => {
  const params = new URLSearchParams();
  params.set("page", "1");
  params.set("limit", "50");
  params.set("status", OrderStatus.DELIVERED);
  return params.toString();
};

const MedicineDetailsPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const medicineId = params?.id;
  const [quantity, setQuantity] = useState(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to add to cart");
        return;
      }
      toast.success("Added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  const { data: userInfo } = useQuery({
    queryKey: ["user-info"],
    queryFn: getUserInfo,
  });

  const {
    data: reviewResponse,
    isLoading: isReviewLoading,
    error: reviewError,
  } = useQuery({
    queryKey: ["medicine-reviews", medicineId],
    queryFn: async () => {
      if (!medicineId) {
        throw new Error("Missing medicine id");
      }
      const response = await getReviewsByMedicineId(medicineId);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch reviews");
      }
      return response.data as IReviewResponse[];
    },
    enabled: Boolean(medicineId),
  });

  const reviews = reviewResponse ?? [];

  const user = userInfo as IUserResponse | null;
  const isCustomer = user?.role === UserRole.CUSTOMER;

  const {
    data: deliveredOrders,
    isLoading: isOrdersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["delivered-orders", medicineId],
    queryFn: async () => {
      const response = await getOrders(buildDeliveredOrderQueryString());
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch orders");
      }
      return response.data as IOrderResponse;
    },
    enabled: Boolean(medicineId) && isCustomer,
  });

  const reviewableOrderItem = useMemo(() => {
    if (!deliveredOrders?.data || !medicineId) {
      return null;
    }

    for (const order of deliveredOrders.data) {
      for (const sellerOrder of order.sellerOrders) {
        for (const item of sellerOrder.items) {
          if (item.medicine?.id === medicineId) {
            return item;
          }
        }
      }
    }

    return null;
  }, [deliveredOrders?.data, medicineId]);

  const userReview = useMemo(() => {
    if (!user || !reviews.length) {
      return null;
    }

    return reviews.find((review) => review.customer?.id === user.id) ?? null;
  }, [reviews, user]);

  const canCreateReview =
    isCustomer && Boolean(reviewableOrderItem) && !userReview;

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to submit review");
        return;
      }
      toast.success("Review submitted");
      queryClient.invalidateQueries({
        queryKey: ["medicine-reviews", medicineId],
      });
      queryClient.invalidateQueries({
        queryKey: ["medicine-details", medicineId],
      });
    },
    onError: () => {
      toast.error("Failed to submit review");
    },
  });

  const updateReviewMutation = useMutation({
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
      queryClient.invalidateQueries({
        queryKey: ["medicine-reviews", medicineId],
      });
      queryClient.invalidateQueries({
        queryKey: ["medicine-details", medicineId],
      });
      setIsEditOpen(false);
    },
    onError: () => {
      toast.error("Failed to update review");
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to delete review");
        return;
      }
      toast.success("Review deleted");
      queryClient.invalidateQueries({
        queryKey: ["medicine-reviews", medicineId],
      });
      queryClient.invalidateQueries({
        queryKey: ["medicine-details", medicineId],
      });
      setIsDeleteOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
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

  const sellerName = data.seller.shopName;
  const maxQuantity =
    Number.isFinite(data.stock) && data.stock > 0 ? data.stock : 1;
  const safeQuantity = Math.min(Math.max(quantity, 1), maxQuantity);
  const avgRating = Number.isFinite(data.avgRating) ? data.avgRating : 0;
  const reviewCount = Number.isFinite(data.reviewCount) ? data.reviewCount : 0;

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
                <ReviewStars value={avgRating} />
                <span className="font-semibold text-foreground">
                  {formatRating(avgRating)}
                </span>
                <span className="text-muted-foreground">({reviewCount})</span>
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

            <div className="rounded-lg border border-dashed p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={safeQuantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="min-w-10 rounded-md border px-3 py-2 text-center text-sm font-semibold">
                    {safeQuantity}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setQuantity((prev) => Math.min(maxQuantity, prev + 1))
                    }
                    disabled={safeQuantity >= maxQuantity}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() =>
                    addToCartMutation.mutate({
                      medicineId: data.id,
                      quantity: safeQuantity,
                    })
                  }
                  disabled={!data.isAvailable || addToCartMutation.isPending}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-muted bg-white">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Customer reviews
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ReviewStars value={avgRating} />
                <span className="text-sm font-semibold text-foreground">
                  {formatRating(avgRating)}
                </span>
              </div>
            </div>

            <Separator />

            {isReviewLoading && (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Loading reviews...
              </div>
            )}

            {reviewError && (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Unable to load reviews.
              </div>
            )}

            {!isReviewLoading && !reviewError && (
              <ReviewList
                reviews={reviews}
                emptyMessage="Be the first to review."
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-muted bg-white">
          <CardContent className="space-y-4 p-6">
            {!user && (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                <p>Log in to share your review.</p>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link href="/login">Go to login</Link>
                </Button>
              </div>
            )}

            {user && !isCustomer && (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Only customers can submit reviews.
              </div>
            )}

            {user && isCustomer && isOrdersLoading && (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Checking your delivered orders...
              </div>
            )}

            {user && isCustomer && ordersError && (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Unable to verify your order history.
              </div>
            )}

            {user &&
              isCustomer &&
              !isOrdersLoading &&
              !ordersError &&
              userReview && (
                <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      Your review
                    </p>
                    <ReviewStars value={userReview.rating} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {userReview.comment || "No comment provided."}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditOpen(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setIsDeleteOpen(true)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}

            {user &&
              isCustomer &&
              !isOrdersLoading &&
              !ordersError &&
              !userReview &&
              !reviewableOrderItem && (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Order and receive this medicine to leave a review.
                </div>
              )}

            {user &&
              isCustomer &&
              !isOrdersLoading &&
              !ordersError &&
              canCreateReview && (
                <ReviewForm
                  onSubmit={({ rating, comment }) => {
                    if (!reviewableOrderItem) {
                      toast.error("No delivered order found for review");
                      return;
                    }
                    createReviewMutation.mutate({
                      orderItemId: reviewableOrderItem.id,
                      rating,
                      comment,
                    });
                  }}
                  isSubmitting={createReviewMutation.isPending}
                />
              )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
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

      <ReviewEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        review={userReview}
        isSubmitting={updateReviewMutation.isPending}
        onSubmit={(payload) => {
          if (!userReview) {
            return;
          }
          updateReviewMutation.mutate({
            reviewId: userReview.id,
            payload,
          });
        }}
      />

      <ReviewDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        reviewTitle={data.name}
        isDeleting={deleteReviewMutation.isPending}
        onConfirm={() => {
          if (!userReview) {
            return;
          }
          deleteReviewMutation.mutate(userReview.id);
        }}
      />
    </section>
  );
};

export default MedicineDetailsPage;
