"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import MedicineDeleteDialog from "@/components/modules/Medicine/MedicineDeleteDialog";
import MedicineDetailsDialog from "@/components/modules/Medicine/MedicineDetailsDialog";
import MedicineFormDialog from "@/components/modules/Medicine/MedicineFormDialog";
import DataTable from "@/components/shared/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/services/category.services";
import { getManufacturers } from "@/services/manufacturer.services";
import {
  createMedicine,
  deleteMedicine,
  getMedicinesBySeller,
  updateMedicine,
} from "@/services/medicine.services";
import { ICategoryResponse } from "@/types/category.types";
import { IManufacturerResponse } from "@/types/manufacturer.types";
import { MedicineWithSellerRelations } from "@/types/medicine.types";

const buildQueryString = (pagination: PaginationState) => {
  const params = new URLSearchParams();
  params.set("page", String(pagination.pageIndex + 1));
  params.set("limit", String(pagination.pageSize));
  return params.toString();
};

// const getRangeText = (pageIndex: number, pageSize: number, total: number) => {
//   if (!total) {
//     return "Showing 0 to 0 of 0 (total pages: 0)";
//   }
//   const start = pageIndex * pageSize + 1;
//   const end = Math.min(start + pageSize - 1, total);
//   return `Showing ${start} to ${end} of ${total}`;
// };

