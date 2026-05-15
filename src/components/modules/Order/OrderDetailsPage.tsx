"use client";

import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderById } from "@/services/order.services";
import { IOrder } from "@/types/order.types";
import OrderDetailsContent from "./OrderDetailsContent";
import { useParams } from "next/navigation";

const OrderDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
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
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
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
