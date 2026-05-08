"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItemType } from "@/config/types";
import { useListingParams } from "@/hooks/use-listing-params";
import { useSuspenseListing } from "@/hooks/useCarListings";
import {
  BodyType,
  MakeName,
  ModelFuelType,
  ModelTransMission,
} from "@/lib/generated/prisma/enums";

interface SelectTypeProps {
  placeholder: string;
  label: string;
  items: SelectItemType[];
  type: "transmission" | "fuel" | "bodyType" | "make" | "model";
  disabled?: boolean;
}

export function SelectType({
  placeholder,
  label,
  items,
  type,
  disabled,
}: SelectTypeProps) {
  const [params, setParams] = useListingParams();
  const onChange = (val: string) => {
    const value = val === "ALL" ? null : val;

    setParams({
      ...params,
      page: 1,
      ...(type === "transmission" && {
        transmission: value as ModelTransMission | null,
      }),
      ...(type === "fuel" && {
        fuel: value as ModelFuelType | null,
      }),
      ...(type === "bodyType" && {
        body: value as BodyType | null,
      }),
      ...(type === "make" && {
        makeId: value,
      }),
      ...(type === "model" && {
        modelId: value,
      }),
    });
  };
  return (
    <>
      <h1 className="text-[15px] font-medium text-zinc-600 mb-0 pl-2">
        {label}
      </h1>
      <Select
        value={
          type === "transmission"
            ? (params.transmission ?? "ALL")
            : type === "fuel"
              ? (params.fuel ?? "ALL")
              : type === "bodyType"
                ? (params.body ?? "ALL")
                : type === "make"
                  ? (params.makeId ?? "ALL")
                  : (params.modelId ?? "ALL")
        }
        onValueChange={(val) => onChange(val)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full h-11 text-base font-medium">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items?.map((item, idx) => (
            <SelectItem
              value={item.itemValue}
              key={idx}
              className="text-base font-normal"
            >
              {item.itemName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
