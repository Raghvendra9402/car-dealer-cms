import {
  BodyType,
  MakeName,
  ModelFuelType,
  ModelTransMission,
} from "@/lib/generated/prisma/enums";
import { SelectItemType } from "./types";

export const transmissionSelect: SelectItemType[] = [
  {
    itemName: "All",
    itemValue: "ALL",
  },
  {
    itemName: "Manual",
    itemValue: ModelTransMission.MANUAL,
  },
  {
    itemName: "AMT",
    itemValue: ModelTransMission.AMT,
  },
  {
    itemName: "CVT",
    itemValue: ModelTransMission.CVT,
  },
  {
    itemName: "DCT",
    itemValue: ModelTransMission.DCT,
  },
];
export const fuelSelect: SelectItemType[] = [
  {
    itemName: "All",
    itemValue: "ALL",
  },
  {
    itemName: "Petrol",
    itemValue: ModelFuelType.PETROL,
  },
  {
    itemName: "Diesel",
    itemValue: ModelFuelType.DIESEL,
  },
  {
    itemName: "Electric",
    itemValue: ModelFuelType.ELECTRIC,
  },
  {
    itemName: "CNG",
    itemValue: ModelFuelType.CNG,
  },
  {
    itemName: "Hybrid",
    itemValue: ModelFuelType.HYBRID,
  },
];

export const bodyTypeSelect: SelectItemType[] = [
  {
    itemName: "All",
    itemValue: "ALL",
  },
  {
    itemName: "Convertible",
    itemValue: BodyType.CONVERTIBLE,
  },
  {
    itemName: "Coupe",
    itemValue: BodyType.COUPE,
  },
  {
    itemName: "Crossover",
    itemValue: BodyType.CROSSOVER,
  },
  {
    itemName: "Hatchback",
    itemValue: BodyType.HATCHBACK,
  },
  {
    itemName: "Minivan",
    itemValue: BodyType.MINIVAN,
  },
  {
    itemName: "Off-Road",
    itemValue: BodyType.OFF_ROAD,
  },
  {
    itemName: "Pickup",
    itemValue: BodyType.PICKUP,
  },
  {
    itemName: "Roadster",
    itemValue: BodyType.ROADSTER,
  },
  {
    itemName: "Sedan",
    itemValue: BodyType.SEDAN,
  },
  {
    itemName: "Sports",
    itemValue: BodyType.SPORTS_CAR,
  },
  {
    itemName: "SUV",
    itemValue: BodyType.SUV,
  },
  {
    itemName: "Van",
    itemValue: BodyType.VAN,
  },
  {
    itemName: "Wagon",
    itemValue: BodyType.WAGON,
  },
];

export const makeSelect: SelectItemType[] = [
  {
    itemName: "All",
    itemValue: "ALL",
  },
  {
    itemName: "Audi",
    itemValue: MakeName.AUDI,
  },
  {
    itemName: "BMW",
    itemValue: MakeName.BMW,
  },
  {
    itemName: "Ford",
    itemValue: MakeName.FORD,
  },
  {
    itemName: "Honda",
    itemValue: MakeName.HONDA,
  },
  {
    itemName: "Hummer",
    itemValue: MakeName.HUMMER,
  },
  {
    itemName: "Hyundai",
    itemValue: MakeName.HYUNDAI,
  },
  {
    itemName: "Kia",
    itemValue: MakeName.KIA,
  },
  {
    itemName: "Mahindra",
    itemValue: MakeName.MAHINDRA,
  },
  {
    itemName: "Mercedes",
    itemValue: MakeName.MERCEDES,
  },
  {
    itemName: "Nissan",
    itemValue: MakeName.NISSAN,
  },
  {
    itemName: "Suzuki",
    itemValue: MakeName.SUZUKI,
  },
  {
    itemName: "Tata",
    itemValue: MakeName.TATA,
  },
  {
    itemName: "Tesla",
    itemValue: MakeName.TESLA,
  },
  {
    itemName: "Toyota",
    itemValue: MakeName.TOYOTA,
  },
  {
    itemName: "Volkswagen",
    itemValue: MakeName.VOLKSWAGEN,
  },
];
