"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const sidebarItems = [
  {
    title: "Account",
    href: "/profile/account",
    icon: User,
  },
  {
    title: "Reservations",
    href: "/profile/reservations",
    icon: CalendarDays,
  },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
        <Card className="h-fit w-72 rounded-2xl p-4 shadow-sm">
          <div className="mb-6 flex items-center gap-3 border-b pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <LayoutDashboard className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">My Profile</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;

              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </Card>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
