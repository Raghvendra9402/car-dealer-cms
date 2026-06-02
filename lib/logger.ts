import { Logger } from "pino";

export function getLogger(): Logger {
  if (!globalThis.logger) {
    const pino = require("pino");
    return (globalThis.logger = pino({
      level: process.env.LOG_LEVEL ?? "info",
    }));
  }

  return globalThis.logger;
}
