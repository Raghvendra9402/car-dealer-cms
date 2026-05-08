"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };
  return (
    <Button onClick={handleLogout}>
      <LogOutIcon />
      Logout
    </Button>
  );
}
