import { Registry, collectDefaultMetrics } from "prom-client";
import type { Logger } from "pino";

declare global {
  var logger: Logger | undefined;
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

    const pino = (await import("pino")).default;
    const pinoLoki = (await import("pino-loki")).default;

    const transport = pinoLoki({
      host: process.env.LOKI_HOST ?? "http://localhost:3100",
      batching: {
        interval: 5,
      },
      labels: {
        app: process.env.APP_NAME ?? "car-dealer-app",
        env: process.env.NODE_ENV ?? "development",
        namespace: process.env.K8S_NAMESPACE ?? "default",
      },
    });

    const logger = pino({ level: process.env.LOG_LEVEL ?? "info" }, transport);
    globalThis.logger = logger;
  }
}
