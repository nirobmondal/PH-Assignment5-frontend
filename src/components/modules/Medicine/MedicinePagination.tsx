"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type PaginationToken = number | "start-ellipsis" | "end-ellipsis";

const DEFAULT_PAGE_SIZES = [9, 12, 18, 24, 36] as const;

const isDefaultPageSize = (value: number) => {
  return DEFAULT_PAGE_SIZES.includes(
    value as (typeof DEFAULT_PAGE_SIZES)[number],
  );
};

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationToken[] => {
  if (totalPages <= 0) {
    return [];
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 5) {
    return [1, 2, 3, 4, 5, "end-ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 4) {
    return [
      1,
      "start-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "start-ellipsis",
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
    "end-ellipsis",
    totalPages,
  ];
};

type MedicinePaginationProps = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRows: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

const MedicinePagination = ({
  currentPage,
  pageSize,
  totalPages,
  totalRows,
  isLoading,
  onPageChange,
  onPageSizeChange,
}: MedicinePaginationProps) => {
  const [isCustomMode, setIsCustomMode] = useState<boolean>(
    !isDefaultPageSize(pageSize),
  );
  const [customPageSize, setCustomPageSize] = useState<string>(
    String(pageSize),
  );

  const isCurrentPageSizeCustom = !isDefaultPageSize(pageSize);
  const showCustomInput = isCustomMode || isCurrentPageSizeCustom;
  const pageSizeSelectValue = showCustomInput ? "custom" : String(pageSize);

  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const applyCustomPageSize = () => {
    const parsed = Number(customPageSize);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return;
    }

    setIsCustomMode(!isDefaultPageSize(parsed));
    onPageSizeChange(parsed);
  };

  const onPageSizeSelect = (value: string) => {
    if (value === "custom") {
      setIsCustomMode(true);
      setCustomPageSize(String(pageSize));
      return;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return;
    }

    setIsCustomMode(false);
    setCustomPageSize(String(parsed));
    onPageSizeChange(parsed);
  };

  const jumpBackwardTarget = Math.max(1, currentPage - 5);
  const jumpForwardTarget = Math.min(totalPages, currentPage + 5);

  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>

        {paginationItems.map((item) => {
          if (item === "start-ellipsis") {
            return (
              <Button
                key="start-ellipsis"
                variant="ghost"
                size="sm"
                className="min-w-9 px-2"
                onClick={() => onPageChange(jumpBackwardTarget)}
                disabled={isLoading}
              >
                ...
              </Button>
            );
          }

          if (item === "end-ellipsis") {
            return (
              <Button
                key="end-ellipsis"
                variant="ghost"
                size="sm"
                className="min-w-9 px-2"
                onClick={() => onPageChange(jumpForwardTarget)}
                disabled={isLoading}
              >
                ...
              </Button>
            );
          }

          const isActive = item === currentPage;
          return (
            <Button
              key={item}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={cn("min-w-9", isActive && "pointer-events-none")}
              onClick={() => onPageChange(item)}
              disabled={isLoading}
            >
              {item}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages || isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Select value={pageSizeSelectValue} onValueChange={onPageSizeSelect}>
          <SelectTrigger className="w-24" aria-label="Rows per page">
            <SelectValue placeholder="Limit" />
          </SelectTrigger>

          <SelectContent>
            {DEFAULT_PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        <span>rows</span>

        {showCustomInput && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              className="h-9 w-24"
              value={customPageSize}
              onChange={(event) => setCustomPageSize(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyCustomPageSize();
                }
              }}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={applyCustomPageSize}
              disabled={isLoading}
            >
              Apply
            </Button>
          </div>
        )}

        <span className="ml-2">
          Total {totalRows} items, {totalPages} pages
        </span>
      </div>
    </div>
  );
};

export default MedicinePagination;
