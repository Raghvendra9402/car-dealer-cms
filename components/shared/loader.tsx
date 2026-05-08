import { Loader2 } from "lucide-react";
import { Commet } from "react-loading-indicators";

export function Loader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Loader2 className="animate-spin size-5 text-blue-500" />
    </div>
  );
}
