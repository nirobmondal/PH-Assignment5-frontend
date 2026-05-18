"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, RefreshCcw, ShoppingBag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "@/services/cart.services";
import { CartItem, ICartResponse } from "@/types/cart.types";

const formatPrice = (value: number | string) => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numericValue)) {
    return "-";
  }
  return `BDT ${numericValue}`;
};

const getSafeQuantity = (item: CartItem, desired: number) => {
  const maxQuantity = item.medicine?.stock ?? desired;
  const upperBound = maxQuantity > 0 ? maxQuantity : desired;
  return Math.min(Math.max(desired, 1), upperBound);
};

const CartPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await getCart();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch cart");
      }
      return response.data as ICartResponse;
    },
  });

  const cartItems = data?.cartItems ?? [];

  useEffect(() => {
    if (!cartItems.length) {
      return;
    }
    const nextQuantities: Record<string, number> = {};
    cartItems.forEach((item) => {
      nextQuantities[item.medicineId] = item.quantity;
    });
    setQuantities(nextQuantities);
  }, [cartItems]);

  const updateMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to update item");
        return;
      }
      toast.success("Cart updated");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update item");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to remove item");
        return;
      }
      toast.success("Item removed");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to clear cart");
        return;
      }
      toast.success("Cart cleared");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to clear cart");
    },
  });

  const hasItems = cartItems.length > 0;

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const nextQuantity = quantities[item.medicineId] ?? item.quantity;
      return sum + item.unitPrice * nextQuantity;
    }, 0);
  }, [cartItems, quantities]);

  return (
    <div className="space-y-6">
      <Card className="border shadow-sm rounded-sm overflow-hidden">
        <CardHeader className="border-b bg-muted/20 px-6 py-5">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Your Cart
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="mt-4 text-sm text-muted-foreground">
                Loading your cart...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-sm border border-destructive/30 bg-destructive/5 p-8 text-center">
              <p className="text-sm text-destructive">
                Unable to load cart. Please try again.
              </p>
            </div>
          )}

          {!isLoading && !error && !hasItems && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">
                Your cart is empty
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add medicines to get started
              </p>
              <Button
                variant="outline"
                className="mt-4 rounded-sm"
                onClick={() => router.push("/medicine")}
              >
                Browse Medicines
              </Button>
            </div>
          )}

          {!isLoading && !error && hasItems && (
            <div className="space-y-4">
              {/* Desktop header */}
              <div className="hidden rounded-sm bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid md:grid-cols-[48px_1.5fr_120px_160px_120px_120px]">
                <span>#</span>
                <span>Medicine</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Cart items */}
              <div className="divide-y divide-border rounded-sm border">
                {cartItems.map((item, index) => {
                  const currentQuantity =
                    quantities[item.medicineId] ?? item.quantity;
                  const safeQuantity = getSafeQuantity(item, currentQuantity);
                  const totalPrice = item.unitPrice * safeQuantity;

                  return (
                    <div
                      key={item.id}
                      className="group transition-colors hover:bg-muted/10"
                    >
                      <div className="grid gap-4 p-4 md:grid-cols-[48px_1.5fr_120px_160px_120px_120px] md:items-center">
                        {/* SL */}
                        <div className="text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </div>

                        {/* Medicine info */}
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-sm border bg-muted">
                            {item.medicine?.imageUrl ? (
                              <img
                                src={item.medicine.imageUrl}
                                alt={item.medicine?.name || "Medicine"}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {item.medicine?.name || "Medicine"}
                            </p>
                          </div>
                        </div>

                        {/* Unit price */}
                        <div className="text-sm font-medium text-foreground">
                          {formatPrice(item.unitPrice)}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-sm"
                            onClick={() =>
                              setQuantities((prev) => ({
                                ...prev,
                                [item.medicineId]: getSafeQuantity(
                                  item,
                                  safeQuantity - 1,
                                ),
                              }))
                            }
                            disabled={safeQuantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <div className="min-w-10 rounded-sm border px-3 py-1 text-center text-sm font-semibold">
                            {safeQuantity}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-sm"
                            onClick={() =>
                              setQuantities((prev) => ({
                                ...prev,
                                [item.medicineId]: getSafeQuantity(
                                  item,
                                  safeQuantity + 1,
                                ),
                              }))
                            }
                            disabled={
                              Boolean(item.medicine?.stock) &&
                              safeQuantity >=
                                (item.medicine?.stock ?? safeQuantity)
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Line total */}
                        <div className="text-sm font-semibold text-foreground">
                          {formatPrice(totalPrice)}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-start gap-2 md:justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-sm"
                            onClick={() =>
                              updateMutation.mutate({
                                medicineId: item.medicineId,
                                quantity: safeQuantity,
                              })
                            }
                            disabled={updateMutation.isPending}
                            aria-label="Update quantity"
                          >
                            <RefreshCcw className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-sm"
                            onClick={() =>
                              removeMutation.mutate(item.medicineId)
                            }
                            disabled={removeMutation.isPending}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              {/* Summary section */}
              <div className="flex flex-col gap-4 rounded-sm border bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total amount</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatPrice(total)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button
                    variant="outline"
                    className="border-dashed rounded-sm"
                    onClick={() => clearMutation.mutate()}
                    disabled={clearMutation.isPending}
                  >
                    Clear cart
                  </Button>
                  <Button
                    className="rounded-sm shadow-sm"
                    onClick={() => router.push("/dashboard/checkout")}
                    disabled={!hasItems}
                  >
                    Proceed to checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CartPage;
