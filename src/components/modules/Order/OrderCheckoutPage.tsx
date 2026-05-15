"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { getCart } from "@/services/cart.services";
import { initiateOrder } from "@/services/order.services";
import { ICartResponse } from "@/types/cart.types";
import { formatPrice } from "./orderUtils";

const OrderCheckoutPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    note: "",
  });

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
  const subtotal = useMemo(() => {
    if (typeof data?.subtotal === "number") {
      return data.subtotal;
    }
    return cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
  }, [cartItems, data?.subtotal]);

  const orderMutation = useMutation({
    mutationFn: initiateOrder,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to initiate order");
        return;
      }
      toast.success("Order initiated. Payment pending.");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/dashboard/order");
    },
    onError: () => {
      toast.error("Failed to initiate order");
    },
  });

  const hasItems = cartItems.length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasItems) {
      toast.error("Your cart is empty");
      return;
    }

    orderMutation.mutate({
      shippingName: formValues.shippingName.trim(),
      shippingPhone: formValues.shippingPhone.trim(),
      shippingAddress: formValues.shippingAddress.trim(),
      shippingCity: formValues.shippingCity.trim(),
      note: formValues.note.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          Review your items and confirm delivery details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Loading order summary...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Unable to load cart items.
            </div>
          )}

          {!isLoading && !error && !hasItems && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              <p>Your cart is empty. Add items before checkout.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => router.push("/dashboard/cart")}
              >
                Go to cart
              </Button>
            </div>
          )}

          {!isLoading && !error && hasItems && (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {item.medicine?.name || "Medicine"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}

              <Separator />

              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasItems ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Add items to your cart to enter shipping details.
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Full name"
                  value={formValues.shippingName}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      shippingName: event.target.value,
                    }))
                  }
                  required
                />
                <Input
                  placeholder="Phone number"
                  value={formValues.shippingPhone}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      shippingPhone: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <Input
                placeholder="Shipping address"
                value={formValues.shippingAddress}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    shippingAddress: event.target.value,
                  }))
                }
                required
              />
              <Input
                placeholder="City"
                value={formValues.shippingCity}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    shippingCity: event.target.value,
                  }))
                }
                required
              />
              <Textarea
                placeholder="Note (optional)"
                value={formValues.note}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    note: event.target.value,
                  }))
                }
              />

              <Button type="submit" disabled={orderMutation.isPending}>
                Initiate order with pay later
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderCheckoutPage;
