"use client";

import { Button } from "../ui/button";

interface ListingPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function ListingPagination({
  page,
  onPageChange,
  totalPages,
  disabled,
}: ListingPaginationProps) {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={page === 1 || disabled}
          variant={"outline"}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          size={"sm"}
        >
          Previous
        </Button>
        <Button
          disabled={page === totalPages || totalPages === 0 || disabled}
          variant={"outline"}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          size={"sm"}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
