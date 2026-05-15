"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

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
import {
  updateOrderStatus,
  getOrdersByParams,
} from "@/services/order.services";
import {
  IOrder,
  IOrderResponse,
  OrderStatus,
  PaymentStatus,
} from "@/types/order.types";
import OrderDetailsDialog from "./OrderDetailsDialog";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderBadges";
import { formatDate, formatPrice, getOrderShortId } from "./orderUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const getNextStatusOptions = (status: OrderStatus) => {
  if (status === OrderStatus.PLACED) {
    return [OrderStatus.PROCESSING];
  }
  if (status === OrderStatus.PROCESSING) {
    return [OrderStatus.SHIPPED];
  }
  if (status === OrderStatus.SHIPPED) {
    return [OrderStatus.DELIVERED];
  }
  return [] as OrderStatus[];
};

const SellerOrdersPage = () => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<DataTableFilterValues>({});
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<OrderStatus | "">("");

  const queryParams = useMemo(
    () => buildQueryString(pagination, searchTerm, filters),
    [pagination, searchTerm, filters],
  );

  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["seller-orders", queryParams],
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

  const updateMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => updateOrderStatus(orderId, { status }),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to update status");
        return;
      }
      toast.success("Order status updated");
      setIsUpdateOpen(false);
      setSelectedOrder(null);
      setNextStatus("");
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

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
        cell: ({ row }) => {
          const order = row.original;
          const canUpdate = getNextStatusOptions(order.status).length > 0;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsViewOpen(true);
                  }}
                >
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!canUpdate}
                  onClick={() => {
                    setSelectedOrder(order);
                    setNextStatus("");
                    setIsUpdateOpen(true);
                  }}
                >
                  Update
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
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

  const updateOptions = selectedOrder
    ? getNextStatusOptions(selectedOrder.status)
    : [];

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
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

      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          {selectedOrder ? (
            <div className="space-y-4">
              {updateOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No further updates are available for this order.
                </p>
              ) : (
                <Select
                  value={nextStatus}
                  onValueChange={(value) => setNextStatus(value as OrderStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select next status" />
                  </SelectTrigger>
                  <SelectContent>
                    {updateOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsUpdateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!nextStatus || updateMutation.isPending}
                  onClick={() =>
                    selectedOrder &&
                    nextStatus &&
                    updateMutation.mutate({
                      orderId: selectedOrder.id,
                      status: nextStatus as OrderStatus,
                    })
                  }
                >
                  Update
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select an order to update.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerOrdersPage;
