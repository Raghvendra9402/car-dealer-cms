"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetReservations } from "@/hooks/useCarListings";

export default function ReservationsPage() {
  const { data: reservations = [] } = useGetReservations();
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>My Reservations</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground">
          Show all reserved cars here.
          {JSON.stringify(reservations, null, 2)}
        </p>
      </CardContent>
    </Card>
  );
}
