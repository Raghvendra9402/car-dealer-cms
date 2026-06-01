import { Registry, collectDefaultMetrics } from "prom-client";

declare global {
  var metrics:
    | {
        registry: Registry;
      }
    | undefined;
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("Initializing registry....");
    const prometheusRegistry = new Registry();
    collectDefaultMetrics({
      register: prometheusRegistry,
    });
    globalThis.metrics = {
      registry: prometheusRegistry,
    };
  }
}
