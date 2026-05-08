"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useAddFavourite, useGetFavourites } from "@/hooks/useCarListings";
import { cn } from "@/lib/utils";

interface FavouritesButtonProps {
  listingId: string;
}

export function FavouritesButton({ listingId }: FavouritesButtonProps) {
  const addToFavourites = useAddFavourite();
  const handleFavourite = () => {
    addToFavourites.mutate({ listingId }, {});
  };

  const { data } = useGetFavourites();
  const isFavourite = data?.ids.includes(listingId);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size={"icon"}
          variant={"ghost"}
          className="absolute top-2 left-2 flex gap-1 z-10 group h-6! w-6! lg:h-8! lg:w-8! xl:h-10! xl:w-10!"
          onClick={handleFavourite}
        >
          <Heart
            className={cn(
              "transition-all duration-200 size-4",
              isFavourite
                ? "fill-rose-600 text-rose-600"
                : "text-muted-foreground"
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isFavourite ? "Remove from favourites" : "Add to favourites"}
      </TooltipContent>
    </Tooltip>
  );
}
