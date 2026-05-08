import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.carListing.getMany>;

export const prefetchListings = (params: {
  page?: number;
  pageSize?: number;
  search?: string;
  makeId?: Input["makeId"] | null;
  modelId?: Input["modelId"] | null;
  transmission?: Input["transmission"] | null;
  fuel?: Input["fuel"] | null;
  body?: Input["body"] | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}) => {
  const normalized: Input = {
    ...params,
    makeId: params.makeId ?? undefined,
    modelId: params.modelId ?? undefined,
    transmission: params.transmission ?? undefined,
    fuel: params.fuel ?? undefined,
    body: params.body ?? undefined,
    minPrice: params.minPrice ?? undefined,
    maxPrice: params.maxPrice ?? undefined,
  };

  return prefetch(trpc.carListing.getMany.queryOptions(normalized));
};
