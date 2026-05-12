"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import CategoryDeleteDialog from "@/components/modules/Category/CategoryDeleteDialog";
import CategoryFormDialog from "@/components/modules/Category/CategoryFormDialog";
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
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category.services";
import { ICategoryResponse } from "@/types/category.types";

const ManageCategoryPage = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ICategoryResponse | null>(null);

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch categories");
      }
      return response.data as ICategoryResponse[];
    },
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to create category");
        return;
      }
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsCreateOpen(false);
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      categoryId,
      payload,
    }: {
      categoryId: string;
      payload: { name: string; description?: string };
    }) => updateCategory(categoryId, payload),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to update category");
        return;
      }
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsEditOpen(false);
      setSelectedCategory(null);
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message || "Failed to delete category");
        return;
      }
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });

  const columns = useMemo<ColumnDef<ICategoryResponse>[]>(
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
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.original.description || "-",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCategory(row.original);
                    setIsEditOpen(true);
                  }}
                >
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setSelectedCategory(row.original);
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
    [setIsDeleteOpen, setIsEditOpen, setSelectedCategory],
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between gap-3 sm:flex-row">
          <CardTitle>All category</CardTitle>
          <Button onClick={() => setIsCreateOpen(true)}>Create</Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-destructive">
              Failed to load categories.
            </p>
          ) : (
            <DataTable
              data={categories}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="No categories found."
            />
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        mode="create"
        isSubmitting={createMutation.isPending}
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
        }}
      />

      <CategoryFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        mode="update"
        initialValues={{
          name: selectedCategory?.name,
          description: selectedCategory?.description ?? "",
        }}
        isSubmitting={updateMutation.isPending}
        onSubmit={async (values) => {
          if (!selectedCategory) {
            return;
          }
          await updateMutation.mutateAsync({
            categoryId: selectedCategory.id,
            payload: values,
          });
        }}
      />

      <CategoryDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        categoryName={selectedCategory?.name}
        isDeleting={deleteMutation.isPending}
        onConfirm={() => {
          if (!selectedCategory) {
            return;
          }
          deleteMutation.mutate(selectedCategory.id);
        }}
      />
    </div>
  );
};

export default ManageCategoryPage;
