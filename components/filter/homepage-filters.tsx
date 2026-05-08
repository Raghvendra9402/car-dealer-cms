"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { SelectType } from "./select-type";
import { useListingParams } from "@/hooks/use-listing-params";
import { useGetMakes, useGetModels } from "@/hooks/useCarListings";
import { fuelSelect, transmissionSelect } from "@/config/filter-select-types";

export function HomepageFilters() {
  const [params] = useListingParams();
  const { data: makes } = useGetMakes();
  const { data: models } = useGetModels(params.makeId!);

  const makeSelect = [
    { itemName: "All", itemValue: "ALL" },
    ...(makes?.map((m) => ({
      itemName: m.name,
      itemValue: m.id,
    })) ?? []),
  ];

  const modelSelect = [
    { itemName: "All", itemValue: "ALL" },
    ...(models?.map((m) => ({
      itemName: m.name,
      itemValue: m.id,
    })) ?? []),
  ];

  const query = new URLSearchParams();
  if (params.makeId) query.set("makeId", params.makeId);
  if (params.modelId) query.set("modelId", params.modelId);

  const isMakeSelected = !!params.makeId;
  return (
    <div className="w-full max-w-md mx-auto lg:ml-auto bg-white rounded-xl shadow-lg p-6">
      <div className="space-y-4">
        <div className="space-y-2 flex flex-col w-full gap-4">
          <SelectType
            placeholder="Select Make"
            label="Make"
            items={makeSelect!}
            type="make"
          />
          <SelectType
            placeholder="Select Model"
            label="Model"
            items={modelSelect!}
            type="model"
            disabled={!isMakeSelected}
          />
        </div>
        <Button className="w-full" asChild>
          <Link href={`/inventory?${query.toString()}`}>Search</Link>
        </Button>
      </div>
    </div>
  );
}
