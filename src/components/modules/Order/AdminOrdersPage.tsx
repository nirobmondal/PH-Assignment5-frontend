"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import DataTable from "@/components/shared/table/DataTable";
import {
  DataTableFilterConfig,
  DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrdersByParams } from "@/services/order.services";
import {
  IOrder,
  IOrderResponse,
  OrderStatus,
  PaymentStatus,
} from "@/types/order.types";
import OrderDetailsDialog from "./OrderDetailsDialog";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderBadges";
import { formatDate, formatPrice, getOrderShortId } from "./orderUtils";

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

const AdminOrdersPage = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<DataTableFilterValues>({});
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const queryParams = useMemo(
    () => buildQueryString(pagination, searchTerm, filters),
    [pagination, searchTerm, filters],
  );

  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-orders", queryParams],
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

  const columns = useMemo<ColumnDef<IOrder>[]>(
    () => [
      {
        header: "Order",
        cell: ({ row }) => `#${getOrderShortId(row.original.id)}`,
      },
      {
        header: "Customer",
        cell: ({ row }) => row.original.shippingName,
      },
      {
        header: "Phone",
        cell: ({ row }) => row.original.shippingPhone,
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
        header: "Date",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOrder(row.original);
                  setIsViewOpen(true);
                }}
              >
                View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
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
          <CardTitle>All Orders</CardTitle>
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

      <OrderDetailsDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminOrdersPage;
