"use client";

import { Prisma } from "@/lib/generated/prisma/client";
import { CarCard } from "./car-card";
import { CarListingWithSignedUrls } from "@/config/types";

interface InventoryItemProps {
  data: CarListingWithSignedUrls;
}
export function InventoryItem({ data }: InventoryItemProps) {
  return (
    <CarCard
      id={data.id}
      description={data.description!}
      color={data.color}
      images={data.images}
      fuel={data.fuelType}
      location={data.location}
      name={data.carName}
      price={data.price}
      reading={data.odometer}
      status={data.status}
      transmission={data.transmission}
      year={data.carYear}
      key={data.id}
    />
  );
}
