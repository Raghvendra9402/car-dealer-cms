"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ActiveLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ActiveLink({ children, href, className }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Link
      href={href}
      className={cn(
        className,
        isActive
          ? "bg-zinc-500 text-primary-foreground hover:bg-zinc-600"
          : "text-muted hover:bg-white/20"
      )}
    >
      {children}
    </Link>
  );
}
