"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import Link from "next/link";
import { toast } from "sonner";

import DataTable from "@/components/shared/table/DataTable";
import {
  DataTableFilterConfig,
  DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  cancelOrder,
  getOrdersByParams,
  placeOrderWithPayment,
} from "@/services/order.services";
import {
  IOrder,
  IOrderResponse,
  OrderStatus,
  PaymentStatus,
} from "@/types/order.types";
import {
  formatDate,
  formatPrice,
  getOrderItemCount,
  getOrderShortId,
} from "./orderUtils";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderBadges";

const buildQueryString = (
  pagination: PaginationState,
  searchTerm: string,
  filters: DataTableFilterValues,
) => {
  return {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    searchTerm: searchTerm.trim() || undefined,
    status: typeof filters.status === "string" ? filters.status : undefined,
    paymentStatus:
      typeof filters.paymentStatus === "string"
        ? filters.paymentStatus
        : undefined,
  };
};

const OrderListPage = () => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<DataTableFilterValues>({});

  const queryParams = useMemo(
    () => buildQueryString(pagination, searchTerm, filters),
    [pagination, searchTerm, filters],
  );

  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customer-orders", queryParams],
    queryFn: async () => {
      const response = await getOrdersByParams(queryParams);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch orders");
      }
      return response.data as IOrderResponse;
    },
    placeholderData: (previous) => previous,
  });

  const orders = ordersResponse?.data ?? [];
  const meta = ordersResponse?.meta;

  const payMutation = useMutation({
    mutationFn: placeOrderWithPayment,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to initiate payment");
        return;
      }
      if (response.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    },
    onError: () => {
      toast.error("Failed to initiate payment");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to cancel order");
        return;
      }
      toast.success("Order cancelled");
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
    onError: () => {
      toast.error("Failed to cancel order");
    },
  });

  const columns = useMemo<ColumnDef<IOrder>[]>(
    () => [
      {
        header: "Order",
        cell: ({ row }) => `#${getOrderShortId(row.original.id)}`,
      },
      {
        header: "Date",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        header: "Items",
        cell: ({ row }) => getOrderItemCount(row.original),
      },
      {
        header: "Total",
        cell: ({ row }) => formatPrice(row.original.totalAmount),
      },
      {
        header: "Status",
        cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
      },
      {
        header: "Payment",
        cell: ({ row }) => (
          <PaymentStatusBadge status={row.original.paymentStatus} />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const order = row.original;
          const canPay =
            order.status === OrderStatus.PENDING &&
            order.paymentStatus === PaymentStatus.PENDING;
          const canCancel = order.status === OrderStatus.PENDING;

          return (
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href={`/dashboard/order/${order.id}`}>Track</Link>
              </Button>
              <Button
                size="sm"
                onClick={() => payMutation.mutate(order.id)}
                disabled={!canPay || payMutation.isPending}
              >
                Pay & confirm
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  const shouldCancel = window.confirm(
                    "Cancel this order? This cannot be undone.",
                  );
                  if (shouldCancel) {
                    cancelMutation.mutate(order.id);
                  }
                }}
                disabled={!canCancel || cancelMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          );
        },
      },
    ],
    [payMutation, cancelMutation],
  );

  const filterConfigs: DataTableFilterConfig[] = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        type: "single-select",
        options: [
          { label: "Pending", value: OrderStatus.PENDING },
          { label: "Placed", value: OrderStatus.PLACED },
          { label: "Processing", value: OrderStatus.PROCESSING },
          { label: "Shipped", value: OrderStatus.SHIPPED },
          { label: "Delivered", value: OrderStatus.DELIVERED },
          { label: "Cancelled", value: OrderStatus.CANCELLED },
        ],
      },
      {
        id: "paymentStatus",
        label: "Payment",
        type: "single-select",
        options: [
          { label: "Pending", value: PaymentStatus.PENDING },
          { label: "Paid", value: PaymentStatus.PAID },
        ],
      },
    ],
    [],
  );

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Unable to load orders.
            </div>
          )}

          <DataTable
            data={orders}
            columns={columns}
            emptyMessage="No orders found."
            isLoading={isLoading}
            pagination={{
              state: pagination,
              onPaginationChange: setPagination,
            }}
            search={{
              initialValue: searchTerm,
              placeholder: "Search orders",
              onDebouncedChange: (value) => {
                setSearchTerm(value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              },
            }}
            filters={{
              configs: filterConfigs,
              values: filters,
              onFilterChange: (filterId, value) => {
                setFilters((prev) => ({ ...prev, [filterId]: value }));
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              },
              onClearAll: () => setFilters({}),
            }}
            meta={meta}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderListPage;
