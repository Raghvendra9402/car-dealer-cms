import { createLoader } from "nuqs/server";
import { listingParams } from "./params";
import { listingParamsServer } from "./params.server";

export const listingParamsLoader = createLoader(listingParamsServer);
