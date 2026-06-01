import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import {
  activeRequestsGauge,
  requestCounter,
  trpcRequestsDurationHistogram,
} from "@/lib/metrics";
const handler = async (req: Request) => {
  const start = performance.now();
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname.split("/api/trpc/")[1] || "unknown";
  let statusCode = "500";

  activeRequestsGauge.inc({ method });

  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: createTRPCContext,
    });

    statusCode = response.status.toString();
    return response;
  } finally {
    const duration = (performance.now() - start) / 1000;

    try {
      requestCounter.inc({ method, route: path, status_code: statusCode });
      trpcRequestsDurationHistogram.observe({ method, route: path }, duration);
      activeRequestsGauge.dec({ method });
    } catch (e) {
      console.error("Metrics observe failed:", e);
    }
  }
};

export { handler as GET, handler as POST };
