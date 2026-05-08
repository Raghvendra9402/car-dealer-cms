"use client";
import { Slider } from "@/components/ui/slider";
import { PAGINATION } from "@/config/constant";
import { useListingParams } from "@/hooks/use-listing-params";
import { useEffect, useState } from "react";

interface RangeFilterProps {
  minLimit: number;
  maxLimit: number;
  type: "price" | "odometer";
  label: string;
}

function formatPrice(value: number) {
  return value % 1 === 0 ? `${value}L` : `${value.toFixed(1)}L`;
}

function formatOdometer(value: number) {
  return `${value.toLocaleString("en-IN")} km`;
}

export function RangeFilter({
  minLimit,
  maxLimit,
  type,
  label,
}: RangeFilterProps) {
  const [range, setRange] = useState<number[]>([minLimit, maxLimit]);
  const [params, setParams] = useListingParams();

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">
          {type === "price" ? (
            <>
              ₹{formatPrice(range[0])} – ₹{formatPrice(range[1])}+
            </>
          ) : (
            <>
              {formatOdometer(range[0])} – {formatOdometer(range[1])}+
            </>
          )}
        </p>
      </div>

      <Slider
        value={range}
        min={minLimit}
        max={maxLimit}
        step={type === "price" ? 1 : 1000}
        onValueChange={setRange}
        onValueCommit={(val) => {
          if (type === "price") {
            setParams({
              ...params,
              minPrice: val[0] * 100000,
              maxPrice: val[1] * 100000,
              page: PAGINATION.DEFAULT_PAGE,
            });
          }
        }}
      />
    </div>
  );
}
