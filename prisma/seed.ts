import {
  PrismaClient,
  Prisma,
  ModelTransMission,
  ModelFuelType,
  ListingStatus,
} from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding db...");

  // const listings = [
  //   {
  //     carYear: 2020,
  //     carName: "Mahindra Scorpio",
  //     description: "Well maintained, single owner, no accidents",
  //     odometer: 42000,
  //     transmission: ModelTransMission.MANUAL,
  //     fuelType: ModelFuelType.DIESEL,
  //     color: "Jet black",
  //     location: "Delhi",
  //     price: 1150000,
  //     status: ListingStatus.ACTIVE,
  //     images: [
  //       "https://i.pinimg.com/736x/08/3e/ef/083eef7a9381cfe42201117acdf5c2fe.jpg",
  //       "https://images.unsplash.com/photo-1542362567-b07e54358753",
  //     ],
  //   },
  //   {
  //     carYear: 2022,
  //     carName: "Mercedes G-Wagon",
  //     description: "Dream SUV",
  //     odometer: 18000,
  //     transmission: ModelTransMission.AUTOMATIC,
  //     fuelType: ModelFuelType.ELECTRIC,
  //     color: "Black",
  //     location: "Bangalore",
  //     price: 1450000,
  //     status: ListingStatus.ACTIVE,
  //     images: ["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2"],
  //   },
  //   {
  //     carYear: 2018,
  //     carName: "Buggati Chirand",
  //     description: "not a Budget friendly car for sure",
  //     odometer: 65000,
  //     transmission: ModelTransMission.MANUAL,
  //     fuelType: ModelFuelType.PETROL,
  //     color: "Red",
  //     location: "Mumbai",
  //     price: 520000,
  //     status: ListingStatus.SOLD,
  //     images: ["https://images.unsplash.com/photo-1550355291-bbee04a92027"],
  //   },
  // ];

  // for (const car of listings) {
  //   await prisma.carListing.create({
  //     data: {
  //       carYear: car.carYear,
  //       carName: car.carName,
  //       description: car.description,
  //       odometer: car.odometer,
  //       transmission: car.transmission,
  //       fuelType: car.fuelType,
  //       color: car.color,
  //       location: car.location,
  //       price: car.price,
  //       status: car.status,
  //       sellerId: "EgZgPISpemZqrH1RY4ARGZQP3HVIAjXh",
  //       images: {
  //         create: car.images.map((url) => ({
  //           imageUrl: url,
  //         })),
  //       },
  //     },
  //   });
  // }

  await prisma.make.createMany({
    data: [
      { name: "AUDI" },
      { name: "BMW" },
      { name: "FORD" },
      { name: "HONDA" },
      { name: "HUMMER" },
      { name: "HYUNDAI" },
      { name: "KIA" },
      { name: "MAHINDRA" },
      { name: "MERCEDES" },
      { name: "NISSAN" },
      { name: "SUZUKI" },
      // { name: "TATA" },
      { name: "TESLA" },
      { name: "TOYOTA" },
      { name: "VOLKSWAGEN" },
      { name: "BENTLEY" },
    ],
  });

  console.log("✅ Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
