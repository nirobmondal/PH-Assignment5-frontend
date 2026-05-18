"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import ManufacturerDeleteDialog from "@/components/modules/Manufacturer/ManufacturerDeleteDialog";
import ManufacturerFormDialog from "@/components/modules/Manufacturer/ManufacturerFormDialog";
import DataTable from "@/components/shared/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createManufacturer,
  deleteManufacturer,
  getManufacturers,
  updateManufacturer,
} from "@/services/manufacturer.services";
import { IManufacturerResponse } from "@/types/manufacturer.types";

const ManageManufacturerPage = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<IManufacturerResponse | null>(null);

  const {
    data: manufacturers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["manufacturers"],
    queryFn: async () => {
      const response = await getManufacturers();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch manufacturers");
      }
      return response.data as IManufacturerResponse[];
    },
  });

  const createMutation = useMutation({
    mutationFn: createManufacturer,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to create manufacturer");
        return;
      }
      toast.success("Manufacturer created successfully");
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      setIsCreateOpen(false);
    },
    onError: () => {
      toast.error("Failed to create manufacturer");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      manufacturerId,
      payload,
    }: {
      manufacturerId: string;
      payload: { name: string; country?: string };
    }) => updateManufacturer(manufacturerId, payload),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to update manufacturer");
        return;
      }
      toast.success("Manufacturer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      setIsEditOpen(false);
      setSelectedManufacturer(null);
    },
    onError: () => {
      toast.error("Failed to update manufacturer");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteManufacturer,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to delete manufacturer");
        return;
      }
      toast.success("Manufacturer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      setIsDeleteOpen(false);
      setSelectedManufacturer(null);
    },
    onError: () => {
      toast.error("Failed to delete manufacturer");
    },
  });

  const columns = useMemo<ColumnDef<IManufacturerResponse>[]>(
    () => [
      {
        header: "Serial",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "country",
        header: "Country",
        cell: ({ row }) => row.original.country || "-",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
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
                    setSelectedManufacturer(row.original);
                    setIsEditOpen(true);
                  }}
                >
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setSelectedManufacturer(row.original);
                    setIsDeleteOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [setIsDeleteOpen, setIsEditOpen, setSelectedManufacturer],
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between gap-3 sm:flex-row">
          <CardTitle>All manufacturer</CardTitle>
          <Button onClick={() => setIsCreateOpen(true)}>Create</Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load manufacturers.
            </p>
          ) : (
            <DataTable
              data={manufacturers}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="No manufacturers found."
            />
          )}
        </CardContent>
      </Card>

      <ManufacturerFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        mode="create"
        isSubmitting={createMutation.isPending}
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
        }}
      />

      <ManufacturerFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        mode="update"
        initialValues={{
          name: selectedManufacturer?.name,
          country: selectedManufacturer?.country ?? "",
        }}
        isSubmitting={updateMutation.isPending}
        onSubmit={async (values) => {
          if (!selectedManufacturer) {
            return;
          }
          await updateMutation.mutateAsync({
            manufacturerId: selectedManufacturer.id,
            payload: values,
          });
        }}
      />

      <ManufacturerDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        manufacturerName={selectedManufacturer?.name}
        isDeleting={deleteMutation.isPending}
        onConfirm={() => {
          if (!selectedManufacturer) {
            return;
          }
          deleteMutation.mutate(selectedManufacturer.id);
        }}
      />
    </div>
  );
};

export default ManageManufacturerPage;
