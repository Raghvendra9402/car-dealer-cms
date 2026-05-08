"use client";

import { useGetDashboardStats } from "@/hooks/useCarListings";

const page = () => {
  const { data } = useGetDashboardStats();
  return (
    <div>
      Dashboard
      {JSON.stringify(data, null, 2)}
    </div>
  );
};

export default page;
