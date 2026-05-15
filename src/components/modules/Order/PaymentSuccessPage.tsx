"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrdersByParams } from "@/services/order.services";
import { IOrderResponse } from "@/types/order.types";
import { formatDate, formatPrice, getOrderShortId } from "./orderUtils";

const PaymentSuccessPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["latest-paid-order"],
    queryFn: async () => {
      const response = await getOrdersByParams({
        page: 1,
        limit: 1,
        paymentStatus: "PAID",
        sortBy: "updatedAt",
        sortOrder: "desc",
      });
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch order");
      }
      return response.data as IOrderResponse;
    },
  });

  const latestOrder = data?.data?.[0];

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Successful</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Loading payment details...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Payment confirmed. Order details will appear shortly.
            </div>
          )}

          {!isLoading && !error && latestOrder && (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Order</p>
                <p className="text-lg font-semibold">
                  #{getOrderShortId(latestOrder.id)}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">
                    {formatPrice(latestOrder.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {formatDate(latestOrder.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction</p>
                  <p className="font-medium">
                    {latestOrder.payment?.transactionId || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button asChild>
            <Link href="/dashboard/order">Back to orders</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
