"use client";

import { MultiStepFormEnum } from "@/config/types";
import { useGetOneListing } from "@/hooks/useCarListings";
import { notFound } from "next/navigation";
import z from "zod";
import { Welcome } from "./welcome";
import { SelectDate } from "./select-date";
import { SubmitDetails } from "./submit-details";

interface ReserveFormProps {
  listingId: string;
  step: string;
}

const MultiStepFormSchema = z.object({
  step: z.enum([
    MultiStepFormEnum.WELCOME,
    MultiStepFormEnum.SELECT_DATE,
    MultiStepFormEnum.SUBMIT_DETAILS,
  ]),
  listingId: z.string(),
});

const MAP_STEP_TO_COMPONENT = {
  [MultiStepFormEnum.WELCOME]: Welcome,
  [MultiStepFormEnum.SELECT_DATE]: SelectDate,
  [MultiStepFormEnum.SUBMIT_DETAILS]: SubmitDetails,
};

export function ReserveForm({ listingId, step }: ReserveFormProps) {
  const parsed = MultiStepFormSchema.safeParse({
    listingId,
    step,
  });

  if (!parsed.success) {
    notFound();
  }

  const { data } = parsed;
  const { data: listing, error } = useGetOneListing(listingId);

  if (error) notFound();

  const Component = MAP_STEP_TO_COMPONENT[data.step];

  return <Component listingId={listingId} step={step} data={listing} />;
}
