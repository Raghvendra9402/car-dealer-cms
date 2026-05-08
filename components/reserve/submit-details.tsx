"use client";

import { MultiStepFormEnum } from "@/config/types";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { formatDate } from "@/lib/utils";
import { useReserveCar } from "@/hooks/useCarListings";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Lastname required"),
  email: z.email("Email is required"),
  mobile: z.string().min(1, "Mobile is required"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type formSchemaType = z.infer<typeof formSchema>;

export function SubmitDetails() {
  const { data: session } = authClient.useSession();
  const reserve = useReserveCar();
  const router = useRouter();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();
  const searchParams = useSearchParams();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
      lastName: "",
      mobile: "",
      terms: false,
    },
  });

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((r) => setTimeout(r, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", MultiStepFormEnum.SELECT_DATE);
      router.push(url.toString());
    });
  };

  const onSubmit = (data: formSchemaType) => {
    startTransition(async () => {
      const valid = await form.trigger();
      if (!valid) return;
      await new Promise((r) => setTimeout(r, 500));

      const handoverDate = searchParams.get("handoverDate");
      const handoverTime = searchParams.get("handoverTime");
      const listingId = params.listingId as string;

      reserve.mutate({
        listingId: listingId,
        mobile: data.mobile,
        reserveDate: formatDate(handoverDate!, handoverTime!),
      });
    });
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto bg-white flex flex-col rounded-b-lg shadow-lg p-6 h-96"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-6 flex-1">
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="firstName">First name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="lastName">Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="mobile">Mobile</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your mobile no." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-center gap-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-0!"
                  >
                    I agree to the terms and condition.
                  </FormLabel>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
            disabled={isPending || reserve.isPending}
            className="uppercase font-bold flex gap-x-3 w-full flex-1"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
            ) : null}{" "}
            Submit Details
          </Button>
        </div>
      </form>
    </Form>
  );
}
