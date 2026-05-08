import { ReserveForm } from "@/components/reserve/reserve-form";

interface ReservePageProps {
  params: Promise<{
    listingId: string;
  }>;
  searchParams: Promise<{
    step: string;
  }>;
}

export default async function ReservePage({
  params,
  searchParams,
}: ReservePageProps) {
  const { listingId } = await params;
  const { step } = await searchParams;
  console.log("Step: ", step);
  return (
    <>
      <ReserveForm listingId={listingId} step={step} />
    </>
  );
}