const ManageMedicinePage = () => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineWithSellerRelations | null>(null);

  const queryString = buildQueryString(pagination);

  const {
    data: medicineResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["seller-medicines", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const response = await getMedicinesBySeller(queryString);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch medicines");
      }
      return response.data as {
        data: MedicineWithSellerRelations[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
    },
    placeholderData: (previous) => previous,
  });

  const medicines = medicineResponse?.data ?? [];
  const meta = medicineResponse?.meta;

  const { data: categoryOptions = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      if (!response.success) {
        return [] as ICategoryResponse[];
      }
      return response.data as ICategoryResponse[];
    },
  });

  const { data: manufacturerOptions = [] } = useQuery({
    queryKey: ["manufacturers"],
    queryFn: async () => {
      const response = await getManufacturers();
      if (!response.success) {
        return [] as IManufacturerResponse[];
      }
      return response.data as IManufacturerResponse[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: {
      name: string;
      description?: string;
      price: number;
      stock: number;
      dosageForm: string;
      strength: string;
      categoryId: string;
      manufacturerId: string;
      isFeatured?: boolean;
      isAvailable?: boolean;
      file?: File;
    }) => {
      /**
       * const formData = new FormData();
      // Prepare data object
      const dataObj: any = {
        name: value.name,
        phone: value.phone,
      };
      if (user?.role === "SELLER") {
        dataObj.seller = {
          shopName: value.shopName,
          shopPhone: value.shopPhone,
          shopAddress: value.shopAddress,
        };
      }
      if (imageFile) {
        formData.append("file", imageFile);
      }
      formData.append("data", JSON.stringify(dataObj));

      await updateMutation.mutateAsync(formData);
       */
      const formData = new FormData();
      if (values.file) {
        formData.append("file", values.file);
      }
      formData.append(
        "data",
        JSON.stringify({
          name: values.name,
          description: values.description,
          price: values.price,
          stock: values.stock,
          dosageForm: values.dosageForm,
          strength: values.strength,
          categoryId: values.categoryId,
          manufacturerId: values.manufacturerId,
          isFeatured: values.isFeatured,
        }),
      );
      return createMedicine(formData);
    },
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to create medicine");
        return;
      }
      toast.success("Medicine created successfully");
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      queryClient.invalidateQueries({ queryKey: ["public-medicines"] });
      setIsCreateOpen(false);
    },
    onError: () => {
      toast.error("Failed to create medicine");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      medicineId,
      values,
    }: {
      medicineId: string;
      values: {
        name: string;
        description?: string;
        price: number;
        stock: number;
        dosageForm: string;
        strength: string;
        categoryId: string;
        manufacturerId: string;
        isFeatured: boolean;
        isAvailable: boolean;
        file?: File;
      };
    }) => {
      const formData = new FormData();
      if (values.file) {
        formData.append("file", values.file);
      }
      formData.append(
        "data",
        JSON.stringify({
          name: values.name,
          description: values.description,
          price: values.price,
          stock: values.stock,
          dosageForm: values.dosageForm,
          strength: values.strength,
          categoryId: values.categoryId,
          manufacturerId: values.manufacturerId,
          isFeatured: values.isFeatured,
          isAvailable: values.isAvailable,
        }),
      );
      return updateMedicine(medicineId, formData);
    },
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to update medicine");
        return;
      }
      toast.success("Medicine updated successfully");
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      queryClient.invalidateQueries({ queryKey: ["public-medicines"] });
      setIsEditOpen(false);
      setSelectedMedicine(null);
    },
    onError: () => {
      toast.error("Failed to update medicine");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMedicine,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to delete medicine");
        return;
      }
      toast.success("Medicine deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      queryClient.invalidateQueries({ queryKey: ["public-medicines"] });
      setIsDeleteOpen(false);
      setSelectedMedicine(null);
    },
    onError: () => {
      toast.error("Failed to delete medicine");
    },
  });

  const columns = useMemo<ColumnDef<MedicineWithSellerRelations>[]>(
    () => [
      {
        header: "Serial",
        cell: ({ row }) =>
          row.index + 1 + pagination.pageIndex * pagination.pageSize,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => `BDT ${row.original.price}`,
      },
      {
        accessorKey: "stock",
        header: "Stock",
      },
      {
        accessorKey: "dosageForm",
        header: "Dosage form",
      },
      {
        accessorKey: "strength",
        header: "Strength",
      },
      {
        id: "isAvailable",
        header: "Available",
        cell: ({ row }) => (
          <Badge variant={row.original.isAvailable ? "default" : "destructive"}>
            {row.original.isAvailable ? "Yes" : "No"}
          </Badge>
        ),
      },
      {
        id: "isFeatured",
        header: "Featured",
        cell: ({ row }) => (
          <Badge variant={row.original.isFeatured ? "secondary" : "outline"}>
            {row.original.isFeatured ? "Yes" : "No"}
          </Badge>
        ),
      },
      {
        id: "category",
        header: "Category",
        cell: ({ row }) => row.original.category?.name ?? "-",
      },
      {
        id: "manufacturer",
        header: "Manufacturer",
        cell: ({ row }) => row.original.manufacturer?.name ?? "-",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedMedicine(row.original);
                    setIsDetailsOpen(true);
                  }}
                >
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedMedicine(row.original);
                    setIsEditOpen(true);
                  }}
                >
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setSelectedMedicine(row.original);
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
    [
      pagination.pageIndex,
      pagination.pageSize,
      setIsDeleteOpen,
      setIsDetailsOpen,
      setIsEditOpen,
      setSelectedMedicine,
    ],
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between gap-3 sm:flex-row">
          <CardTitle>All medicine</CardTitle>
          <Button onClick={() => setIsCreateOpen(true)}>Create</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load medicines.
            </p>
          ) : (
            <>
              <DataTable
                data={medicines}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="No medicines found."
                pagination={{
                  state: pagination,
                  onPaginationChange: setPagination,
                }}
                meta={meta}
              />
            </>
          )}
        </CardContent>
      </Card>

      <MedicineFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        mode="create"
        categories={categoryOptions.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        manufacturers={manufacturerOptions.map((manufacturer) => ({
          label: manufacturer.name,
          value: manufacturer.id,
        }))}
        isSubmitting={createMutation.isPending}
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
        }}
      />

      <MedicineFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        mode="update"
        initialValues={
          selectedMedicine
            ? {
                name: selectedMedicine.name,
                description: selectedMedicine.description ?? "",
                price: String(selectedMedicine.price),
                stock: String(selectedMedicine.stock),
                dosageForm: selectedMedicine.dosageForm,
                strength: selectedMedicine.strength,
                categoryId: selectedMedicine.category?.id ?? "",
                manufacturerId: selectedMedicine.manufacturer?.id ?? "",
                isFeatured: selectedMedicine.isFeatured,
                isAvailable: selectedMedicine.isAvailable,
              }
            : undefined
        }
        categories={categoryOptions.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        manufacturers={manufacturerOptions.map((manufacturer) => ({
          label: manufacturer.name,
          value: manufacturer.id,
        }))}
        isSubmitting={updateMutation.isPending}
        onSubmit={async (values) => {
          if (!selectedMedicine) {
            return;
          }
          await updateMutation.mutateAsync({
            medicineId: selectedMedicine.id,
            values: {
              ...values,
              isFeatured: Boolean(values.isFeatured),
              isAvailable: Boolean(values.isAvailable),
            },
          });
        }}
      />

      <MedicineDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        medicine={selectedMedicine}
      />

      <MedicineDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        medicineName={selectedMedicine?.name}
        isDeleting={deleteMutation.isPending}
        onConfirm={() => {
          if (!selectedMedicine) {
            return;
          }
          deleteMutation.mutate(selectedMedicine.id);
        }}
      />
    </div>
  );
};

export default ManageMedicinePage;
