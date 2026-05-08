"use client";

import { useSuspenseListing } from "@/hooks/useCarListings";
import { Loader, TriangleAlert } from "lucide-react";
import { InventoryItem } from "./inventory-item";

export function InventoryList() {
  const listings = useSuspenseListing();

  if (listings.data.items.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="flex flex-col items-center">
          <TriangleAlert className="size-7 text-zinc-500" />
          <h2 className="text-xl text-zinc-500">No Inventory found</h2>
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-2 place-items-center ">
      {listings.data.items.map((item) => (
        <InventoryItem data={item} key={item.id} />
      ))}
    </div>
  );
}
