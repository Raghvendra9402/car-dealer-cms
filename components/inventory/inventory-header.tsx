"use client";

import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";

export function Header() {
  const pathname = usePathname();
  return (
    <div className="flex justify-between px-4 md:px-10 py-4">
      <Link href={"/"}>
        <Image
          src={"/logo.svg"}
          alt="RS MOTORS"
          width={35}
          height={35}
          className="md:hidden"
        />
        <Image
          src={"/logo-title.svg"}
          alt="RS MOTORS"
          width={180}
          height={180}
          className="hidden md:block"
        />
      </Link>
      <div className="hidden md:flex items-center gap-x-6">
        <Link href={"/"}>
          <h2
            className={cn(
              "text-zinc-700 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-zinc-700 after:transition-all after:duration-300 after:ease-in-out",
              pathname === "/"
                ? "after:w-full after:bg-linear-to-r after:from-zinc-600 after:to-zinc-800 font-medium"
                : "after:w-0 hover:after:w-full",
            )}
          >
            HOME
          </h2>
        </Link>
        <Link href={"/inventory"}>
          <h2
            className={cn(
              "text-zinc-700 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-zinc-700 after:transition-all after:duration-300 after:ease-in-out",
              pathname.includes("/inventory")
                ? "after:w-full after:bg-linear-to-r after:from-zinc-600 after:to-zinc-800 font-medium"
                : "after:w-0 hover:after:w-full",
            )}
          >
            INVENTORY
          </h2>
        </Link>
        <Link href={"/favourites"}>
          <h2
            className={cn(
              "text-zinc-700 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-zinc-700 after:transition-all after:duration-300 after:ease-in-out",
              pathname.includes("/favourites")
                ? "after:w-full after:bg-linear-to-r after:from-zinc-600 after:to-zinc-800 font-medium"
                : "after:w-0 hover:after:w-full",
            )}
          >
            FAVOURITES
          </h2>
        </Link>
        <Link href={"/profile"}>
          <h2
            className={cn(
              "text-zinc-700 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-zinc-700 after:transition-all after:duration-300 after:ease-in-out",
              pathname.includes("/profile")
                ? "after:w-full after:bg-linear-to-r after:from-zinc-600 after:to-zinc-800 font-medium"
                : "after:w-0 hover:after:w-full",
            )}
          >
            PROFILE
          </h2>
        </Link>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={"link"}
            size={"icon"}
            className="md:hidden border-none"
          >
            <MenuIcon className="size-6 text-primary" />
            <SheetTitle className="sr-only">Toggle nav menu</SheetTitle>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-xs p-4">
          <nav className="grid gap-6 mt-4">
            <Link href={"/"}>
              <h2
                className={cn(
                  "text-zinc-700 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-zinc-700 after:transition-all after:duration-300 after:ease-in-out",
                  pathname.includes("/")
                    ? "after:w-full after:bg-linear-to-r after:from-zinc-600 after:to-zinc-800 font-medium"
                    : "after:w-0 hover:after:w-full",
                )}
              >
                HOME
              </h2>
            </Link>
            <Link href={"/inventory"}>
              <h2
                className={cn(
                  "text-zinc-700 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-zinc-700 after:transition-all after:duration-300 after:ease-in-out",
                  pathname.includes("/inventory")
                    ? "after:w-full after:bg-linear-to-r after:from-zinc-600 after:to-zinc-800 font-medium"
                    : "after:w-0 hover:after:w-full",
                )}
              >
                INVENTORY
              </h2>
            </Link>
            <Link href={"/favourites"}>
              <h2
                className={cn(
                  "text-zinc-700 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-zinc-700 after:transition-all after:duration-300 after:ease-in-out",
                  pathname.includes("/favourites")
                    ? "after:w-full after:bg-linear-to-r after:from-zinc-600 after:to-zinc-800 font-medium"
                    : "after:w-0 hover:after:w-full",
                )}
              >
                FAVOURITES
              </h2>
            </Link>
            <Link href={"/profile"}>
              <h2
                className={cn(
                  "text-zinc-700 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-zinc-700 after:transition-all after:duration-300 after:ease-in-out",
                  pathname.includes("/profile")
                    ? "after:w-full after:bg-linear-to-r after:from-zinc-600 after:to-zinc-800 font-medium"
                    : "after:w-0 hover:after:w-full",
                )}
              >
                PROFILE
              </h2>
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
