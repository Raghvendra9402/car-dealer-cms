"use client";

import { useListingParams } from "@/hooks/use-listing-params";
import { useListingSearch } from "@/hooks/use-listing-search";
import { ListingSearch } from "../inventory/listing-search";
import { usePathname } from "next/navigation";

export function AdminSearch() {
  const pathname = usePathname();
  const [params, setParams] = useListingParams();
  const { searchValue, onSearchChange } = useListingSearch({
    params,
    setParams,
  });

  return (
    <ListingSearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder={`Search ${pathname.split("/")[1]}...`}
    />
  );
}
