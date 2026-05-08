import "server-only";
import { PAGINATION } from "@/config/constant";
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import {
  BodyType,
  ModelFuelType,
  ModelTransMission,
} from "@/lib/generated/prisma/client";

export const listingParamsServer = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({ clearOnDefault: true }),
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  makeId: parseAsString.withOptions({ clearOnDefault: true }),
  modelId: parseAsString.withOptions({ clearOnDefault: true }),
  transmission: parseAsStringEnum<ModelTransMission>(
    Object.values(ModelTransMission),
  ).withOptions({ clearOnDefault: true }),
  fuel: parseAsStringEnum<ModelFuelType>(
    Object.values(ModelFuelType),
  ).withOptions({ clearOnDefault: true }),
  body: parseAsStringEnum<BodyType>(Object.values(BodyType)).withOptions({
    clearOnDefault: true,
  }),
  minPrice: parseAsInteger.withOptions({ clearOnDefault: true }),
  maxPrice: parseAsInteger.withOptions({ clearOnDefault: true }),
};
