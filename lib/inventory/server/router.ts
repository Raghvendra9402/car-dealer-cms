import { z } from "zod";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/db";
import { authClient } from "@/lib/auth-client";
import { getSourceId, setSourceId } from "@/lib/source-id";
import {
  createListingSchema,
  Favourites,
  updateListingSchema,
} from "@/config/types";
import { getRedis } from "@/lib/redis-store";
import { PAGINATION } from "@/config/constant";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  BodyType,
  ListingStatus,
  MakeName,
  ModelFuelType,
  ModelTransMission,
  Role,
} from "@/lib/generated/prisma/enums";
import { TRPCError } from "@trpc/server";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { bucketName, getS3Client } from "@/lib/s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { moveImages } from "@/lib/move-images";
import { getImageUrl } from "@/lib/get-image-url";

export const carListingRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
        makeId: z.string().optional(),
        modelId: z.string().optional(),
        transmission: z.nativeEnum(ModelTransMission).optional(),
        fuel: z.nativeEnum(ModelFuelType).optional(),
        body: z.nativeEnum(BodyType).optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const {
        page,
        pageSize,
        search,
        makeId,
        modelId,
        transmission,
        fuel,
        body,
        minPrice,
        maxPrice,
      } = input;
      const [items, totalCount] = await Promise.all([
        prisma.carListing.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            carName: {
              contains: search,
              mode: "insensitive",
            },
            makeId,
            modelId,
            ...(transmission && { transmission }),
            bodyType: body,
            fuelType: fuel,
            price: {
              gte: minPrice,
              lte: maxPrice,
            },
          },
          include: {
            images: true,
            make: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.carListing.count(),
      ]);

      const itemsWithSignedUrls = await Promise.all(
        items.map(async (item) => {
          const imagesWithUrls = await Promise.all(
            item.images.map(async (image) => ({
              ...image,
              signedUrl: await getImageUrl(image.imageUrl, 600),
            })),
          );

          return {
            ...item,
            images: imagesWithUrls,
          };
        }),
      );

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items: itemsWithSignedUrls,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
  addFavourite: baseProcedure
    .input(
      z.object({
        listingId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (session?.user) {
        const existing = await prisma.favourites.findUnique({
          where: {
            listingId_userId: {
              listingId: input.listingId,
              userId: session!.user.id,
            },
          },
        });

        if (existing) {
          await prisma.favourites.delete({
            where: {
              id: existing.id,
            },
          });

          return {
            action: "removed",
            status: 200,
          };
        } else {
          await prisma.favourites.create({
            data: {
              userId: session!.user.id,
              listingId: input.listingId,
            },
          });
        }

        return { action: "added", status: 200 };
      }

      const sourceId = await setSourceId();
      const key = `favourites:${sourceId}`;

      const stored = await getRedis().get<Favourites>(key);
      const favourites: Favourites = stored ?? { ids: [] };

      const wasFavourite = favourites.ids.includes(input.listingId);
      if (wasFavourite) {
        favourites.ids = favourites.ids.filter((id) => id !== input.listingId);
      } else {
        favourites.ids.push(input.listingId);
      }

      await getRedis().set(key, favourites, {
        ex: 60 * 60 * 24 * 30, // 30 days
      });

      return {
        ids: favourites.ids,
        status: 200,
        action: wasFavourite ? "removed" : "added",
      };
    }),
  getFavourites: baseProcedure.query(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session?.user) {
      const favourites = await prisma.favourites.findMany({
        where: {
          userId: session!.user.id,
        },
        select: { listingId: true },
      });

      return { ids: favourites.map((fav) => fav.listingId) };
    }

    const sourceId = await getSourceId();
    const key = `favourites:${sourceId}`;
    const redisData = await getRedis().get<Favourites>(key);
    return redisData ?? { ids: [] };
  }),
  getFavouriteListings: baseProcedure.query(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    let ids: string[] = [];
    if (session?.user) {
      const favourites = await prisma.favourites.findMany({
        where: {
          userId: session!.user.id,
        },
        select: { listingId: true },
      });

      ids = favourites.map((fav) => fav.listingId);
    } else {
      const sourceId = await getSourceId();
      const key = `favourites:${sourceId}`;
      const redisData = await getRedis().get<Favourites>(key);
      ids = redisData?.ids ?? [];
    }

    if (ids.length === 0) return [];

    const listings = await prisma.carListing.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        images: true,
      },
    });

    const itemsWithSignedUrls = await Promise.all(
      listings.map(async (item) => {
        const imagesWithUrls = await Promise.all(
          item.images.map(async (image) => ({
            ...image,
            signedUrl: await getImageUrl(image.imageUrl, 600),
          })),
        );

        return {
          ...item,
          images: imagesWithUrls,
        };
      }),
    );

    return itemsWithSignedUrls;
  }),
  getOne: baseProcedure
    .input(z.object({ listingId: z.string() }))
    .query(async ({ input }) => {
      const listing = await prisma.carListing.findUnique({
        where: { id: input.listingId },
        include: { images: true, make: true },
      });

      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Listing not found",
        });
      }

      const imagesWithUrls = await Promise.all(
        listing.images.map(async (image) => ({
          ...image,
          signedUrl: await getImageUrl(image.imageUrl, 600),
        })),
      );

      return {
        ...listing,
        images: imagesWithUrls,
      };
    }),
  getMakes: baseProcedure.query(async () => {
    return prisma.make.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  getModels: baseProcedure
    .input(
      z.object({
        makeId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return prisma.model.findMany({
        where: {
          makeId: input.makeId,
        },
      });
    }),

  reserverCar: protectedProcedure
    .input(
      z.object({
        listingId: z.string(),
        reserveDate: z.date(),
        mobile: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { listingId, mobile, reserveDate } = input;
      const listing = await prisma.carListing.findUnique({
        where: {
          id: listingId,
        },
        select: {
          id: true,
          status: true,
          sellerId: true,
        },
      });

      if (!listing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Listing not found",
        });
      }
      if (listing.status === "SOLD") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This car is already sold",
        });
      }

      const existingReservation = await prisma.reservation.findFirst({
        where: {
          listingId,
          visitDate: reserveDate,
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
      });

      if (existingReservation) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This slot is already booked",
        });
      }

      const alreadyReserved = await prisma.reservation.findFirst({
        where: {
          listingId,
          customerId: ctx.auth.user.id,
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
      });

      if (alreadyReserved) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have a reservation for this car",
        });
      }

      return await prisma.reservation.create({
        data: {
          listingId,
          customerId: ctx.auth.user.id,
          mobile,
          visitDate: reserveDate,
        },
      });
    }),

  getReservations: protectedProcedure.query(async ({ ctx }) => {
    return prisma.reservation.findMany({
      where: {
        customerId: ctx.auth.user.id,
      },
    });
  }),
});

