import { Suspense } from "react";
import { ResponseContent } from "./response-content";

export function ResponseShowcase() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResponseContent />
    </Suspense>
  );
}
