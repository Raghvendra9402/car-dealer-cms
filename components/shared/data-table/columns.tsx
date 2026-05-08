"use client";

import { ListingEditForm } from "@/components/listing/listing-edit-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAIState } from "@/hooks/use-ai-state";
import { CarListing, ListingStatus } from "@/lib/generated/prisma/client";
import { changeIdToName } from "@/lib/idToName";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const columns: ColumnDef<CarListing>[] = [
  {
    accessorKey: "carName",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "make.name",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Make
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "color",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Color
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "carYear",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as ListingStatus;
      return (
        <Badge variant={status === "SOLD" ? "destructive" : "active"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const [open, setOpen] = useState(false);
      const { setIsLoading, reset } = useAIState.getState();
      return (
        <>
          <Dialog
            open={open}
            onOpenChange={(open) => {
              setOpen;
              if (!open) {
                reset();
                setIsLoading(false);
              }
            }}
          >
            <DialogContent className="min-w-4xl max-h-125 overflow-scroll">
              <DialogHeader>
                <DialogTitle>Edit listing</DialogTitle>
              </DialogHeader>
              <ListingEditForm listingId={id} />
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">Open</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setOpen(true)}>
                <Pencil />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
