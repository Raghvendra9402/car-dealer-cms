"use client";

import { useGetFavouriteListings } from "@/hooks/useCarListings";
import { CarCard } from "../inventory/car-card";

export function FavouriteListings() {
  const { data } = useGetFavouriteListings();

  return (
    <div className="flex flex-col gap-y-6 ">
      <h1 className="text-2xl">Your favourite listings</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 place-items-center ">
        {data?.map((d) => (
          <CarCard
            id={d.id}
            description={d.description!}
            color={d.color}
            images={d.images}
            fuel={d.fuelType}
            location={d.location}
            name={d.carName}
            price={d.price}
            reading={d.odometer}
            status={d.status}
            transmission={d.transmission}
            year={d.carYear}
            key={d.id}
          />
        ))}
      </div>
    </div>
  );
}
