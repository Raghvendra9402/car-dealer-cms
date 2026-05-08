import { listingParams } from "@/lib/inventory/params";
import { useQueryStates } from "nuqs";

export const useListingParams = () => {
  return useQueryStates(listingParams);
};
