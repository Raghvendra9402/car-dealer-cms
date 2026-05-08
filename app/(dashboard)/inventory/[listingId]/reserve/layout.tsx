import { FormHeader } from "@/components/reserve/reserve-form-header";
import { Suspense } from "react";

export default function ReserveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <main className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
        <FormHeader />
        {children}
      </main>
    </Suspense>
  );
}
