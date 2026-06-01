import client from "prom-client";

function getRegistry() {
  if (!globalThis.metrics?.registry) {
    const registry = new client.Registry();

    client.collectDefaultMetrics({ register: registry });
    globalThis.metrics = { registry };
  }

  return globalThis.metrics.registry;
}

const registry = getRegistry();

export const requestCounter = new client.Counter({
  name: "trpc_requests_total",
  help: "Total number of trpc requests",
  labelNames: ["method", "route", "status_code"],
  registers: [registry],
});

export const activeRequestsGauge = new client.Gauge({
  name: "total_active_requests",
  help: "Total active requests",
  labelNames: ["method"],
  registers: [registry],
});

export const trpcRequestsDurationHistogram = new client.Histogram({
  name: "trpc_requests_duration_ms",
  help: "Duration of the trpc requests in ms",
  labelNames: ["method", "route"],
  buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000],
  registers: [registry],
});
