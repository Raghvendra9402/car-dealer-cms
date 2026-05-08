"use client";

import { MultiStepFormEnum } from "@/config/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { generateDateOptions, generateTimeOptions } from "@/lib/utils";

const selectDateSchema = z.object({
  handoverDate: z.string().min(1, "Handover Date is required"),
  handoverTime: z.string().min(1, "Handover Time is required"),
});

export function SelectDate() {
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof selectDateSchema>>({
    resolver: zodResolver(selectDateSchema),
    mode: "onBlur",
    defaultValues: {
      handoverDate: searchParams.get("handoverDate") || "",
      handoverTime: searchParams.get("handoverTime") || "",
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((r) => setTimeout(r, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", MultiStepFormEnum.WELCOME);
      router.push(url.toString());
    });
  };

  const onSelectDate: SubmitHandler<z.infer<typeof selectDateSchema>> = (
    data,
  ) => {
    startTransition(async () => {
      await new Promise((res) => setTimeout(res, 500));

      const params = new URLSearchParams(searchParams.toString());

      params.set("step", MultiStepFormEnum.SUBMIT_DETAILS);
      params.set("handoverDate", data.handoverDate);
      params.set("handoverTime", data.handoverTime);

      router.push(`?${params.toString()}`);
    });
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto bg-white flex flex-col rounded-b-lg shadow-lg p-6 h-96"
        onSubmit={form.handleSubmit(onSelectDate)}
      >
        <div className="space-y-6 flex-1">
          <FormField
            control={form.control}
            name="handoverDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="handoverDate">Select a Date</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {generateDateOptions().map((date) => (
                        <SelectItem key={date.value} value={date.value}>
                          {date.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handoverTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="handoverTime">Select a Time</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {generateTimeOptions().map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-x-4">
          <Button
            type="button"
            onClick={prevStep}
            disabled={isPrevPending}
            className="uppercase font-bold flex gap-x-3 w-full flex-1"
          >
            {isPrevPending ? (
              <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
            ) : null}{" "}
            Previous Step
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="uppercase font-bold flex gap-x-3 w-full flex-1"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
            ) : null}{" "}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
