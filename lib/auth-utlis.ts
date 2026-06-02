import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import prisma from "./db";
import { getLogger } from "./logger";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const logger = getLogger();

  if (!session) {
    logger.warn(
      {
        route: "/dashboard",
      },
      "Unauthenticated access attempt",
    );
    redirect("/sign-in");
  }

  return session;
};

export const requireUnAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }
};

export const requireAdminAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const logger = getLogger();

  if (!session) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    logger.error(
      {
        sessionUserId: session.user.id,
      },
      "Authenticated session user missing in database",
    );
    redirect("/sign-in");
  }

  if (user.role !== "SELLER") {
    logger.warn(
      {
        userId: user.id,
        role: user.role,
      },
      "Non-admin attempted admin access",
    );
    redirect("/");
  }
};
