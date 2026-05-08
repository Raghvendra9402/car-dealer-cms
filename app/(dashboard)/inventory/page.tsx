import { LogoutButton } from "@/components/auth/logout-button";
import { InventoryList } from "@/components/inventory/inventory-list";
import { Loader } from "@/components/shared/loader";
import { requireAuth } from "@/lib/auth-utlis";
import { prefetchListings } from "@/lib/inventory/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { SearchParams } from "nuqs/server";
import { listingParamsLoader } from "@/lib/inventory/params-loader";
import { InventoryContainer } from "@/components/inventory/inventory-container";

type Props = {
  searchParams: Promise<SearchParams>;
};

const page = async ({ searchParams }: Props) => {
  const params = await listingParamsLoader(searchParams);
  prefetchListings(params);

  return (
    <InventoryContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<p>Error!</p>}>
          <Suspense fallback={<Loader />}>
            <InventoryList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </InventoryContainer>
  );
};

export default page;
