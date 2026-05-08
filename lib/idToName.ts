import prisma from "./db";

export async function changeIdToName(id: string) {
  const make = await prisma.make.findUnique({
    where: { id },
  });

  if (!make) {
    throw new Error("Make not found");
  }

  return make.name;
}
