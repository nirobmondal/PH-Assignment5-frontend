"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
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

const formatPriceBDT = (value: number | string) => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numericValue)) return "–";
  return `BDT ${numericValue}`;
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

  // ---------- Medicine data ----------
  const {
    data: medicine,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["medicine-details", medicineId],
    queryFn: async () => {
      if (!medicineId) throw new Error("Missing medicine id");
      const response = await getMedicineById(medicineId);
      if (!response.success) throw new Error(response.message);
      return response.data as MedicineWithRelations;
    },
    enabled: Boolean(medicineId),
  });

  // ---------- Add to cart mutation ----------
  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "Failed to add to cart");
        return;
      }
      toast.success("Added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.refresh();
    },
    onError: () => toast.error("Failed to add to cart"),
  });

  // ---------- User info ----------
  const { data: userInfo } = useQuery({
    queryKey: ["user-info"],
    queryFn: getUserInfo,
  });
  const user = userInfo as IUserResponse | null;
  const isAuthenticated = !!user;
  const isCustomer = user?.role === UserRole.CUSTOMER;

  // ---------- Reviews ----------
  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: ["medicine-reviews", medicineId],
    queryFn: async () => {
      if (!medicineId) throw new Error("Missing medicine id");
      const response = await getReviewsByMedicineId(medicineId);
      if (!response.success) throw new Error(response.message);
      return response.data as IReviewResponse[];
    },
    enabled: Boolean(medicineId),
  });

  // ---------- Delivered orders (to check review eligibility) ----------
  const {
    data: deliveredOrders,
    isLoading: isOrdersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["delivered-orders", medicineId],
    queryFn: async () => {
      const response = await getOrders(buildDeliveredOrderQueryString());
      if (!response.success) throw new Error(response.message);
      return response.data as IOrderResponse;
    },
    enabled: Boolean(medicineId) && isCustomer,
  });

  // Check if user has a delivered order item for this medicine
  const reviewableOrderItem = useMemo(() => {
    if (!deliveredOrders?.data || !medicineId) return null;
    for (const order of deliveredOrders.data) {
      for (const sellerOrder of order.sellerOrders) {
        for (const item of sellerOrder.items) {
          if (item.medicine?.id === medicineId) return item;
        }
      }
    }
    return null;
  }, [deliveredOrders, medicineId]);

  // Find user's own review (if any)
  const userReview = useMemo(() => {
    if (!user || !reviews.length) return null;
    return reviews.find((rev) => rev.customer?.id === user.id) ?? null;
  }, [reviews, user]);

  const canCreateReview = isCustomer && !!reviewableOrderItem && !userReview;

  // ---------- Review mutations ----------
  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "Failed to submit review");
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
    onError: () => toast.error("Failed to submit review"),
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: { rating?: number; comment?: string };
    }) => updateReview(reviewId, payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "Failed to update review");
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
    onError: () => toast.error("Failed to update review"),
  });

  const deleteReviewMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "Failed to delete review");
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
    onError: () => toast.error("Failed to delete review"),
  });

  // Loading / error states
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Loading medicine details...
        </div>
      </section>
    );
  }
  if (error || !medicine) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Unable to load medicine details.
        </div>
      </section>
    );
  }

  const seller = medicine.seller;
  const maxQuantity = Math.max(1, medicine.stock);
  const safeQuantity = Math.min(Math.max(quantity, 1), maxQuantity);
  const avgRating = medicine.avgRating ?? 0;
  const reviewCount = medicine.reviewCount ?? 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCartMutation.mutate({
      medicineId: medicine.id,
      quantity: safeQuantity,
    });
  };

  return (
    <section className="container mx-auto px-4 py-6 md:py-10">
      {/* Back button */}
      <div className="mb-6">
        <Button asChild variant="ghost" className="pl-0">
          <Link href="/medicine">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to medicines
          </Link>
        </Button>
      </div>

      {/* Top section: Image + Main info */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Image */}
        <Card className="overflow-hidden border-muted bg-white">
          <div className="aspect-square w-full bg-gradient-to-br from-emerald-50 to-white">
            {medicine.imageUrl ? (
              <img
                src={medicine.imageUrl}
                alt={medicine.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                No image available
              </div>
            )}
          </div>
        </Card>

        {/* Right: Medicine details + Add to cart */}
        <div className="space-y-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-foreground">
                {medicine.name}
              </h1>
              {medicine.isFeatured && (
                <Badge variant="secondary">Featured</Badge>
              )}
              <Badge variant={medicine.isAvailable ? "default" : "destructive"}>
                {medicine.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {seller?.shopName || "Seller"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <ReviewStars value={avgRating} />
              <span className="font-semibold">{avgRating}</span>
              <span className="text-muted-foreground">({reviewCount})</span>
            </div>
            {medicine.dosageForm && (
              <Badge variant="outline">{medicine.dosageForm}</Badge>
            )}
            {medicine.strength && (
              <Badge variant="outline">{medicine.strength}</Badge>
            )}
          </div>

          {/* Price */}
          <div className="rounded-lg bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
            <p className="text-xs uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
              Price
            </p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">
              {formatPriceBDT(medicine.price)}
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Stock</p>
              <p className="font-medium">{medicine.stock}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium">{medicine.category?.name ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Manufacturer</p>
              <p className="font-medium">
                {medicine.manufacturer?.name ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Dosage Form</p>
              <p className="font-medium">{medicine.dosageForm ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Strength</p>
              <p className="font-medium">{medicine.strength ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Shop</p>
              <p className="font-medium">{seller?.shopName ?? "-"}</p>
            </div>
          </div>

          {/* Add to cart with quantity */}
          <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={safeQuantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-12 text-center font-medium">
                  {safeQuantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity((q) => Math.min(maxQuantity, q + 1))
                  }
                  disabled={safeQuantity >= maxQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="bg-neutral-900 hover:bg-neutral-800 text-white"
                onClick={handleAddToCart}
                disabled={
                  !medicine.isAvailable ||
                  addToCartMutation.isPending ||
                  !isAuthenticated ||
                  !isCustomer
                }
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to cart
              </Button>
            </div>
            {!isCustomer && (
              <p className="text-xs text-muted-foreground mt-3">
                Only customers can add items to cart.
              </p>
            )}
            {!isAuthenticated && (
              <p className="text-xs text-muted-foreground mt-3">
                Please{" "}
                <Link href="/login" className="underline">
                  log in
                </Link>{" "}
                to add items to cart.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section: Reviews (left) + Accordion details (right) */}
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* LEFT COLUMN: Reviews */}
        <div className="space-y-6">
          <Card className="border-muted bg-white">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Customer Reviews</h2>
                  <p className="text-sm text-muted-foreground">
                    Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ReviewStars value={avgRating} />
                  <span className="font-semibold">{avgRating}</span>
                </div>
              </div>
              <Separator className="my-4" />

              {isReviewsLoading && (
                <div className="py-8 text-center text-muted-foreground">
                  Loading reviews...
                </div>
              )}
              {reviewsError && (
                <div className="py-8 text-center text-muted-foreground">
                  Unable to load reviews.
                </div>
              )}
              {!isReviewsLoading && !reviewsError && (
                <ReviewList
                  reviews={reviews}
                  emptyMessage="No reviews yet. Be the first to review this medicine!"
                />
              )}
            </CardContent>
          </Card>

          {/* Review submission area (only if eligible) */}
          <Card className="border-muted bg-white">
            <CardContent className="p-6">
              {!isAuthenticated && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    Log in to write a review.
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-3">
                    <Link href="/login">Sign in</Link>
                  </Button>
                </div>
              )}

              {isAuthenticated && !isCustomer && (
                <div className="text-center py-4 text-muted-foreground">
                  Only customers can submit reviews.
                </div>
              )}

              {isCustomer && isOrdersLoading && (
                <div className="text-center py-4 text-muted-foreground">
                  Checking your order history...
                </div>
              )}

              {isCustomer && ordersError && (
                <div className="text-center py-4 text-muted-foreground">
                  Could not verify your orders.
                </div>
              )}

              {isCustomer && !isOrdersLoading && !ordersError && userReview && (
                <div className="space-y-3 rounded-lg border bg-neutral-50 p-4 dark:bg-neutral-900">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Your review</p>
                    <ReviewStars value={userReview.rating} />
                  </div>
                  <p className="text-sm">
                    {userReview.comment || "No comment provided."}
                  </p>
                  <div className="flex gap-2">
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

              {isCustomer &&
                !isOrdersLoading &&
                !ordersError &&
                !userReview &&
                canCreateReview && (
                  <ReviewForm
                    onSubmit={({ rating, comment }) => {
                      if (!reviewableOrderItem) {
                        toast.error(
                          "No delivered order found for this medicine",
                        );
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

              {isCustomer &&
                !isOrdersLoading &&
                !ordersError &&
                !userReview &&
                !canCreateReview && (
                  <div className="text-center py-4 text-muted-foreground">
                    You can only review this medicine after receiving it (order
                    status = Delivered).
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Accordion details */}
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="medicine-details">
              <AccordionTrigger className="text-base font-semibold">
                Medicine Details
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {medicine.description || "No description provided."}
                </p>
                <p>
                  <span className="font-medium">Dosage Form:</span>{" "}
                  {medicine.dosageForm || "-"}
                </p>
                <p>
                  <span className="font-medium">Strength:</span>{" "}
                  {medicine.strength || "-"}
                </p>
                <p>
                  <span className="font-medium">Stock:</span> {medicine.stock}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="manufacturer-details">
              <AccordionTrigger className="text-base font-semibold">
                Manufacturer Details
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {medicine.manufacturer?.name || "-"}
                </p>
                <p>
                  <span className="font-medium">Country:</span>{" "}
                  {medicine.manufacturer?.country || "-"}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="category-details">
              <AccordionTrigger className="text-base font-semibold">
                Category Details
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {medicine.category?.name || "-"}
                </p>
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {medicine.category?.description ||
                    "No description available."}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="seller-details">
              <AccordionTrigger className="text-base font-semibold">
                Seller Information
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Shop Name:</span>{" "}
                  {seller?.shopName || "-"}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {seller?.shopAddress || "-"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {seller?.shopPhone || "-"}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-to-review">
              <AccordionTrigger className="text-base font-semibold">
                How to leave a review?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <p>
                  1. Place an order for this medicine.
                  <br />
                  2. Wait until the order status changes to{" "}
                  <strong>Delivered</strong>.<br />
                  3. After delivery, you will be able to write a review here.
                </p>
                <p className="mt-2 text-xs">
                  Only customers who have received this product can leave a
                  review.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Dialogs for edit/delete review */}
      <ReviewEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        review={userReview}
        isSubmitting={updateReviewMutation.isPending}
        onSubmit={(payload) => {
          if (!userReview) return;
          updateReviewMutation.mutate({ reviewId: userReview.id, payload });
        }}
      />
      <ReviewDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        reviewTitle={medicine.name}
        isDeleting={deleteReviewMutation.isPending}
        onConfirm={() => {
          if (!userReview) return;
          deleteReviewMutation.mutate(userReview.id);
        }}
      />
    </section>
  );
};

export default MedicineDetailsPage;
