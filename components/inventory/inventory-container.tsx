"use client";

import { useListingParams } from "@/hooks/use-listing-params";
import { useListingSearch } from "@/hooks/use-listing-search";
import { useSuspenseListing } from "@/hooks/useCarListings";
import { ListingContainer } from "./listing-container";
import { ListingSearch } from "./listing-search";
import { ListingPagination } from "./listing-pagination";

export function InventoryContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const listings = useSuspenseListing();
  const [params, setParams] = useListingParams();
  const { searchValue, onSearchChange } = useListingSearch({
    params,
    setParams,
  });

  return (
    <ListingContainer
      search={
        <ListingSearch
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search cars..."
        />
      }
      pagination={
        <ListingPagination
          disabled={listings.isFetching}
          totalPages={listings.data.totalPages}
          page={listings.data.page}
          onPageChange={(page) => setParams({ ...params, page })}
        />
      }
    >
      {children}
    </ListingContainer>
  );
}
