"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, RefreshCcw, Trash2 } from "lucide-react";
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
  return `bdt${numericValue}`;
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Loading cart...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Unable to load cart.
            </div>
          )}

          {!isLoading && !error && !hasItems && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Your cart is empty.
            </div>
          )}

          {!isLoading && !error && hasItems && (
            <div className="space-y-3">
              <div className="hidden rounded-lg border bg-muted/40 px-4 py-2 text-xs font-semibold text-muted-foreground md:grid md:grid-cols-[48px_1.5fr_120px_160px_120px_120px]">
                <span>SL</span>
                <span>Medicine</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span className="text-right">Actions</span>
              </div>

              {cartItems.map((item, index) => {
                const currentQuantity =
                  quantities[item.medicineId] ?? item.quantity;
                const safeQuantity = getSafeQuantity(item, currentQuantity);
                const totalPrice = item.unitPrice * safeQuantity;

                return (
                  <div
                    key={item.id}
                    className="grid gap-4 rounded-lg border bg-white p-4 md:grid-cols-[48px_1.5fr_120px_160px_120px_120px] md:items-center"
                  >
                    <div className="text-sm font-semibold text-muted-foreground">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-md border bg-muted">
                        {item.medicine?.imageUrl ? (
                          <img
                            src={item.medicine.imageUrl}
                            alt={item.medicine?.name || "Medicine"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.medicine?.name || "Medicine"}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {formatPrice(item.unitPrice)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
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
                          safeQuantity >= (item.medicine?.stock ?? safeQuantity)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {formatPrice(totalPrice)}
                    </div>
                    <div className="flex items-center justify-start gap-2 md:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateMutation.mutate({
                            medicineId: item.medicineId,
                            quantity: safeQuantity,
                          })
                        }
                        disabled={updateMutation.isPending}
                        aria-label="Update quantity"
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeMutation.mutate(item.medicineId)}
                        disabled={removeMutation.isPending}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              <Separator />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-semibold">
                  Total: {formatPrice(total)}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button
                    variant="outline"
                    className="border-dashed sm:w-auto"
                    onClick={() => clearMutation.mutate()}
                    disabled={clearMutation.isPending}
                  >
                    Clear cart
                  </Button>
                  <Button
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
