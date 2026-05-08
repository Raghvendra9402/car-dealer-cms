"use client";

import { useGetOneListing } from "@/hooks/useCarListings";
import { Carousel } from "../images/carousel";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  CarIcon,
  FuelIcon,
  GaugeIcon,
  PowerIcon,
  UsersIcon,
} from "lucide-react";
import {
  BodyType,
  ModelFuelType,
  ModelTransMission,
} from "@/lib/generated/prisma/enums";

interface ListingViewProps {
  listingId: string;
}

const features = (data: {
  bodyType: BodyType;
  fuelType: ModelFuelType;
  transmissionType: ModelTransMission;
  odoReading: number;
  seats: number;
}) => [
  {
    id: 1,
    icon: <CarIcon className="size-6 max-auto text-gray-500" />,
    label: data.bodyType,
  },
  {
    id: 2,
    icon: <FuelIcon className="size-6 max-auto text-gray-500" />,
    label: data.fuelType,
  },
  {
    id: 3,
    icon: <PowerIcon className="size-6 max-auto text-gray-500" />,
    label: data.transmissionType,
  },
  {
    id: 4,
    icon: <GaugeIcon className="size-6 max-auto text-gray-500" />,
    label: `${data.odoReading} km`,
  },
  {
    id: 5,
    icon: <UsersIcon className="size-6 max-auto text-gray-500" />,
    label: `${data.seats}`,
  },
  {
    id: 6,
    icon: <CarIcon className="size-6 max-auto text-gray-500" />,
    label: data.bodyType,
  },
];

export function ListingView({ listingId }: ListingViewProps) {
  const { data } = useGetOneListing(listingId);
  return (
    <div className="container mx-auto px-4 md:px-0 py-12">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="md:w-1/2 flex justify-center">
          <div className="w-full max-w-130 aspect-4/3">
            <Carousel images={data.images} />
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {data.makeId} {data.carName}
              </h1>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2 mb-2">
            <span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md">
              {data.carYear}
            </span>
            {data.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
            {/* <span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md">
              {data.odometer} km
            </span>
            <span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md">
              {data.color}
            </span>
            <span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-md">
              {data.fuelType.charAt(0) +
                data.fuelType.substring(1).toLowerCase()}
            </span> */}
          </div>
          {data.description && (
            <div className="mb-4">
              <span className="text-sm text-zinc-500">{data.description}</span>
            </div>
          )}
          <div className="text-4xl font-bold my-4 w-full border border-slate-200 flex justify-center items-center rounded-xl py-12">
            Our Price: ₹{data.price}
          </div>
          <Button
            className="uppercase font-bold py-3 px-6 rounded w-full mb-4"
            size={"lg"}
            asChild
          >
            <Link
              href={{
                pathname: `/inventory/${listingId}/reserve`,
                query: { step: "welcome" },
              }}
            >
              Reserve Now
            </Link>
          </Button>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {features({
              bodyType: data.bodyType,
              fuelType: data.fuelType,
              odoReading: data.odometer,
              seats: data.seats,
              transmissionType: data.transmission,
            }).map(({ id, icon, label }) => (
              <div
                key={id}
                className="bg-gray-100 rounded-lg shadow-xs p-4 text-center flex items-center flex-col"
              >
                {icon}
                <p className="text-sm font-medium mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
