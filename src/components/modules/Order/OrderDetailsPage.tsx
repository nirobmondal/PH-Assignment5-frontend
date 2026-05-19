"use client";

import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderById } from "@/services/order.services";
import { IOrder } from "@/types/order.types";
import OrderDetailsContent from "./OrderDetailsContent";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const OrderDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await getOrderById(orderId);
      console.log("Order response: ", response);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch order");
      }
      return response.data as IOrder;
    },
  });

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order Details</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-sm"
            onClick={() => router.back()}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Loading order details...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Unable to load order details.
            </div>
          )}

          {!isLoading && !error && data && <OrderDetailsContent order={data} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailsPage;
