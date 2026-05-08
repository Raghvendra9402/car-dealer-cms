import { ListingImage } from "@/lib/generated/prisma/client";
import {
  ListingStatus,
  ModelFuelType,
  ModelTransMission,
} from "@/lib/generated/prisma/enums";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Badge } from "../ui/badge";
import {
  CogIcon,
  FuelIcon,
  GaugeCircleIcon,
  GaugeIcon,
  Heart,
  MapPinIcon,
  PaintbrushVerticalIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { FavouritesButton } from "../shared/favourites-button";

type ListingSignedUrlImage = {
  signedUrl: string;
};

interface CardCardProps {
  id: string;
  name: string;
  color: string;
  status: ListingStatus;
  year: number;
  description?: string;
  reading: number;
  transmission: ModelTransMission;
  fuel: ModelFuelType;
  location: string;
  price: number;
  images: ListingSignedUrlImage[];
}

const formatTransmission = (transmission: ModelTransMission) => {
  const transmissionMap: Record<ModelTransMission, string> = {
    AUTOMATIC: "Automatic",
    MANUAL: "Manual",
    AMT: "AMT",
    CVT: "CVT",
    DCT: "DCT",
  };

  return transmissionMap[transmission];
};

const formatFuelType = (fuel: ModelFuelType) => {
  switch (fuel) {
    case ModelFuelType.DIESEL:
      return "Diesel";
    case ModelFuelType.ELECTRIC:
      return "Electric";
    case ModelFuelType.HYBRID:
      return "Hybrid";
    case ModelFuelType.PETROL:
      return "Petrol";
    case ModelFuelType.CNG:
      return "CNG";

    default:
      return fuel;
  }
};

const additionalInfo = ({
  reading,
  transmission,
  fuel,
  color,
}: {
  reading: number;
  transmission: ModelTransMission;
  fuel: ModelFuelType;
  color: string;
}) => {
  return [
    {
      id: "odometer",
      icon: <GaugeCircleIcon className="size-4" />,
      value: `${reading} km`,
    },
    {
      id: "transmission",
      icon: <CogIcon className="size-4" />,
      value: `${formatTransmission(transmission)}`,
    },
    {
      id: "fuel",
      icon: <FuelIcon className="size-4" />,
      value: `${formatFuelType(fuel)}`,
    },
    {
      id: "color",
      icon: <PaintbrushVerticalIcon className="size-4" />,
      value: `${color}`,
    },
  ];
};

export function CarCard({
  id,
  color,
  fuel,
  images,
  location,
  name,
  price,
  reading,
  status,
  transmission,
  year,
  description,
}: CardCardProps) {
  const information = additionalInfo({ reading, fuel, transmission, color });
  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="aspect-4/3 relative overflow-hidden">
          <Image
            src={images[0].signedUrl}
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Badge
              variant={status === "SOLD" ? "destructive" : "default"}
              className="text-xs shadow-md"
            >
              {status}
            </Badge>
          </div>
          <FavouritesButton listingId={id} />
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold leading-tight line-clamp-1">
            {year} {name}
          </CardTitle>
          <div className="flex items-center text-xs text-slate-500 gap-1">
            <MapPinIcon className="h-3 w-3 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-600">
          {information.map((info) => (
            <div className="flex items-center gap-1.5 min-w-0" key={info.id}>
              {info.icon}
              <span className="truncate">{info.value}</span>
            </div>
          ))}
        </div>

        {/* <div className="pt-1">
          <p className="text-lg font-bold text-slate-900">
            ₹{price.toLocaleString()}
          </p>
        </div> */}
      </CardContent>

      <CardFooter className="p-3 pt-0 flex flex-col gap-2">
        <Button variant="outline" className="w-full">
          Reserve
        </Button>
        <Button asChild className="w-full">
          <Link href={`/inventory/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
