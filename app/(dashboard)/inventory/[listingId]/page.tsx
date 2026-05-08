import { ListingView } from "@/components/listing/listing-view";
import { requireAuth } from "@/lib/auth-utlis";

interface PageProps {
  params: Promise<{
    listingId: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const { listingId } = await params;
  await requireAuth();
  return <ListingView listingId={listingId} />;
};

export default page;
