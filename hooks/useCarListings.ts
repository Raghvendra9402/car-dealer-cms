import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useListingParams } from "./use-listing-params";
import { useRouter } from "next/navigation";

export const useSuspenseListing = () => {
  const trpc = useTRPC();
  const [params] = useListingParams();
  return useSuspenseQuery(
    trpc.carListing.getMany.queryOptions({
      ...params,
      makeId: params.makeId ?? undefined,
      modelId: params.modelId ?? undefined,
      transmission: params.transmission ?? undefined,
      fuel: params.fuel ?? undefined,
      body: params.body ?? undefined,
      minPrice: params.minPrice ?? undefined,
      maxPrice: params.maxPrice ?? undefined,
    }),
  );
};

export const useAddFavourite = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.carListing.addFavourite.mutationOptions({
      onSuccess: (data) => {
        if (data.action === "added") {
          toast.success("Added to favourites");
        } else {
          toast.info("Removed from favourites");
        }

        queryClient.invalidateQueries(
          trpc.carListing.getFavourites.queryOptions(),
        );
      },
      onError: (error) => {
        toast.error(`Something went wrong: ${error.message}`);
      },
    }),
  );
};

export const useGetFavourites = () => {
  const trpc = useTRPC();

  return useQuery(trpc.carListing.getFavourites.queryOptions());
};

export const useGetFavouriteListings = () => {
  const trpc = useTRPC();

  return useQuery(trpc.carListing.getFavouriteListings.queryOptions());
};

export const useGetOneListing = (listingId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.carListing.getOne.queryOptions({ listingId }));
};

export const usePutImageS3 = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.s3.putImage.mutationOptions({
      onSuccess: () => {
        toast.success("Images upload successfully");
      },
      onError: () => {
        toast.error("Something went wrong while uploading.");
      },
    }),
  );
};

export const useGetAIResponse = (draftId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.ai.getResponse.queryOptions(
      { id: draftId },
      {
        refetchInterval(query) {
          const data = query.state.data;
          if (!data || data.status === "PENDING") {
            return 100;
          }
          return false;
        },
      },
    ),
  );
};

export const useCreateCarListing = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.admin.createListing.mutationOptions({
      onSuccess: () => {
        toast.success("Car listing created successfully.");
      },
      onError: (error) => {
        toast.error(`Something went wrong: ${error.message}`);
      },
    }),
  );
};

export const useUpdateListing = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.admin.updateListing.mutationOptions({
      onSuccess: () => {
        toast.success("Car listing update successfully.");
      },
      onError: (error) => {
        toast.error(`Something went wrong: ${error.message}`);
      },
    }),
  );
};

export const useGetDashboardStats = () => {
  const trpc = useTRPC();

  return useQuery(trpc.admin.dashboardStats.queryOptions());
};

export const useGetMakes = () => {
  const trpc = useTRPC();

  return useQuery(trpc.carListing.getMakes.queryOptions());
};

export const useGetModels = (makeId: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.carListing.getModels.queryOptions({ makeId }));
};

export const useReserveCar = () => {
  const trpc = useTRPC();
  const router = useRouter();

  return useMutation(
    trpc.carListing.reserverCar.mutationOptions({
      onSuccess: (data) => {
        toast.success("Your reservation successfully completed");
        router.push(`/inventory/${data.listingId}/reserve/success`);
      },
      onError: (err) => {
        toast.error(`Something went wrong: ${err.message}`);
      },
    }),
  );
};

export const useGetReservations = () => {
  const trpc = useTRPC();

  return useQuery(trpc.carListing.getReservations.queryOptions());
};
