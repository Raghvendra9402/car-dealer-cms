import { Prisma } from "@/lib/generated/prisma/browser";
import {
  BodyType,
  MakeName,
  ModelFuelType,
  ModelTransMission,
} from "@/lib/generated/prisma/enums";
import z from "zod";

export interface Favourites {
  ids: string[];
}

export type SelectItemType = {
  itemName: string;
  itemValue: string;
};

export type FileWithProgress = {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
  imageUrl?: string;
};

export const createListingSchema = z.object({
  makeId: z.string().min(1, "Make is required"),
  modelName: z.string().min(1, "Model name is required"),

  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  tags: z.array(z.string()),
  description: z.string(),
  report: z.string(),
  looks: z.string(),
  odometer: z.number().min(0),
  color: z.string(),
  seats: z.number(),
  bodyType: z.enum(BodyType),
  fuel: z.enum(ModelFuelType),
  transmission: z.enum(ModelTransMission),
  location: z.string().min(1, "Location required"),
  price: z.number().min(100000),
  imageKeys: z.array(z.string()),
});

export const updateListingSchema = z.object({
  listingId: z.string(),
  makeId: z.string().min(1, "Make is required"),
  modelName: z.string().min(1, "Model name is required"),
  year: z.number(),
  tags: z.array(z.string()),
  description: z.string(),
  // report: z.string(),
  // looks: z.string(),
  odometer: z.number(),
  color: z.string(),
  seats: z.number(),
  bodyType: z.enum(BodyType),
  fuel: z.enum(ModelFuelType),
  transmission: z.enum(ModelTransMission),
  location: z.string(),
  price: z.number(),
  imageKeys: z.array(z.string()),
});

export const MultiStepFormEnum = {
  WELCOME: "welcome",
  SELECT_DATE: "select-date",
  SUBMIT_DETAILS: "submit-details",
} as const;

type CarListingWithImage = Prisma.CarListingGetPayload<{
  include: {
    images: true;
    make: true;
  };
}>;

export type CarListingWithSignedUrls = Omit<CarListingWithImage, "images"> & {
  images: (CarListingWithImage["images"][number] & { signedUrl: string })[];
};

export interface Plan {
  id: number;
  name: string;
  priceId: string;
  limits: any;
  features: string[];
  price: number;
}
