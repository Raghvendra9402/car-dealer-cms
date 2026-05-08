import { PAGINATION } from "@/config/constant";
import { useEffect, useState } from "react";

interface UseListingSearchProps<
  T extends {
    search: string;
    page: number;
  }
> {
  params: T;
  setParams: (params: T) => void;
  debouncedMs?: number;
}

export function useListingSearch<
  T extends {
    search: string;
    page: number;
  }
>({ params, setParams, debouncedMs = 500 }: UseListingSearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setParams({
        ...params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE,
      });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debouncedMs);

    return () => clearTimeout(timer);
  }, [localSearch, params, setParams, debouncedMs]);

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}
