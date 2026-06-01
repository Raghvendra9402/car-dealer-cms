"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateSubscriber } from "@/hooks/useCarListings";

const formSchema = z.object({
  email: z.string().email("Email required to subscribe"),
});

type formType = z.infer<typeof formSchema>;

export function NewsLetterForm() {
  const createSubscriber = useCreateSubscriber();
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: formType) => {
    createSubscriber.mutate(data);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-primary">
        Subscribe to our inventory updates
      </h3>
      <p className="text-gray-700">Enter your email to receive new updates.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={createSubscriber.isPending}
          >
            Subscribe
          </Button>
        </form>
      </Form>
    </div>
  );
}
