"use client";

import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export const FormHeader = () => {
  const params = useSearchParams();
  const steps = [
    { id: "welcome", title: "1" },
    { id: "select-date", title: "2" },
    { id: "submit-details", title: "3" },
  ];

  return (
    <div className="flex justify-between bg-primary p-4 shadow-lg">
      <div className="flex flex-col justify-between flex-1">
        <h1 className="text-3xl font-bold text-white">
          {steps.find(({ id }) => params.get("step") === id)?.title}
        </h1>
      </div>
      <div className="flex items-center justify-end gap-2 text-sm font-medium text-muted-foreground flex-1">
        {steps.map((step) => (
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              params.get("step") === step.id
                ? "bg-white text-muted-foreground"
                : "bg-primary text-primary-foreground",
            )}
            key={step.id}
          >
            {step.title}
          </div>
        ))}
      </div>
    </div>
  );
};
