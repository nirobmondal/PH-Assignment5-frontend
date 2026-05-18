"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CheckCircle, Package, CreditCard, Calendar } from "lucide-react";

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
    <div className="space-y-6 p-4 md:p-6">
      {/* Success header */}
      <div className="flex flex-col items-center justify-center space-y-3 text-center">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-8 w-8 text-green-600 md:h-10 md:w-10" />
        </div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Payment Successful!
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Your order has been placed and payment is confirmed.
        </p>
      </div>

      <Card className="rounded-sm border shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-muted/20 px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4 text-primary" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="mt-3 text-sm text-muted-foreground">
                Loading payment details...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-sm border border-amber-200 bg-amber-50 p-5 text-center">
              <p className="text-sm text-amber-700">
                Payment confirmed. Order details will appear shortly.
              </p>
            </div>
          )}

          {!isLoading && !error && latestOrder && (
            <div className="space-y-5">
              {/* Order ID */}
              <div className="rounded-sm bg-muted/30 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Order ID
                </p>
                <p className="mt-1 font-mono text-lg font-bold text-foreground">
                  #{getOrderShortId(latestOrder.id)}
                </p>
              </div>

              {/* Order details grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-sm border p-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-base font-semibold">
                      {formatPrice(latestOrder.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-sm border p-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-base font-medium">
                      {formatDate(latestOrder.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-start gap-3 rounded-sm border p-3">
                  <div className="h-4 w-0.5 bg-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      Transaction ID
                    </p>
                    <p className="text-sm font-mono break-all">
                      {latestOrder.payment?.transactionId || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Button asChild className="rounded-sm px-6">
              <Link href="/dashboard/order">View My Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
