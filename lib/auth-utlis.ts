import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import prisma from "./db";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
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

  if (!session) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    redirect("/sign-in");
  }

  if (user.role !== "SELLER") redirect("/");
};
