"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSellerOrders } from "@/services/order.services";
import { OrderStatus } from "@/types/order.types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<OrderStatus, string> = {
  PLACED: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-purple-100 text-purple-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SHIPPED: "bg-cyan-100 text-cyan-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function SellerOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["orders", "seller", { page, status }],
    queryFn: () =>
      getSellerOrders({
        page,
        limit,
        ...(status !== "ALL" && { orderStatus: status }),
      }),
  });

  const orders = data?.data?.items || [];
  const meta = data?.data?.meta || { total: 0, page: 1, limit: 10 };

  const statuses: (OrderStatus | "ALL")[] = [
    "ALL",
    "PLACED",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  const totalPages = Math.ceil(meta.total / limit);

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="text-sm font-medium">Filter by Status:</label>
            <Select
              value={status}
              onValueChange={(val) => {
                setStatus(val as OrderStatus | "ALL");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "ALL" ? "All Orders" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-lg font-medium text-muted-foreground">
              No orders found
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <Badge
                        className={STATUS_COLORS[order.status] || "bg-gray-100"}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
                      <div>
                        <p className="font-medium text-foreground">Date</p>
                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Amount</p>
                        <p className="font-semibold text-foreground">
                          ${(order.totalAmount || 0).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Items</p>
                        <p>{order.items?.length || 0} items</p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/seller/dashboard/order/${order.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1 || isLoading}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = i + Math.max(1, page - 2);
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  onClick={() => setPage(pageNum)}
                  disabled={isLoading}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || isLoading}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
