"use client";

import {
  bodyTypeSelect,
  fuelSelect,
  transmissionSelect,
} from "@/config/filter-select-types";
import { RangeFilter } from "../filter/range-filter";
import { ResetButton } from "../filter/reset-button";
import { SelectType } from "../filter/select-type";
import { useGetMakes, useGetModels } from "@/hooks/useCarListings";
import { useListingParams } from "@/hooks/use-listing-params";

interface ListingContainerProps {
  header?: React.ReactNode;
  search?: React.ReactNode;
  children: React.ReactNode;
  pagination?: React.ReactNode;
}

export function ListingContainer({
  children,
  header,
  pagination,
  search,
}: ListingContainerProps) {
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

  const isMakeSelected = !!params.makeId;

  return (
    <div className="p-4 md:p-0 h-full flex flex-col">
      <div className="w-full flex flex-col flex-1 gap-y-4">
        {header}
        <div className="flex flex-col gap-y-2 flex-1 overflow-auto">
          {/* Show search on mobile/tablet only */}
          <div className="xl:hidden px-4">{search}</div>

          <div className="flex gap-x-4 flex-1">
            {/* Sidebar with search on desktop */}
            <aside className="hidden xl:flex xl:flex-col border-r-2 xl:gap-y-4 w-64 shrink-0 p-2">
              <div className="flex justify-end">
                <ResetButton />
              </div>
              {search}
              {/* Add your filters here */}
              <div className="space-y-4">
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
                <SelectType
                  placeholder="Select Transmission"
                  label="Transmission"
                  items={transmissionSelect}
                  type="transmission"
                />
                <SelectType
                  placeholder="Select Fuel Type"
                  label="Fuel"
                  items={fuelSelect}
                  type="fuel"
                />
                <SelectType
                  placeholder="Select Body Type"
                  label="Body type"
                  items={bodyTypeSelect}
                  type="bodyType"
                />
                <RangeFilter
                  label="Price"
                  type="price"
                  minLimit={5}
                  maxLimit={70}
                />
                <RangeFilter
                  label="Odometer"
                  type="odometer"
                  minLimit={1000}
                  maxLimit={100000}
                />
              </div>
            </aside>

            <main className="flex-1 pr-4">{children}</main>
          </div>
        </div>
        <div className="px-4">{pagination}</div>
      </div>
    </div>
  );
}
