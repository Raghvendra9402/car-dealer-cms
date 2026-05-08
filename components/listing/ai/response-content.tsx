"use client";

import { useAIState } from "@/hooks/use-ai-state";
import { useGetAIResponse } from "@/hooks/useCarListings";
import { Loader } from "lucide-react";
import { ResponseForm } from "./response-form";
import { toast } from "sonner";

export function ResponseContent() {
  const { draftId } = useAIState();
  console.log("response draft id: ", draftId);

  const { data } = useGetAIResponse(draftId);

  console.log("AI Data: ", data);

  if (!data || data.status === "PENDING") {
    return (
      <div className="h-full flex items-center justify-center gap-2">
        <Loader className="animate-spin" />
        <span>Generating AI response...</span>
      </div>
    );
  }

  if (data.status === "ERROR") {
    toast.error("Something went wrong with AI response. Try Again!");
  }

  return (
    <div>
      <ResponseForm result={data.result} />
    </div>
  );
}
