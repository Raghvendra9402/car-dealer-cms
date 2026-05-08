"use client";
import { useListingParams } from "@/hooks/use-listing-params";
import { Button } from "../ui/button";
import { PAGINATION } from "@/config/constant";

export function ResetButton() {
  const [_, setParams] = useListingParams();
  const onReset = () => {
    setParams({
      page: PAGINATION.DEFAULT_PAGE,
      search: "",
      makeId: null,
      modelId: null,
      transmission: null,
      fuel: null,
      body: null,
      minPrice: null,
      maxPrice: null,
    });
  };
  return (
    <Button variant={"link"} onClick={onReset}>
      Reset filters
    </Button>
  );
}