export const adminRouter = createTRPCRouter({
  dashboardStats: adminProcedure.query(async () => {
    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    const endOfThisMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));

    const [
      carsSoldThisMonth,
      carsSoldLastMonth,
      newCustomersThisMonth,
      newCustomersLastMonth,
    ] = await Promise.all([
      prisma.carListing.count({
        where: {
          status: ListingStatus.SOLD,
          updatedAt: {
            gte: startOfThisMonth,
            lte: endOfThisMonth,
          },
        },
      }),
      prisma.carListing.count({
        where: {
          status: ListingStatus.SOLD,
          updatedAt: {
            gte: startOfLastMonth,
            lt: startOfThisMonth,
          },
        },
      }),
      prisma.user.count({
        where: {
          role: Role.BUYER,
          updatedAt: {
            gte: startOfThisMonth,
            lte: endOfThisMonth,
          },
        },
      }),
      prisma.user.count({
        where: {
          role: Role.BUYER,
          updatedAt: {
            gte: startOfLastMonth,
            lt: startOfThisMonth,
          },
        },
      }),
    ]);

    return {
      carsSoldThisMonth,
      carsSoldLastMonth,
      newCustomersThisMonth,
      newCustomersLastMonth,
    };
  }),
  createListing: adminProcedure
    .input(
      z.object({
        modelName: z.string().min(1, "Model name is required"),
        makeId: z.string(),
        year: z
          .number()
          .min(1900)
          .max(new Date().getFullYear() + 1),
        tags: z.array(z.string()),
        description: z.string(),
        seats: z.number(),
        bodyType: z.nativeEnum(BodyType),
        report: z.string(),
        looks: z.string(),
        odometer: z.number().min(0),
        color: z.string(),
        fuel: z.nativeEnum(ModelFuelType),
        transmission: z.nativeEnum(ModelTransMission),
        location: z.string().min(1, "Location required"),
        price: z.number().min(100000),
        imageKeys: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        color,
        description,
        fuel,
        looks,
        makeId,
        modelName,
        odometer,
        report,
        tags,
        transmission,
        year,
        location,
        price,
        imageKeys,
        bodyType,
        seats,
      } = input;
      const listing = await prisma.$transaction(async (tx) => {
        // Create the listing
        const normalizedModelName = modelName.trim().toLowerCase();

        const model = await tx.model.upsert({
          where: {
            name_makeId: {
              name: normalizedModelName,
              makeId,
            },
          },
          update: {},
          create: {
            name: normalizedModelName,
            makeId,
          },
        });

        const newListing = await tx.carListing.create({
          data: {
            carName: modelName,
            carYear: year,
            makeId: makeId,
            modelId: model.id,
            color: color,
            tags: tags,
            fuelType: fuel,
            odometer: odometer,
            transmission: transmission,
            description: description,
            sellerId: ctx.auth.user.id,
            location: location,
            price,
            seats,
            bodyType,
          },
        });

        // Move images
        const finalKeys = await moveImages({
          listingId: newListing.id,
          keys: imageKeys,
        });

        // Create image records
        await tx.listingImage.createMany({
          data: finalKeys.map((url) => ({
            imageUrl: url,
            listingId: newListing.id,
          })),
        });

        // Fetch the complete listing with images
        return tx.carListing.findUnique({
          where: { id: newListing.id },
          include: { images: true },
        });
      });

      return listing;
    }),
  updateListing: adminProcedure
    .input(updateListingSchema)
    .mutation(async ({ ctx, input }) => {
      await prisma.$transaction(async (tx) => {
        await tx.carListing.update({
          where: {
            id: input.listingId,
          },
          data: {},
        });
        // Move images
        const finalKeys = await moveImages({
          listingId: input.listingId,
          keys: input.imageKeys,
        });

        // Create image records
        await tx.listingImage.createMany({
          data: finalKeys.map((url) => ({
            imageUrl: url,
            listingId: input.listingId,
          })),
        });

        // Fetch the complete listing with images
        return tx.carListing.findUnique({
          where: { id: input.listingId },
          include: { images: true },
        });
      });
    }),
});

export const s3Router = createTRPCRouter({
  putImage: adminProcedure
    .input(
      z.object({
        fileName: z.string(),
        file: z.string(),
        fileType: z.string(),
        draftId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.file, "base64");

      const key = `temp/uploads/${input.draftId}/${input.fileName}`;

      const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: input.fileType,
      });

      await getS3Client().send(putCommand);

      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(getS3Client(), getCommand, {
        expiresIn: 600,
      });

      return {
        key: key,
        url: signedUrl,
      };
    }),
});

export const aiRouter = createTRPCRouter({
  getResponse: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return prisma.aIResponse.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
});
