import {
  adminRouter,
  aiRouter,
  carListingRouter,
  s3Router,
} from "@/lib/inventory/server/router";
import { createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  carListing: carListingRouter,
  admin: adminRouter,
  ai: aiRouter,
  s3: s3Router,
});
// export type definition of API
export type AppRouter = typeof appRouter;
