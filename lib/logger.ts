export function getLogger() {
  if (!globalThis.logger) {
    throw new Error(
      "Logger not initialized — ensure instrumentation.ts has run",
    );
  }

  return globalThis.logger;
}
