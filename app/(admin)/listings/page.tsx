import { ListingDialog } from "@/components/listing/listing-dialog";
import { columns } from "@/components/shared/data-table/columns";
import { DataTable } from "@/components/shared/data-table/data-table";
import prisma from "@/lib/db";

const page = async () => {
  const listings = await prisma.carListing.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      make: true,
    },
  });
  return (
    <div className="p-2 flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-white font-semibold">All Car Listings</h1>
        <ListingDialog />
      </div>
      <div>
        <DataTable columns={columns} data={listings} />
      </div>
    </div>
  );
};

export default page;
