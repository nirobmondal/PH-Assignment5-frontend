"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingCart, Truck, AlertCircle } from "lucide-react";

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
  const isAmountValid = subtotal >= 100;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasItems) {
      toast.error("Your cart is empty");
      return;
    }

    // Minimum order amount validation
    if (!isAmountValid) {
      toast.error(
        `Minimum order amount is BDT 100. Your total is ${formatPrice(subtotal)}`,
      );
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
    <div className="space-y-6 p-4 md:p-6">
      {/* Header with icon */}
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="rounded-sm bg-primary/10 p-2">
          <Truck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Checkout</h1>
          <p className="text-xs text-muted-foreground md:text-sm">
            Review your items and confirm delivery details.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Summary Card */}
        <Card className="rounded-sm border shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/20 px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Loading order summary...
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-sm border border-destructive/30 bg-destructive/5 p-5 text-center">
                <p className="text-sm text-destructive">
                  Unable to load cart items.
                </p>
              </div>
            )}

            {!isLoading && !error && !hasItems && (
              <div className="rounded-sm border border-dashed p-6 text-center">
                <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Your cart is empty. Add items before checkout.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-sm"
                  onClick={() => router.push("/dashboard/cart")}
                >
                  Go to cart
                </Button>
              </div>
            )}

            {!isLoading && !error && hasItems && (
              <div className="space-y-4">
                <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-sm border p-3 transition-colors hover:bg-muted/20"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {item.medicine?.name || "Medicine"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold whitespace-nowrap">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {/* Minimum amount warning */}
                  {!isAmountValid && (
                    <div className="flex items-center gap-2 rounded-sm border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>
                        Minimum order amount is BDT 100. Please add more items.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping Information Card */}
        <Card className="rounded-sm border shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/20 px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="h-4 w-4 text-primary" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {!hasItems ? (
              <div className="rounded-sm border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Add items to your cart to enter shipping details.
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-3 sm:grid-cols-2">
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
                    className="rounded-sm"
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
                    className="rounded-sm"
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
                  className="rounded-sm"
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
                  className="rounded-sm"
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
                  className="rounded-sm"
                  rows={3}
                />

                <Button
                  type="submit"
                  disabled={orderMutation.isPending || !isAmountValid}
                  className="w-full rounded-sm"
                >
                  {orderMutation.isPending
                    ? "Processing..."
                    : "Initiate order with pay later"}
                </Button>

                {!isAmountValid && hasItems && (
                  <p className="text-center text-xs text-muted-foreground">
                    Add items worth BDT {100 - subtotal} more to proceed
                  </p>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderCheckoutPage;
