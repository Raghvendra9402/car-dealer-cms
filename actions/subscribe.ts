"use server";

import prisma from "@/lib/db";
import { PrismaClientValidationError } from "@/lib/generated/prisma/internal/prismaNamespace";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { z } from "zod";

const SubscribeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export const subscribeAction = async (_: any, formData: FormData) => {
  try {
    const { data, success, error } = SubscribeSchema.safeParse({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
    });

    if (!success) {
      return {
        success: false,
        message: error.message,
      };
    }

    const subscriber = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (subscriber) {
      return {
        success: false,
        message: "Already subscribed!",
      };
    }

    await prisma.user.create({
      data: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: "BUYER",
      },
    });

    return {
      success: true,
      message: "subscribed successfully",
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return {
        success: false,
        message: error.message,
      };
    }
    if (error instanceof PrismaClientValidationError) {
      return {
        success: false,
        message: error.message,
      };
    }
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
