"use client";

import { authClient } from "@/lib/auth-client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountPage() {
  const { data: session } = authClient.useSession();

  console.log(session);

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{session?.user.name}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{session?.user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
