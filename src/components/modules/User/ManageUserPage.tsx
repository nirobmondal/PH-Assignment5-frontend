"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { ColumnDef, PaginationState } from "@tanstack/react-table";

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
import StatusBadgeCell from "@/components/shared/cell/StatusBadgeCell";
import { getAllUsers, updateUserStatus } from "@/services/admin.services";
import { UserRole } from "@/lib/authUtils";
import { UserStatus } from "@/types/auth.types";
import { IUserListResponse, IUserResponse } from "@/types/user.types";
import UserDetailsDialog from "@/components/modules/User/UserDetailsDialog";

const buildQueryString = (
  pagination: PaginationState,
  searchTerm: string,
  filters: DataTableFilterValues,
) => {
  const params = new URLSearchParams();
  params.set("page", String(pagination.pageIndex + 1));
  params.set("limit", String(pagination.pageSize));

  if (searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  }

  const roleValue = filters.role;
  if (typeof roleValue === "string" && roleValue.length > 0) {
    params.set("role", roleValue);
  }

  const statusValue = filters.status;
  if (typeof statusValue === "string" && statusValue.length > 0) {
    params.set("status", statusValue);
  }

  return params.toString();
};

const ManageUserPage = () => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<DataTableFilterValues>({});
  const [selectedUser, setSelectedUser] = useState<IUserResponse | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const queryString = useMemo(
    () => buildQueryString(pagination, searchTerm, filters),
    [pagination, searchTerm, filters],
  );

  const {
    data: usersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-users", queryString],
    queryFn: async () => {
      const response = await getAllUsers(queryString);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch users");
      }
      return response.data as IUserListResponse;
    },
    placeholderData: (previous) => previous,
  });

  const users = usersResponse?.data ?? [];
  const meta = usersResponse?.meta;

  const updateMutation = useMutation({
    mutationFn: async ({
      userId,
      status,
    }: {
      userId: string;
      status: UserStatus;
    }) => updateUserStatus(userId, status),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to update user");
        return;
      }
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const filterConfigs: DataTableFilterConfig[] = useMemo(
    () => [
      {
        id: "role",
        label: "Role",
        type: "single-select",
        options: [
          { label: "Admin", value: UserRole.ADMIN },
          { label: "Seller", value: UserRole.SELLER },
          { label: "Customer", value: UserRole.CUSTOMER },
        ],
      },
      {
        id: "status",
        label: "Status",
        type: "single-select",
        options: [
          { label: "Active", value: UserStatus.ACTIVE },
          { label: "Banned", value: UserStatus.BANNED },
        ],
      },
    ],
    [],
  );

  const columns = useMemo<ColumnDef<IUserResponse>[]>(
    () => [
      {
        header: "Serial",
        cell: ({ row }) =>
          pagination.pageIndex * pagination.pageSize + row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => row.original.role?.toLowerCase() || "N/A",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadgeCell status={row.original.status || "ACTIVE"} />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          const isAdmin = user?.role === UserRole.ADMIN;
          const nextStatus =
            user?.status === UserStatus.ACTIVE
              ? UserStatus.BANNED
              : UserStatus.ACTIVE;

          return (
            <div className="flex justify-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedUser(user);
                      setIsViewOpen(true);
                    }}
                  >
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isAdmin || updateMutation.isPending}
                    onClick={() =>
                      updateMutation.mutate({
                        userId: user.id,
                        status: nextStatus,
                      })
                    }
                  >
                    {user?.status === UserStatus.ACTIVE ? "Ban" : "Activate"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [pagination.pageIndex, pagination.pageSize, updateMutation.isPending],
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Manage users</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">Failed to load users.</p>
          ) : (
            <DataTable
              data={users}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="No users found."
              pagination={{
                state: pagination,
                onPaginationChange: setPagination,
              }}
              search={{
                initialValue: searchTerm,
                placeholder: "Search by name",
                debounceMs: 500,
                onDebouncedChange: (value) => {
                  setSearchTerm(value);
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: 0,
                  }));
                },
              }}
              filters={{
                configs: filterConfigs,
                values: filters,
                onFilterChange: (filterId, value) => {
                  setFilters((prev) => ({
                    ...prev,
                    [filterId]: value,
                  }));
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: 0,
                  }));
                },
                onClearAll: () => {
                  setFilters({});
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: 0,
                  }));
                },
              }}
              meta={{
                page: meta?.page ?? pagination.pageIndex + 1,
                limit: meta?.limit ?? pagination.pageSize,
                total: meta?.total ?? users.length,
                totalPages: meta?.totalPages ?? 0,
              }}
            />
          )}
        </CardContent>
      </Card>

      <UserDetailsDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        user={selectedUser}
      />
    </div>
  );
};

export default ManageUserPage;
